import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MessageCircle } from "lucide-react";

interface RegistrationModalProps {
  open: boolean;
  onClose: () => void;
}

const countries = [
  { code: 'JP', name: '日本' },
  { code: 'US', name: 'アメリカ' },
  { code: 'KR', name: '韓国' },
  { code: 'CN', name: '中国' },
  { code: 'GB', name: 'イギリス' },
  { code: 'FR', name: 'フランス' },
  { code: 'DE', name: 'ドイツ' },
  { code: 'ES', name: 'スペイン' },
  { code: 'IT', name: 'イタリア' },
  { code: 'BR', name: 'ブラジル' },
];

const languages = [
  { code: 'ja', name: '日本語' },
  { code: 'en', name: 'English' },
  { code: 'ko', name: '한국어' },
  { code: 'zh', name: '中文' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'it', name: 'Italiano' },
  { code: 'pt', name: 'Português' },
];

export default function RegistrationModal({ open, onClose }: RegistrationModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [username, setUsername] = useState(user?.username || "");
  const [country, setCountry] = useState(user?.country || "");
  const [language, setLanguage] = useState(user?.language || "");

  const updateProfileMutation = useMutation({
    mutationFn: async (data: { username: string; country: string; language: string }) => {
      await apiRequest('PATCH', '/api/auth/user', data);
    },
    onSuccess: () => {
      toast({
        title: "プロフィール更新完了",
        description: "プロフィールを更新しました！",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "エラー",
        description: "プロフィールの更新に失敗しました。もう一度お試しください。",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim() || !country || !language) {
      toast({
        title: "入力エラー",
        description: "すべての項目を入力してください。",
        variant: "destructive",
      });
      return;
    }

    updateProfileMutation.mutate({
      username: username.trim(),
      country,
      language,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="w-16 h-16 bg-mikan rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="text-white text-2xl" size={32} />
          </div>
          <DialogTitle className="text-2xl font-bold text-gray-800 mb-2">
            みかんインターヘッド-チャット
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            アカウントを作成してチャットを始めましょう
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="username" className="text-sm font-medium text-gray-700 mb-2">
              ユーザー名
            </Label>
            <Input
              id="username"
              type="text"
              placeholder="ユーザー名を入力"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full focus:ring-mikan focus:border-mikan"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="country" className="text-sm font-medium text-gray-700 mb-2">
              国・地域
            </Label>
            <Select value={country} onValueChange={setCountry} required>
              <SelectTrigger className="w-full focus:ring-mikan focus:border-mikan">
                <SelectValue placeholder="国を選択してください" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country.code} value={country.code}>
                    {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="language" className="text-sm font-medium text-gray-700 mb-2">
              言語
            </Label>
            <Select value={language} onValueChange={setLanguage} required>
              <SelectTrigger className="w-full focus:ring-mikan focus:border-mikan">
                <SelectValue placeholder="言語を選択してください" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button
            type="submit"
            disabled={updateProfileMutation.isPending}
            className="w-full bg-mikan text-white py-3 rounded-lg font-semibold hover:bg-mikan-dark transition duration-200"
          >
            {updateProfileMutation.isPending ? "作成中..." : "アカウント作成"}
          </Button>
        </form>
        
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>
            アカウント作成により、
            <a href="#" className="text-mikan hover:underline">利用規約</a>
            と
            <a href="#" className="text-mikan hover:underline">プライバシーポリシー</a>
            に同意したことになります。
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
