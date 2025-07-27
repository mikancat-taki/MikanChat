import { useAuth } from "@/hooks/useAuth";
import { useJapanTime } from "@/hooks/useJapanTime";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  MessageCircle, 
  Globe, 
  Users, 
  Settings, 
  MoreHorizontal,
  User
} from "lucide-react";

interface ChatSidebarProps {
  selectedRoomId: string;
  onRoomSelect: (roomId: string) => void;
  onSettingsClick: () => void;
  onProfileClick: () => void;
}

const chatRooms = [
  {
    id: "global-1",
    name: "グローバルチャット",
    type: "global",
    icon: Globe,
    onlineCount: 2456,
    hasNotification: true,
  },
  {
    id: "global-2", 
    name: "共有チャット２",
    type: "global",
    icon: Users,
    onlineCount: 1234,
    hasNotification: false,
  },
];

const groupChats = [
  {
    id: "group-1",
    name: "ゲームグループ",
    memberCount: 12,
    initial: "G",
    color: "bg-purple-500",
  },
];

const privateChats = [
  {
    id: "private-1",
    userName: "田中太郎",
    lastMessage: "こんにちは！",
    time: "14:25",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=32&h=32&fit=crop&crop=face",
  },
];

export default function ChatSidebar({ 
  selectedRoomId, 
  onRoomSelect, 
  onSettingsClick,
  onProfileClick 
}: ChatSidebarProps) {
  const { user } = useAuth();
  const japanTime = useJapanTime();

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-screen">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-mikan rounded-full flex items-center justify-center">
            <MessageCircle className="text-white" size={20} />
          </div>
          <h1 className="font-bold text-lg text-gray-800">みかんチャット</h1>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onSettingsClick}
          className="text-gray-500 hover:text-gray-700"
        >
          <Settings size={16} />
        </Button>
      </div>

      {/* Japan Time Display */}
      <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">日本時間</span>
          <span className="font-mono text-gray-800">{japanTime}</span>
        </div>
      </div>

      {/* Chat Room List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
        <div className="p-2">
          {/* Global Chats */}
          <div className="mb-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-2 mb-2">
              共有チャット
            </h3>
            <div className="space-y-1">
              {chatRooms.map((room) => {
                const Icon = room.icon;
                const isSelected = selectedRoomId === room.id;
                
                return (
                  <Button
                    key={room.id}
                    variant={isSelected ? "secondary" : "ghost"}
                    className="w-full justify-start px-3 py-2 h-auto"
                    onClick={() => onRoomSelect(room.id)}
                  >
                    <div className="flex items-center space-x-3 w-full">
                      <div className={`w-8 h-8 ${room.type === 'global' && room.id === 'global-1' ? 'bg-green-500' : 'bg-blue-500'} rounded-full flex items-center justify-center`}>
                        <Icon className="text-white" size={12} />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-medium text-gray-800 text-sm">{room.name}</div>
                        <div className="text-xs text-gray-500">{room.onlineCount}人オンライン</div>
                      </div>
                      {room.hasNotification && (
                        <div className="w-2 h-2 bg-mikan rounded-full"></div>
                      )}
                    </div>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Group Chats */}
          <div className="mb-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-2 mb-2">
              グループチャット
            </h3>
            <div className="space-y-1">
              {groupChats.map((group) => {
                const isSelected = selectedRoomId === group.id;
                
                return (
                  <Button
                    key={group.id}
                    variant={isSelected ? "secondary" : "ghost"}
                    className="w-full justify-start px-3 py-2 h-auto"
                    onClick={() => onRoomSelect(group.id)}
                  >
                    <div className="flex items-center space-x-3 w-full">
                      <div className={`w-8 h-8 ${group.color} rounded-full flex items-center justify-center`}>
                        <span className="text-white text-xs font-bold">{group.initial}</span>
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-medium text-gray-800 text-sm">{group.name}</div>
                        <div className="text-xs text-gray-500">{group.memberCount}人</div>
                      </div>
                    </div>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Private Chats */}
          <div className="mb-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-2 mb-2">
              個人チャット
            </h3>
            <div className="space-y-1">
              {privateChats.map((chat) => {
                const isSelected = selectedRoomId === chat.id;
                
                return (
                  <Button
                    key={chat.id}
                    variant={isSelected ? "secondary" : "ghost"}
                    className="w-full justify-start px-3 py-2 h-auto"
                    onClick={() => onRoomSelect(chat.id)}
                  >
                    <div className="flex items-center space-x-3 w-full">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={chat.avatar} alt={chat.userName} />
                        <AvatarFallback>
                          <User size={16} />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 text-left">
                        <div className="font-medium text-gray-800 text-sm">{chat.userName}</div>
                        <div className="text-xs text-gray-500 truncate">{chat.lastMessage}</div>
                      </div>
                      <div className="text-xs text-gray-400">{chat.time}</div>
                    </div>
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <Avatar className="w-10 h-10" onClick={onProfileClick}>
            <AvatarImage 
              src={user?.profileImageUrl} 
              alt={user?.username || "Profile"} 
              className="object-cover"
            />
            <AvatarFallback>
              <User size={20} />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="font-medium text-gray-800 text-sm">
              {user?.username || `${user?.firstName} ${user?.lastName}`.trim() || "ユーザー"}
            </div>
            <div className="text-xs text-green-500 flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
              オンライン
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-gray-700"
          >
            <MoreHorizontal size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}
