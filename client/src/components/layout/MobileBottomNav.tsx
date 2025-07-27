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
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-40">
      <div className="flex justify-around">
        <Button
          variant="ghost"
          className="flex flex-col items-center py-2 px-3 text-mikan"
        >
          <MessageCircle size={20} />
          <span className="text-xs mt-1">チャット</span>
        </Button>
        
        <Button
          variant="ghost"
          className="flex flex-col items-center py-2 px-3 text-gray-500"
        >
          <Users size={20} />
          <span className="text-xs mt-1">グループ</span>
        </Button>
        
        <Button
          variant="ghost"
          className="flex flex-col items-center py-2 px-3 text-gray-500"
        >
          <Search size={20} />
          <span className="text-xs mt-1">検索</span>
        </Button>
        
        <Button
          variant="ghost"
          className="flex flex-col items-center py-2 px-3 text-gray-500"
          onClick={onMemoClick}
        >
          <StickyNote size={20} />
          <span className="text-xs mt-1">メモ</span>
        </Button>
        
        <Button
          variant="ghost"
          className="flex flex-col items-center py-2 px-3 text-gray-500"
          onClick={onProfileClick}
        >
          <User size={20} />
          <span className="text-xs mt-1">プロフィール</span>
        </Button>
      </div>
    </div>
  );
}
