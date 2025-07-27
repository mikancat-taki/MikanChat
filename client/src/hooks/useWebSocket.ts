import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "./useAuth";

interface WebSocketMessage {
  type: string;
  data: any;
}

interface Message {
  id: string;
  content: string;
  user: {
    id: string;
    username: string;
    profileImageUrl: string;
    country: string;
  };
  createdAt: string;
  messageType?: string;
  translatedContent?: string;
}

export function useWebSocket(roomId: string) {
  const { user } = useAuth();
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  const connect = useCallback(() => {
    if (!user) return;

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log("WebSocket connected");
      setIsConnected(true);
      
      // Authenticate with the server
      ws.send(JSON.stringify({
        type: 'auth',
        data: { userId: user.id }
      }));

      // Join the room
      ws.send(JSON.stringify({
        type: 'join_room',
        data: { roomId }
      }));
    };

    ws.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        
        switch (message.type) {
          case 'new_message':
          case 'message_sent':
            setMessages(prev => [message.data, ...prev]);
            break;
            
          case 'user_typing':
            if (message.data.isTyping) {
              setTypingUsers(prev => {
                if (!prev.includes(message.data.user.username)) {
                  return [...prev, message.data.user.username];
                }
                return prev;
              });
            } else {
              setTypingUsers(prev => 
                prev.filter(username => username !== message.data.user.username)
              );
            }
            break;
            
          case 'error':
            console.error('WebSocket error:', message.data);
            break;
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
      setIsConnected(false);
      
      // Reconnect after 3 seconds
      reconnectTimeoutRef.current = setTimeout(() => {
        connect();
      }, 3000);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    setSocket(ws);
  }, [user, roomId]);

  useEffect(() => {
    connect();

    return () => {
      if (socket) {
        socket.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [connect]);

  const sendMessage = useCallback((content: string, messageType = 'text') => {
    if (socket && socket.readyState === WebSocket.OPEN && user) {
      // Mock translation for non-English content
      let translatedContent = undefined;
      const hasNonAscii = /[^\x00-\x7F]/.test(content);
      if (hasNonAscii && user.language !== 'en') {
        translatedContent = "Hello! How is everyone doing?"; // Mock translation
      }

      socket.send(JSON.stringify({
        type: 'send_message',
        data: {
          roomId,
          content,
          messageType,
          originalLanguage: user.language || 'ja',
          translatedContent,
        }
      }));
    }
  }, [socket, roomId, user]);

  const sendTyping = useCallback((isTyping: boolean) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        type: 'typing',
        data: {
          roomId,
          isTyping,
        }
      }));
    }
  }, [socket, roomId]);

  return {
    isConnected,
    messages,
    typingUsers,
    sendMessage,
    sendTyping,
  };
}
