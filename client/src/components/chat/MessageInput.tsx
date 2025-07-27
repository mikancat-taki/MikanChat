import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  Paperclip, 
  Mic, 
  Image, 
  Send,
  Square
} from "lucide-react";

interface MessageInputProps {
  onSendMessage: (content: string, messageType?: string) => void;
  onTyping: (isTyping: boolean) => void;
}

export default function MessageInput({ onSendMessage, onTyping }: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const { toast } = useToast();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (value: string) => {
    setMessage(value);
    
    // Handle typing indicator
    if (!isTyping) {
      setIsTyping(true);
      onTyping(true);
    }
    
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      onTyping(false);
    }, 1000);
  };

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage("");
      
      // Stop typing indicator
      if (isTyping) {
        setIsTyping(false);
        onTyping(false);
      }
      
      // Clear timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = () => {
    imageInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // For now, just send a text message with file name
      onSendMessage(`📎 ファイルを共有しました: ${file.name}`, 'file');
      toast({
        title: "ファイル共有",
        description: `${file.name} を共有しました`,
      });
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // For now, just send a text message with image name
      onSendMessage(`🖼️ 画像を共有しました: ${file.name}`, 'image');
      toast({
        title: "画像共有",
        description: `${file.name} を共有しました`,
      });
    }
  };

  const handleVoiceRecord = () => {
    if (!isRecording) {
      setIsRecording(true);
      toast({
        title: "音声録音開始",
        description: "録音を開始しました",
      });
      
      // Simulate recording for demo
      setTimeout(() => {
        setIsRecording(false);
        onSendMessage("🎤 音声メッセージを送信しました (15秒)", 'voice');
        toast({
          title: "音声送信完了",
          description: "音声メッセージを送信しました",
        });
      }, 3000);
    } else {
      setIsRecording(false);
      toast({
        title: "録音停止",
        description: "録音を停止しました",
      });
    }
  };

  const handlePaste = async (event: React.ClipboardEvent) => {
    const items = event.clipboardData.items;
    
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      
      if (item.type.indexOf('image/') === 0) {
        event.preventDefault();
        const file = item.getAsFile();
        if (file) {
          onSendMessage(`🖼️ クリップボードから画像を貼り付けました: ${file.name || 'image.png'}`, 'image');
          toast({
            title: "画像貼り付け",
            description: "クリップボードから画像を貼り付けました",
          });
        }
        return;
      }
      
      if (item.type === 'text/plain') {
        try {
          const text = await new Promise<string>((resolve) => {
            item.getAsString(resolve);
          });
          
          // Check if it's a URL
          if (text.startsWith('http://') || text.startsWith('https://')) {
            event.preventDefault();
            onSendMessage(`🔗 リンクを共有しました: ${text}`, 'link');
            toast({
              title: "リンク共有",
              description: "クリップボードからリンクを貼り付けました",
            });
            return;
          }
        } catch (error) {
          console.error('Error reading clipboard text:', error);
        }
      }
    }
  };

  return (
    <div className="bg-white border-t border-gray-200 p-4">
      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileChange}
        accept="*/*"
      />
      <input
        ref={imageInputRef}
        type="file"
        className="hidden"
        onChange={handleImageChange}
        accept="image/*"
      />
      
      <div className="flex items-end space-x-3">
        <Button
          variant="ghost"
          size="sm"
          className="p-2 text-gray-500 hover:text-gray-700"
          onClick={handleFileUpload}
        >
          <Paperclip size={16} />
        </Button>
        
        <div className="flex-1">
          <div className="bg-gray-100 rounded-lg px-4 py-3 min-h-[44px] max-h-32">
            <Textarea
              ref={textareaRef}
              placeholder="メッセージを入力..."
              value={message}
              className="w-full bg-transparent resize-none border-none outline-none text-gray-800 placeholder-gray-500 p-0 min-h-0 focus-visible:ring-0"
              rows={1}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyPress={handleKeyPress}
              onPaste={handlePaste}
              style={{
                height: 'auto',
                minHeight: '20px',
                maxHeight: '80px',
              }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = Math.min(target.scrollHeight, 80) + 'px';
              }}
            />
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          className={`p-2 transition duration-200 ${
            isRecording 
              ? 'text-red-500 bg-red-50 hover:bg-red-100' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={handleVoiceRecord}
        >
          {isRecording ? <Square size={16} /> : <Mic size={16} />}
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className="p-2 text-gray-500 hover:text-gray-700"
          onClick={handleImageUpload}
        >
          <Image size={16} />
        </Button>
        
        <Button
          onClick={handleSend}
          disabled={!message.trim()}
          className="bg-mikan text-white p-2 hover:bg-mikan-dark transition duration-200"
        >
          <Send size={16} />
        </Button>
      </div>
    </div>
  );
}
