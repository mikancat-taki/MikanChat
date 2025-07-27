import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Languages, 
  Play, 
  User,
  ExternalLink
} from "lucide-react";

interface Message {
  id: string;
  content: string;
  user: {
    id: string;
    username: string;
    profileImageUrl?: string;
    country?: string;
  };
  createdAt: string;
  messageType?: string;
  translatedContent?: string;
}

interface MessageBubbleProps {
  message: Message;
  onUserClick: () => void;
}

const getCountryFlag = (country?: string) => {
  const flags: Record<string, { flag: string; color: string }> = {
    'JP': { flag: 'JP', color: 'flag-jp' },
    'US': { flag: 'US', color: 'flag-us' },
    'KR': { flag: 'KR', color: 'flag-kr' },
    'CN': { flag: 'CN', color: 'flag-cn' },
    'DE': { flag: 'DE', color: 'flag-de' },
    'FR': { flag: 'FR', color: 'flag-fr' },
    'ES': { flag: 'ES', color: 'flag-es' },
  };
  
  return flags[country || 'JP'] || flags['JP'];
};

const formatTime = (timestamp: string) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('ja-JP', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

export default function MessageBubble({ message, onUserClick }: MessageBubbleProps) {
  const { user: currentUser } = useAuth();
  const isOwnMessage = currentUser?.id === message.user.id;
  const countryInfo = getCountryFlag(message.user.country);

  if (isOwnMessage) {
    return (
      <div className="flex justify-end message-slide-in">
        <div className="max-w-xs lg:max-w-md">
          <div className="flex items-center justify-end space-x-2 mb-1">
            <span className="text-xs text-gray-500">
              {formatTime(message.createdAt)}
            </span>
            <Badge className={`country-flag ${countryInfo.color}`}>
              {countryInfo.flag}
            </Badge>
            <span className="font-medium text-gray-800 text-sm">あなた</span>
          </div>
          <div className="bg-mikan text-white rounded-lg px-4 py-2 shadow-sm">
            <p>{message.content}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start space-x-3 message-slide-in">
      <Avatar 
        className="w-8 h-8 cursor-pointer"
        onClick={onUserClick}
      >
        <AvatarImage 
          src={message.user.profileImageUrl} 
          alt={message.user.username}
          className="object-cover" 
        />
        <AvatarFallback>
          <User size={16} />
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1">
        <div className="flex items-center space-x-2 mb-1">
          <span 
            className="font-medium text-gray-800 text-sm cursor-pointer hover:underline"
            onClick={onUserClick}
          >
            {message.user.username || 'ユーザー'}
          </span>
          <Badge className={`country-flag ${countryInfo.color}`}>
            {countryInfo.flag}
          </Badge>
          <span className="text-xs text-gray-500">
            {formatTime(message.createdAt)}
          </span>
        </div>
        
        <div className="bg-white rounded-lg px-4 py-2 shadow-sm">
          {message.messageType === 'voice' ? (
            <div className="flex items-center space-x-3">
              <Button 
                size="sm" 
                className="w-8 h-8 bg-mikan rounded-full flex items-center justify-center text-white hover:bg-mikan-dark"
              >
                <Play size={12} />
              </Button>
              <div className="flex-1">
                <div className="h-2 bg-gray-200 rounded-full">
                  <div className="h-2 bg-mikan rounded-full w-1/3"></div>
                </div>
              </div>
              <span className="text-xs text-gray-500">0:15</span>
            </div>
          ) : message.messageType === 'image' ? (
            <div>
              <img 
                src="https://images.unsplash.com/photo-1522383225653-ed111181a951?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400"
                alt="Shared image" 
                className="rounded-lg w-full max-w-sm mb-2"
              />
              <p>{message.content}</p>
            </div>
          ) : message.messageType === 'url' ? (
            <div>
              <p className="mb-3">{message.content}</p>
              <div className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                    <ExternalLink className="text-white" size={16} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800 text-sm">Example Website</h4>
                    <p className="text-sm text-gray-600">This is a sample website description</p>
                    <p className="text-xs text-gray-500 mt-1">example.com</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p>{message.content}</p>
          )}
          
          {/* Translation */}
          {message.translatedContent && (
            <div className="mt-2 p-2 bg-blue-50 rounded text-sm text-blue-700 border-l-4 border-blue-300">
              <div className="flex items-center mb-1">
                <Languages size={12} className="mr-1" />
                <span className="text-xs font-medium">翻訳</span>
              </div>
              <p>{message.translatedContent}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
