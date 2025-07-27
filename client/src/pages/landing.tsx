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
      
      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-mikan rounded-full flex items-center justify-center">
                  <MessageCircle className="text-white" size={16} />
                </div>
                <span className="font-bold">みかんチャット</span>
              </div>
              <p className="text-gray-400 text-sm">
                世界中の人々とつながる<br />
                リアルタイムチャットアプリ
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">サポート</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">よくある質問</a></li>
                <li><a href="#" className="hover:text-white">ドキュメント</a></li>
                <li><a href="#" className="hover:text-white">お問い合わせ</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">法的情報</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">利用規約</a></li>
                <li><a href="#" className="hover:text-white">プライバシーポリシー</a></li>
                <li><a href="#" className="hover:text-white">コミュニティガイドライン</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">フォローする</h4>
              <div className="flex space-x-3">
                <a href="#" className="text-gray-400 hover:text-white">Twitter</a>
                <a href="#" className="text-gray-400 hover:text-white">Instagram</a>
                <a href="#" className="text-gray-400 hover:text-white">YouTube</a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-400">
            <p>&copy; 2025 みかんインターヘッド-チャット. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
