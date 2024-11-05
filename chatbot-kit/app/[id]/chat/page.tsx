"use client";

import { ChatLayout } from "@/components/ChatLayout";
import { useChatHistory } from "@/hooks/use-chat-history";
import { useParams } from "next/navigation";

export default function ChatPage() {
  const params = useParams();
  const chatId = params.id as string;
  const { updateChatHistory } = useChatHistory();

  return (
    <div className="w-full h-full">
      <ChatLayout chatId={chatId} updateChatHistory={updateChatHistory} />
    </div>
  );
}
