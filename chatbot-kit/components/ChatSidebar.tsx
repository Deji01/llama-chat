'use client'

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { MessageSquarePlus, MoreHorizontal } from "lucide-react"
import { v4 as uuidv4 } from 'uuid'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuAction,
  SidebarGroupLabel,
  SidebarGroup,
  SidebarGroupContent,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import type { Message as VercelChatMessage } from 'ai';

type ChatHistory = {
  id: string
  title: string
  messages: VercelChatMessage[]
}

const formattedDateTime = () => {
  return new Date().toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  })
}

export function ChatSidebar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [chatHistory, setChatHistory] = React.useState<ChatHistory[]>([])

  React.useEffect(() => {
    const storedHistory = localStorage.getItem('chatHistory')
    if (storedHistory) {
      setChatHistory(JSON.parse(storedHistory))
    }
  }, [])

  React.useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory))
  }, [chatHistory])

  const createNewChat = () => {
    const newChatId = uuidv4()
    const newChat = {
      id: newChatId,
      title: `New chat - ${formattedDateTime()}`,
      messages: []
    }
    setChatHistory(prev => [newChat, ...prev])
    router.push(`/${newChatId}/chat`)
  }

  const selectChat = (id: string) => {
    router.push(`/${id}/chat`)
  }

  const deleteChat = (id: string) => {
    setChatHistory(prev => prev.filter(chat => chat.id !== id))
    if (searchParams.get('id') === id) {
      createNewChat()
    }
  }

  return (
    <Sidebar className="border-r bg-sidebar-background">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2"
              onClick={createNewChat}
            >
              <MessageSquarePlus className="h-4 w-4" />
              New Chat
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Recent Chats</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {chatHistory.map(chat => (
                <SidebarMenuItem key={chat.id}>
                  <SidebarMenuButton
                    // className="flex justify-between"
                    className="flex flex-col items-start"
                    onClick={() => selectChat(chat.id)}
                  >
                    <div>{chat.title}</div>
                    {/* {chat.messages.length > 0 && (
                      <div className="text-xs text-gray-500 truncate w-full">
                        {chat.messages[chat.messages.length -1].content}
                      </div>
                    )} */}
                  </SidebarMenuButton>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuAction>
                        <MoreHorizontal className="h-4 w-4" />
                      </SidebarMenuAction>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="right" align="start">
                      <DropdownMenuItem onClick={() => deleteChat(chat.id)}>
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}