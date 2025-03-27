"use client";

import { useState, useEffect } from "react";
import ChatBox from "@/components/ChatBox";
import { MOCK_USERS } from "@/data/mockData";
import Header from "@/components/header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/types";
import { formatDistanceToNow } from "date-fns";

interface ChatPreview {
  user: User;
  lastMessage: string;
  timestamp: Date;
  unread: boolean;
}

// Generate random chat previews based on mock users
const generateChatPreviews = (users: User[], count: number): ChatPreview[] => {
  const shuffled = [...users].sort(() => 0.5 - Math.random());
  const selectedUsers = shuffled.slice(0, count);

  const messages = [
    "Hey, how's it going?",
    "When are you free to meet up?",
    "I'm in your program too!",
    "Do you have Professor Smith too?",
    "Want to grab coffee at SLC?",
    "Are you going to the event tonight?",
    "Did you finish the assignment?",
    "Nice to match with you!",
    "What are you studying for?",
    "Have you been to the new restaurant on campus?"
  ];

  return selectedUsers.map(user => ({
    user,
    lastMessage: messages[Math.floor(Math.random() * messages.length)],
    timestamp: new Date(Date.now() - Math.floor(Math.random() * 604800000)), // Random time in the last week
    unread: Math.random() > 0.7 // 30% chance of unread message
  }));
};


export default function MessagesPage() {
  const [chats, setChats] = useState<ChatPreview[]>([]);
  const [selectedChat, setSelectedChat] = useState<ChatPreview | null>(null);

  useEffect(() => {
    // Generate 3-8 chat previews
    const chatCount = Math.floor(Math.random() * 6) + 3;
    setChats(generateChatPreviews(MOCK_USERS, chatCount));
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 container max-w-5xl py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Messages</h1>

        <div className="flex flex-col md:flex-row gap-4">
          {/* Chat List */}
          <div className={`flex-1 divide-y rounded-md border ${
            selectedChat ? 'hidden md:block' : 'block'
          }`}>
            {chats.length > 0 ? (
              chats.map((chat, index) => (
                <div
                  key={chat.user.id}
                  onClick={() => setSelectedChat(chat)}
                  className={`flex items-center p-4 hover:bg-muted/50 transition cursor-pointer ${
                    selectedChat?.user.id === chat.user.id ? "bg-muted" : ""
                  } ${chat.unread ? "bg-muted/30" : ""}`}
                >
                  <Avatar className="h-12 w-12 mr-4">
                    <AvatarImage src={chat.user.photos[0]} alt={chat.user.name} />
                    <AvatarFallback>{chat.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-medium truncate">
                        {chat.user.name}, {chat.user.age}
                      </h4>
                      <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                        {formatDistanceToNow(chat.timestamp, { addSuffix: true })}
                      </span>
                    </div>

                    <div className="flex items-center">
                      <p className={`text-sm truncate ${chat.unread ? "font-medium" : "text-muted-foreground"}`}>
                        {chat.lastMessage}
                      </p>

                      {chat.unread && (
                        <span className="ml-2 h-2 w-2 rounded-full bg-primary flex-shrink-0"></span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-20 text-center">
                <h2 className="text-2xl font-bold mb-2">No messages yet</h2>
                <p className="text-muted-foreground">
                  Match with someone to start a conversation!
                </p>
              </div>
            )}
          </div>

          {/* Chat Box */}
          <div className={`${selectedChat ? 'block' : 'hidden md:block'} w-full md:w-1/2`}>
            {selectedChat ? (
              <ChatBox chat={selectedChat} onBack={() => setSelectedChat(null)} />
            ) : (
              <div className="h-[600px] flex items-center justify-center text-muted-foreground border rounded-md">
                Select a conversation to start chatting
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="py-6 border-t">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>WaterlooMatch - Exclusively for University of Waterloo students</p>
        </div>
      </footer>
    </div>
  );
}
