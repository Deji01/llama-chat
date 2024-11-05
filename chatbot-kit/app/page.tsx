"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { ChatLayout } from "@/components/ChatLayout";
import { useChatHistory } from "@/hooks/use-chat-history";

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { updateChatHistory } = useChatHistory();
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);

  useEffect(() => {
    const chatId = searchParams.get("id");
    if (chatId) {
      setCurrentChatId(chatId);
    } else {
      const newChatId = uuidv4();
      setCurrentChatId(newChatId);
      router.replace(`/${newChatId}/chat`);
    }
  }, [searchParams, router]);

  return (
    <div className="w-full h-full">
      {currentChatId && (
        <ChatLayout chatId={currentChatId} updateChatHistory={updateChatHistory} />
      )}
    </div>
  );
}
