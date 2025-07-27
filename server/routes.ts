import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import {
  insertChatRoomSchema,
  insertMessageSchema,
  insertUserRelationshipSchema,
  insertUserMemoSchema,
} from "@shared/schema";

interface WebSocketMessage {
  type: string;
  data: any;
  roomId?: string;
}

interface AuthenticatedWebSocket extends WebSocket {
  userId?: string;
  roomId?: string;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.patch('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { username, country, language } = req.body;
      
      const updatedUser = await storage.upsertUser({
        id: userId,
        username,
        country,
        language,
        email: req.user.claims.email,
        firstName: req.user.claims.first_name,
        lastName: req.user.claims.last_name,
        profileImageUrl: req.user.claims.profile_image_url,
      });
      
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  // Chat room routes
  app.get('/api/rooms', isAuthenticated, async (req: any, res) => {
    try {
      const rooms = await storage.getChatRooms();
      res.json(rooms);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      res.status(500).json({ message: "Failed to fetch rooms" });
    }
  });

  app.post('/api/rooms', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const roomData = insertChatRoomSchema.parse({ ...req.body, createdBy: userId });
      const room = await storage.createChatRoom(roomData);
      res.json(room);
    } catch (error) {
      console.error("Error creating room:", error);
      res.status(500).json({ message: "Failed to create room" });
    }
  });

  app.get('/api/rooms/:roomId/messages', isAuthenticated, async (req: any, res) => {
    try {
      const { roomId } = req.params;
      const messages = await storage.getMessages(roomId);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  // User relationship routes
  app.get('/api/users/:userId/relationships', isAuthenticated, async (req: any, res) => {
    try {
      const { userId } = req.params;
      const relationships = await storage.getUserRelationships(userId);
      res.json(relationships);
    } catch (error) {
      console.error("Error fetching relationships:", error);
      res.status(500).json({ message: "Failed to fetch relationships" });
    }
  });

  app.post('/api/relationships', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const relationshipData = insertUserRelationshipSchema.parse({
        ...req.body,
        followerId: userId,
      });
      const relationship = await storage.createUserRelationship(relationshipData);
      res.json(relationship);
    } catch (error) {
      console.error("Error creating relationship:", error);
      res.status(500).json({ message: "Failed to create relationship" });
    }
  });

  // User memo routes
  app.get('/api/memos', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const memos = await storage.getUserMemos(userId);
      res.json(memos);
    } catch (error) {
      console.error("Error fetching memos:", error);
      res.status(500).json({ message: "Failed to fetch memos" });
    }
  });

  app.post('/api/memos', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const memoData = insertUserMemoSchema.parse({ ...req.body, userId });
      const memo = await storage.createUserMemo(memoData);
      res.json(memo);
    } catch (error) {
      console.error("Error creating memo:", error);
      res.status(500).json({ message: "Failed to create memo" });
    }
  });

  app.patch('/api/memos/:id', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const { content } = req.body;
      const memo = await storage.updateUserMemo(id, content);
      res.json(memo);
    } catch (error) {
      console.error("Error updating memo:", error);
      res.status(500).json({ message: "Failed to update memo" });
    }
  });

  const httpServer = createServer(app);

  // WebSocket server for real-time messaging
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on('connection', (ws: AuthenticatedWebSocket, req) => {
    console.log('New WebSocket connection');

    ws.on('message', async (data) => {
      try {
        const message: WebSocketMessage = JSON.parse(data.toString());
        
        switch (message.type) {
          case 'auth':
            // In a real implementation, you'd validate the auth token
            ws.userId = message.data.userId;
            break;
            
          case 'join_room':
            ws.roomId = message.data.roomId;
            // Add user to room members if not already added
            try {
              await storage.addRoomMember({
                roomId: message.data.roomId,
                userId: ws.userId!,
              });
            } catch (error) {
              // User might already be a member
            }
            break;
            
          case 'send_message':
            if (ws.userId && message.data.roomId) {
              // Create message in database
              const newMessage = await storage.createMessage({
                roomId: message.data.roomId,
                userId: ws.userId,
                content: message.data.content,
                messageType: message.data.messageType || 'text',
                originalLanguage: message.data.originalLanguage,
                translatedContent: message.data.translatedContent,
              });

              // Get user info for the message
              const user = await storage.getUser(ws.userId);
              
              // Broadcast to all clients in the same room
              const messageWithUser = { ...newMessage, user };
              
              wss.clients.forEach((client: AuthenticatedWebSocket) => {
                if (
                  client !== ws &&
                  client.readyState === WebSocket.OPEN &&
                  client.roomId === message.data.roomId
                ) {
                  client.send(JSON.stringify({
                    type: 'new_message',
                    data: messageWithUser,
                  }));
                }
              });
              
              // Send confirmation back to sender
              ws.send(JSON.stringify({
                type: 'message_sent',
                data: messageWithUser,
              }));
            }
            break;
            
          case 'typing':
            // Broadcast typing indicator to room members
            if (ws.userId && message.data.roomId) {
              const user = await storage.getUser(ws.userId);
              wss.clients.forEach((client: AuthenticatedWebSocket) => {
                if (
                  client !== ws &&
                  client.readyState === WebSocket.OPEN &&
                  client.roomId === message.data.roomId
                ) {
                  client.send(JSON.stringify({
                    type: 'user_typing',
                    data: {
                      user: user,
                      isTyping: message.data.isTyping,
                    },
                  }));
                }
              });
            }
            break;
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
        ws.send(JSON.stringify({
          type: 'error',
          data: { message: 'Invalid message format' },
        }));
      }
    });

    ws.on('close', () => {
      console.log('WebSocket connection closed');
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  });

  return httpServer;
}
