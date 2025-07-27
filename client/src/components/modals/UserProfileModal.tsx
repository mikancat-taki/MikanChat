import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  UserPlus, 
  MessageCircle, 
  User,
  X
} from "lucide-react";

interface User {
  id: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  country?: string;
  email?: string;
}

interface UserProfileModalProps {
  open: boolean;
  onClose: () => void;
  user: User;
}

const getCountryFlag = (country?: string) => {
  const flags: Record<string, { flag: string; color: string; name: string }> = {
    'JP': { flag: 'JP', color: 'flag-jp', name: '日本' },
    'US': { flag: 'US', color: 'flag-us', name: 'アメリカ' },
    'KR': { flag: 'KR', color: 'flag-kr', name: '韓国' },
    'CN': { flag: 'CN', color: 'flag-cn', name: '中国' },
    'DE': { flag: 'DE', color: 'flag-de', name: 'ドイツ' },
    'FR': { flag: 'FR', color: 'flag-fr', name: 'フランス' },
    'ES': { flag: 'ES', color: 'flag-es', name: 'スペイン' },
  };
  
  return flags[country || 'JP'] || flags['JP'];
};

export default function UserProfileModal({ open, onClose, user }: UserProfileModalProps) {
  const { toast } = useToast();
  const [isFollowing, setIsFollowing] = useState(false);
  
  const countryInfo = getCountryFlag(user.country);
  const displayName = user.username || `${user.firstName} ${user.lastName}`.trim() || "ユーザー";

  // Get user relationships
  const { data: relationships } = useQuery({
    queryKey: ['/api/users', user.id, 'relationships'],
    enabled: open && !!user.id,
  });

  const followMutation = useMutation({
    mutationFn: async () => {
      await apiRequest('POST', '/api/relationships', {
        followingId: user.id,
      });
    },
    onSuccess: () => {
      setIsFollowing(true);
      toast({
        title: "フォロー完了",
        description: `${displayName}をフォローしました`,
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "エラー",
        description: "フォローに失敗しました",
        variant: "destructive",
      });
    },
  });

  const handleFollow = () => {
    followMutation.mutate();
  };

  const handleMessage = () => {
    // This would typically navigate to a private chat with the user
    toast({
      title: "メッセージ機能",
      description: "個人チャット機能は開発中です",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <X size={16} />
          </Button>
        </DialogHeader>
        
        <div className="text-center py-4">
          <Avatar className="w-20 h-20 mx-auto mb-4">
            <AvatarImage 
              src={user.profileImageUrl} 
              alt={displayName}
              className="object-cover"
            />
            <AvatarFallback>
              <User size={32} />
            </AvatarFallback>
          </Avatar>
          
          <DialogTitle className="text-xl font-bold text-gray-800 mb-1">
            {displayName}
          </DialogTitle>
          
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Badge className={`country-flag ${countryInfo.color}`}>
              {countryInfo.flag}
            </Badge>
            <span className="text-gray-600">{countryInfo.name}</span>
          </div>
          
          <div className="flex justify-center space-x-4 mb-6">
            <Button
              onClick={handleFollow}
              disabled={followMutation.isPending || isFollowing}
              className="bg-mikan text-white px-4 py-2 rounded-lg hover:bg-mikan-dark transition duration-200"
            >
              <UserPlus size={16} className="mr-2" />
              {isFollowing ? "フォロー中" : "フォロー"}
            </Button>
            <Button
              onClick={handleMessage}
              variant="outline"
              className="px-4 py-2 rounded-lg hover:bg-gray-100 transition duration-200"
            >
              <MessageCircle size={16} className="mr-2" />
              メッセージ
            </Button>
          </div>
          
          <div className="flex justify-center space-x-6 text-center">
            <div>
              <div className="font-bold text-gray-800">
                {relationships?.followers?.length || 0}
              </div>
              <div className="text-sm text-gray-600">フォロワー</div>
            </div>
            <div>
              <div className="font-bold text-gray-800">
                {relationships?.following?.length || 0}
              </div>
              <div className="text-sm text-gray-600">フォロー中</div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
