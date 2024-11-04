'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid'
import { CustomChat } from '@/components/CustomChat'
import { SidebarTrigger } from "@/components/ui/sidebar"
import type { Message as VercelChatMessage } from 'ai';

type ChatHistory = {
    id: string
    title: string
    messages: VercelChatMessage[]
}

export default function Home() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([])

  useEffect(() => {
    const chatId = searchParams.get('id')
    if (chatId) {
      setCurrentChatId(chatId)
    } else {
      const newChatId = uuidv4()
      setCurrentChatId(newChatId)
      // router.push(`/?id=${newChatId}`, undefined, { shallow: true })
      router.replace(`/${newChatId}/chat`)
    }
  }, [searchParams, router])

  const updateChatHistory = (chatId: string, messages: VercelChatMessage[]) => {
    setChatHistory(prevHistory => {
        const updatedHistory = prevHistory.map(chat => chat.id == chatId ? { ...chat, messages } : chat)
        localStorage.setItem("chatHistory", JSON.stringify(updatedHistory))
        return updatedHistory
    })}

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center p-4 border-b">
        <SidebarTrigger />
        <h1 className="ml-4 text-xl font-bold">Chat</h1>
      </div>
      {/* <div className="flex-1 overflow-auto"> */}
      <div className="w-full h-screen flex-1 overflow-hidden"> 
        {currentChatId && <CustomChat chatId={currentChatId} updateChatHistory={updateChatHistory} />}
      </div>
    </div>
  )
}