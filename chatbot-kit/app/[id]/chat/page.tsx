"use client"

import { CustomChat } from "@/components/CustomChat";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { Message as VercelChatMessage } from 'ai';

type ChatHistory = {
    id: string
    title: string
    messages: VercelChatMessage[]
}

export default function ChatPage() {
    const params = useParams()
    const chatId = params.id as string
    const [chatHistory, setChatHistory] = useState<ChatHistory[]>([])

    useEffect(() => {
        const storedHistory = localStorage.getItem("chatHistory")
        if (storedHistory) {
            setChatHistory(JSON.parse(storedHistory))
        }
    }, [])

    const updateChatHistory = (chatId: string, messages: VercelChatMessage[]) => {
        setChatHistory(prevHistory => {
            const updatedHistory = prevHistory.map(chat => chat.id == chatId ? { ...chat, messages } : chat)
            localStorage.setItem("chatHistory", JSON.stringify(updatedHistory))
            return updatedHistory
        })
    }
    return (
        <div className="flex-1 overflow-hidden">
            {/* <div className="w-full h-screen flex items-end justify-center pb-4 px-2 md:px-4"> */}
            <CustomChat chatId={chatId} updateChatHistory={updateChatHistory} />
        </div>
    )
}
