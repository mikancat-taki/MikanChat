import { useState, useRef, useEffect } from "react";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import { 
  Menu, 
  Globe, 
  Users, 
  Search, 
  Info,
  User
} from "lucide-react";

interface ChatAreaProps {
  roomId: string;
  onUserClick: () => void;
}

const roomInfo = {
  "global-1": {
    name: "グローバルチャット",
    onlineCount: 2456,
    icon: Globe,
    iconColor: "bg-green-500",
  },
  "global-2": {
    name: "共有チャット２", 
    onlineCount: 1234,
    icon: Users,
    iconColor: "bg-blue-500",
  },
  "group-1": {
    name: "ゲームグループ",
    onlineCount: 12,
    icon: Users,
    iconColor: "bg-purple-500",
  },
  "private-1": {
    name: "田中太郎",
    onlineCount: 1,
    icon: User,
    iconColor: "bg-gray-500",
  },
};

export default function ChatArea({ roomId, onUserClick }: ChatAreaProps) {
  const { isConnected, messages, typingUsers, sendMessage, sendTyping } = useWebSocket(roomId);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const room = roomInfo[roomId as keyof typeof roomInfo] || roomInfo["global-1"];
  const Icon = room.icon;

  // Fetch initial messages
  const { data: initialMessages, isLoading } = useQuery({
    queryKey: ['/api/rooms', roomId, 'messages'],
    enabled: !!roomId,
  });

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (content: string, messageType = 'text') => {
    sendMessage(content, messageType);
  };

  const handleTyping = (isTyping: boolean) => {
    sendTyping(isTyping);
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mikan"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-screen pb-12 lg:pb-0">
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden text-gray-500"
          >
            <Menu size={20} />
          </Button>
          <div className={`w-8 h-8 ${room.iconColor} rounded-full flex items-center justify-center`}>
            <Icon className="text-white" size={12} />
          </div>
          <div>
            <h2 className="font-semibold text-gray-800">{room.name}</h2>
            <p className="text-sm text-gray-500">
              {room.onlineCount}人がオンライン中
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {!isConnected && (
            <div className="text-sm text-red-500 mr-4">接続中...</div>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-gray-700"
          >
            <Search size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-gray-700"
          >
            <Info size={16} />
          </Button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 scrollbar-thin scrollbar-thumb-gray-300">
        {/* System Message */}
        <div className="flex justify-center">
          <div className="bg-white rounded-full px-4 py-2 text-sm text-gray-600 shadow-sm">
            チャットルームに参加しました
          </div>
        </div>

        {/* Messages */}
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            onUserClick={onUserClick}
          />
        ))}

        {/* Typing indicator */}
        {typingUsers.length > 0 && (
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            <div className="bg-white rounded-lg px-4 py-2 shadow-sm">
              <div className="flex items-center space-x-1">
                <span className="text-sm text-gray-600">
                  {typingUsers.join(", ")} が入力中
                </span>
                <div className="flex space-x-1">
                  <div className="w-1 h-1 bg-gray-400 rounded-full typing-dot"></div>
                  <div className="w-1 h-1 bg-gray-400 rounded-full typing-dot"></div>
                  <div className="w-1 h-1 bg-gray-400 rounded-full typing-dot"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <MessageInput
        onSendMessage={handleSendMessage}
        onTyping={handleTyping}
      />
    </div>
  );
}
