import { useState, useEffect } from "react";
import type { Message as VercelChatMessage } from "ai";

type ChatHistory = {
  id: string;
  title: string;
  messages: VercelChatMessage[];
};

export function useChatHistory() {
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);

  useEffect(() => {
    const storedHistory = localStorage.getItem("chatHistory");
    if (storedHistory) {
      setChatHistory(JSON.parse(storedHistory));
    }
  }, []);

  const updateChatHistory = (chatId: string, messages: VercelChatMessage[]) => {
    setChatHistory((prevHistory) => {
      const updatedHistory = prevHistory.map((chat) =>
        chat.id === chatId ? { ...chat, messages } : chat
      );
      localStorage.setItem("chatHistory", JSON.stringify(updatedHistory));
      return updatedHistory;
    });
  };

  return { chatHistory, updateChatHistory };
}
