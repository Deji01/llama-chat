import { SidebarTrigger } from "@/components/ui/sidebar";
import { CustomChat } from "@/components/CustomChat";
import type { Message as VercelChatMessage } from "ai";

interface ChatLayoutProps {
  chatId: string;
  updateChatHistory: (chatId: string, messages: VercelChatMessage[]) => void;
}

export function ChatLayout({ chatId, updateChatHistory }: ChatLayoutProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center p-4 border-b">
        <SidebarTrigger />
        <h1 className="ml-4 text-xs font-bold">Chat</h1>
      </div>
      <div className="w-full h-screen flex-1 overflow-hidden">
        <CustomChat chatId={chatId} updateChatHistory={updateChatHistory} />
      </div>
    </div>
  );
}
