import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";

interface MemoModalProps {
  open: boolean;
  onClose: () => void;
}

export default function MemoModal({ open, onClose }: MemoModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [memoContent, setMemoContent] = useState("");

  // Fetch user memos
  const { data: memos } = useQuery({
    queryKey: ['/api/memos'],
    enabled: open,
  });

  // Load the first memo if available
  useEffect(() => {
    if (memos && memos.length > 0) {
      setMemoContent(memos[0].content);
    }
  }, [memos]);

  const saveMemoMutation = useMutation({
    mutationFn: async (content: string) => {
      if (memos && memos.length > 0) {
        // Update existing memo
        await apiRequest('PATCH', `/api/memos/${memos[0].id}`, { content });
      } else {
        // Create new memo
        await apiRequest('POST', '/api/memos', { content });
      }
    },
    onSuccess: () => {
      toast({
        title: "メモ保存完了",
        description: "メモを保存しました",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/memos'] });
      onClose();
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
        description: "メモの保存に失敗しました",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    if (!memoContent.trim()) {
      toast({
        title: "入力エラー",
        description: "メモ内容を入力してください",
        variant: "destructive",
      });
      return;
    }

    saveMemoMutation.mutate(memoContent.trim());
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold text-gray-800">
              メモ
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={16} />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="py-4">
          <Textarea
            placeholder="メモを入力してください..."
            value={memoContent}
            onChange={(e) => setMemoContent(e.target.value)}
            className="w-full h-40 resize-none focus:ring-mikan focus:border-mikan"
          />
        </div>
        
        <div className="flex justify-end space-x-3">
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-gray-600 hover:bg-gray-100"
          >
            キャンセル
          </Button>
          <Button
            onClick={handleSave}
            disabled={saveMemoMutation.isPending}
            className="bg-mikan text-white hover:bg-mikan-dark"
          >
            {saveMemoMutation.isPending ? "保存中..." : "保存"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
