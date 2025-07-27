import {
  users,
  chatRooms,
  messages,
  roomMembers,
  userRelationships,
  userMemos,
  type User,
  type UpsertUser,
  type ChatRoom,
  type InsertChatRoom,
  type Message,
  type InsertMessage,
  type RoomMember,
  type InsertRoomMember,
  type UserRelationship,
  type InsertUserRelationship,
  type UserMemo,
  type InsertUserMemo,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Chat room operations
  getChatRooms(): Promise<ChatRoom[]>;
  getChatRoom(id: string): Promise<ChatRoom | undefined>;
  createChatRoom(room: InsertChatRoom): Promise<ChatRoom>;
  
  // Message operations
  getMessages(roomId: string, limit?: number): Promise<(Message & { user: User })[]>;
  getMessagesForRoom(roomId: string, limit?: number): Promise<(Message & { user: User })[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  
  // Room member operations
  getRoomMembers(roomId: string): Promise<(RoomMember & { user: User })[]>;
  addRoomMember(member: InsertRoomMember): Promise<RoomMember>;
  
  // User relationship operations
  getUserRelationships(userId: string): Promise<{
    followers: (UserRelationship & { follower: User })[];
    following: (UserRelationship & { following: User })[];
  }>;
  createUserRelationship(relationship: InsertUserRelationship): Promise<UserRelationship>;
  
  // User memo operations
  getUserMemos(userId: string): Promise<UserMemo[]>;
  createUserMemo(memo: InsertUserMemo): Promise<UserMemo>;
  updateUserMemo(id: string, content: string): Promise<UserMemo>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Chat room operations
  async getChatRooms(): Promise<ChatRoom[]> {
    return await db.select().from(chatRooms);
  }

  async getChatRoom(id: string): Promise<ChatRoom | undefined> {
    const [room] = await db.select().from(chatRooms).where(eq(chatRooms.id, id));
    return room;
  }

  async createChatRoom(room: InsertChatRoom): Promise<ChatRoom> {
    const [newRoom] = await db.insert(chatRooms).values(room).returning();
    return newRoom;
  }

  // Message operations
  async getMessages(roomId: string, limit = 50): Promise<(Message & { user: User })[]> {
    return await db
      .select({
        id: messages.id,
        roomId: messages.roomId,
        userId: messages.userId,
        content: messages.content,
        messageType: messages.messageType,
        translatedContent: messages.translatedContent,
        originalLanguage: messages.originalLanguage,
        createdAt: messages.createdAt,
        user: users,
      })
      .from(messages)
      .innerJoin(users, eq(messages.userId, users.id))
      .where(eq(messages.roomId, roomId))
      .orderBy(desc(messages.createdAt))
      .limit(limit);
  }

  async getMessagesForRoom(roomId: string, limit = 50): Promise<(Message & { user: User })[]> {
    return await db
      .select({
        id: messages.id,
        roomId: messages.roomId,
        userId: messages.userId,
        content: messages.content,
        messageType: messages.messageType,
        translatedContent: messages.translatedContent,
        originalLanguage: messages.originalLanguage,
        createdAt: messages.createdAt,
        user: users,
      })
      .from(messages)
      .innerJoin(users, eq(messages.userId, users.id))
      .where(eq(messages.roomId, roomId))
      .orderBy(desc(messages.createdAt))
      .limit(limit);
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const [newMessage] = await db.insert(messages).values(message).returning();
    return newMessage;
  }

  // Room member operations
  async getRoomMembers(roomId: string): Promise<(RoomMember & { user: User })[]> {
    return await db
      .select({
        id: roomMembers.id,
        roomId: roomMembers.roomId,
        userId: roomMembers.userId,
        joinedAt: roomMembers.joinedAt,
        user: users,
      })
      .from(roomMembers)
      .innerJoin(users, eq(roomMembers.userId, users.id))
      .where(eq(roomMembers.roomId, roomId));
  }

  async addRoomMember(member: InsertRoomMember): Promise<RoomMember> {
    const [newMember] = await db.insert(roomMembers).values(member).returning();
    return newMember;
  }

  // User relationship operations
  async getUserRelationships(userId: string): Promise<{
    followers: (UserRelationship & { follower: User })[];
    following: (UserRelationship & { following: User })[];
  }> {
    const followers = await db
      .select({
        id: userRelationships.id,
        followerId: userRelationships.followerId,
        followingId: userRelationships.followingId,
        createdAt: userRelationships.createdAt,
        follower: users,
      })
      .from(userRelationships)
      .innerJoin(users, eq(userRelationships.followerId, users.id))
      .where(eq(userRelationships.followingId, userId));

    const following = await db
      .select({
        id: userRelationships.id,
        followerId: userRelationships.followerId,
        followingId: userRelationships.followingId,
        createdAt: userRelationships.createdAt,
        following: users,
      })
      .from(userRelationships)
      .innerJoin(users, eq(userRelationships.followingId, users.id))
      .where(eq(userRelationships.followerId, userId));

    return { followers, following };
  }

  async createUserRelationship(relationship: InsertUserRelationship): Promise<UserRelationship> {
    const [newRelationship] = await db
      .insert(userRelationships)
      .values(relationship)
      .returning();
    return newRelationship;
  }

  // User memo operations
  async getUserMemos(userId: string): Promise<UserMemo[]> {
    return await db
      .select()
      .from(userMemos)
      .where(eq(userMemos.userId, userId))
      .orderBy(desc(userMemos.updatedAt));
  }

  async createUserMemo(memo: InsertUserMemo): Promise<UserMemo> {
    const [newMemo] = await db.insert(userMemos).values(memo).returning();
    return newMemo;
  }

  async updateUserMemo(id: string, content: string): Promise<UserMemo> {
    const [updatedMemo] = await db
      .update(userMemos)
      .set({ content, updatedAt: new Date() })
      .where(eq(userMemos.id, id))
      .returning();
    return updatedMemo;
  }
}

export const storage = new DatabaseStorage();
