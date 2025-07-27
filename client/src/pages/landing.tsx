import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle } from "lucide-react";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-mikan rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="text-white text-2xl" size={32} />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800 mb-2">
            みかんインターヘッド-チャット
          </CardTitle>
          <p className="text-gray-600">
            世界中の人々とつながるリアルタイムチャットアプリ
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button
              onClick={handleLogin}
              className="w-full bg-mikan text-white py-3 rounded-lg font-semibold hover:bg-mikan-dark transition duration-200"
            >
              ログイン / アカウント作成
            </Button>
            
            <div className="text-center text-sm text-gray-500">
              <p>
                アカウント作成により、
                <a href="#" className="text-mikan hover:underline ml-1">利用規約</a>
                と
                <a href="#" className="text-mikan hover:underline ml-1">プライバシーポリシー</a>
                に同意したことになります。
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Simplified Footer */}
      <footer className="mt-8 bg-gray-100 text-gray-600 py-4">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="text-xs space-y-1">
            <p>&copy; 2025 みかんインターヘッド-チャット. All rights reserved.</p>
            <div className="flex justify-center space-x-4">
              <a href="#" className="hover:text-mikan">利用規約</a>
              <a href="#" className="hover:text-mikan">プライバシーポリシー</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
