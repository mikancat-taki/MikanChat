import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Paperclip, 
  Mic, 
  Image, 
  Send 
} from "lucide-react";

interface MessageInputProps {
  onSendMessage: (content: string) => void;
  onTyping: (isTyping: boolean) => void;
}

export default function MessageInput({ onSendMessage, onTyping }: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

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

  return (
    <div className="bg-white border-t border-gray-200 p-4">
      <div className="flex items-end space-x-3">
        <Button
          variant="ghost"
          size="sm"
          className="p-2 text-gray-500 hover:text-gray-700"
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
          className="p-2 text-gray-500 hover:text-gray-700"
        >
          <Mic size={16} />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className="p-2 text-gray-500 hover:text-gray-700"
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
