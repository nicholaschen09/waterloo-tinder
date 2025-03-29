import { useState } from "react";
import { ChatPreview } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import EmojiPicker from "emoji-picker-react";
import { Smile, ArrowLeft } from "lucide-react";


interface ChatBoxProps {
  chat: ChatPreview;
  onBack: () => void;
}

export default function ChatBox({ chat, onBack }: ChatBoxProps) {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    // TODO: Implement sending message
    setMessage("");
  };

   const onEmojiClick = (emojiObject: { emoji: string }) => {
    setMessage((prevMessage) => prevMessage + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  return (
    <div className="h-[600px] flex flex-col border rounded-md">
      {/* Chat Header */}
      <div className="p-4 border-b flex items-center">
        <button
          onClick={onBack}
          className="md:hidden mr-3 text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <Avatar className="h-10 w-10 mr-3">
          <AvatarImage src={chat.user.photos[0]} alt={chat.user.name} />
          <AvatarFallback>{chat.user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold">{chat.user.name}, {chat.user.age}</h3>
          <p className="text-sm text-muted-foreground">Online</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 p-4 overflow-y-auto">
        {/* TODO: Add messages here */}
      </div>

      {/* Message Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="w-full px-4 py-2 rounded-full border focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              <Smile className="h-5 w-5" />
            </button>
            {showEmojiPicker && (
              <div className="absolute bottom-full right-0 mb-2 z-50">
                <EmojiPicker onEmojiClick={onEmojiClick} />
              </div>
            )}
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
} 