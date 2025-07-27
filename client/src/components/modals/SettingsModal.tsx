import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { 
  X,
  Shield,
  EyeOff,
  HelpCircle,
  FileText,
  Gavel,
  ShieldQuestion
} from "lucide-react";

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

export default function SettingsModal({ open, onClose }: SettingsModalProps) {
  const [language, setLanguage] = useState("ja");
  const [notifications, setNotifications] = useState(true);
  const [followNotifications, setFollowNotifications] = useState(true);

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold text-gray-800">
              設定
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
        
        <div className="space-y-6 py-4">
          {/* Language Settings */}
          <div>
            <Label className="text-base font-semibold text-gray-800 mb-3 block">
              言語設定
            </Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ja">日本語</SelectItem>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="ko">한국어</SelectItem>
                <SelectItem value="zh">中文</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Notification Settings */}
          <div>
            <Label className="text-base font-semibold text-gray-800 mb-3 block">
              通知設定
            </Label>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="notifications" className="text-gray-700">
                  新しいメッセージ
                </Label>
                <Switch
                  id="notifications"
                  checked={notifications}
                  onCheckedChange={setNotifications}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="follow-notifications" className="text-gray-700">
                  フォロー通知
                </Label>
                <Switch
                  id="follow-notifications"
                  checked={followNotifications}
                  onCheckedChange={setFollowNotifications}
                />
              </div>
            </div>
          </div>
          
          {/* Privacy Settings */}
          <div>
            <Label className="text-base font-semibold text-gray-800 mb-3 block">
              プライバシー
            </Label>
            <div className="space-y-1">
              <Button
                variant="ghost"
                className="w-full justify-start px-4 py-2 text-left hover:bg-gray-100"
              >
                <Shield className="mr-3 text-gray-500" size={16} />
                ブロックしたユーザー
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start px-4 py-2 text-left hover:bg-gray-100"
              >
                <EyeOff className="mr-3 text-gray-500" size={16} />
                プライバシー設定
              </Button>
            </div>
          </div>
          
          {/* Support */}
          <div>
            <Label className="text-base font-semibold text-gray-800 mb-3 block">
              サポート
            </Label>
            <div className="space-y-1">
              <Button
                variant="ghost"
                className="w-full justify-start px-4 py-2 text-left hover:bg-gray-100"
              >
                <HelpCircle className="mr-3 text-gray-500" size={16} />
                よくある質問
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start px-4 py-2 text-left hover:bg-gray-100"
              >
                <FileText className="mr-3 text-gray-500" size={16} />
                ドキュメント
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start px-4 py-2 text-left hover:bg-gray-100"
              >
                <Gavel className="mr-3 text-gray-500" size={16} />
                利用規約
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start px-4 py-2 text-left hover:bg-gray-100"
              >
                <ShieldQuestion className="mr-3 text-gray-500" size={16} />
                プライバシーポリシー
              </Button>
            </div>
          </div>
          
          {/* Account Actions */}
          <div className="pt-4 border-t border-gray-200">
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full text-red-600 border-red-200 hover:bg-red-50"
            >
              ログアウト
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
