import { Button } from "@/components/ui/button";
import { 
  MessageCircle, 
  Users, 
  Search, 
  StickyNote,
  User
} from "lucide-react";

interface MobileBottomNavProps {
  onMemoClick: () => void;
  onProfileClick: () => void;
}

export default function MobileBottomNav({ onMemoClick, onProfileClick }: MobileBottomNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-1 z-40 h-12">
      <div className="flex justify-around h-full">
        <Button
          variant="ghost"
          className="flex flex-col items-center justify-center p-1 text-mikan h-full min-w-0"
        >
          <MessageCircle size={16} />
          <span className="text-xs leading-none">チャット</span>
        </Button>
        
        <Button
          variant="ghost"
          className="flex flex-col items-center justify-center p-1 text-gray-500 h-full min-w-0"
        >
          <Users size={16} />
          <span className="text-xs leading-none">グループ</span>
        </Button>
        
        <Button
          variant="ghost"
          className="flex flex-col items-center justify-center p-1 text-gray-500 h-full min-w-0"
        >
          <Search size={16} />
          <span className="text-xs leading-none">検索</span>
        </Button>
        
        <Button
          variant="ghost"
          className="flex flex-col items-center justify-center p-1 text-gray-500 h-full min-w-0"
          onClick={onMemoClick}
        >
          <StickyNote size={16} />
          <span className="text-xs leading-none">メモ</span>
        </Button>
        
        <Button
          variant="ghost"
          className="flex flex-col items-center justify-center p-1 text-gray-500 h-full min-w-0"
          onClick={onProfileClick}
        >
          <User size={16} />
          <span className="text-xs leading-none">プロフィール</span>
        </Button>
      </div>
    </div>
  );
}
