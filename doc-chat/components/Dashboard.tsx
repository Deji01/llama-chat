'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient, SupabaseClient } from '@supabase/auth-helpers-nextjs';
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { PlusCircle, MessageSquare, Upload, LogOut } from 'lucide-react';
import ChatInterface from './ChatInterface';
import DocumentUpload from './DocumentUpload';

interface Chat {
  id: string;
  title: string;
  last_message_at: string | null;
  user_id: string;
}

export default function Dashboard() {
  const [activeView, setActiveView] = useState<'chat' | 'upload'>('chat')
  const [chats, setChats] = useState<Chat[]>([])
  const router = useRouter()
  const supabase: SupabaseClient = createClientComponentClient()

  useEffect(() => {
    fetchChats()
  }, [])

  const fetchChats = async () => {
    const { data, error } = await supabase
      .from('chats')
      .select('*')
      .order('last_message_at', { ascending: false })
    if (error) {
      console.error('Error fetching chats:', error)
    } else if (data) {
      setChats(data as Chat[])  // casting to Chat[] type
    }
  }

  const handleNewChat = async () => {
    const { data: userData, error: userError } = await supabase.auth.getUser()
    const userId = userData?.user?.id

    if (userError || !userId) {
      console.error('Error getting user ID:', userError)
      return
    }

    const { data, error } = await supabase
      .from('chats')
      .insert({ user_id: userId })
      .select()

    if (error) {
      console.error('Error creating new chat:', error)
    } else if (data) {
      setChats([data[0] as Chat, ...chats])  // casting to Chat type
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-gray-200">
        <Sidebar className="w-1/4 bg-gray-800 text-white">
          <SidebarHeader>
            <Button onClick={handleNewChat} className="w-full">
              <PlusCircle className="mr-2" /> New Chat
            </Button>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {chats.map((chat) => (
                <SidebarMenuItem key={chat.id}>
                  <SidebarMenuButton onClick={() => setActiveView('chat')}>
                    <MessageSquare className="mr-2" /> {chat.title}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <div className="mt-auto p-4">
            <Button onClick={() => setActiveView('upload')} className="w-full mb-2">
              <Upload className="mr-2" /> Upload Document
            </Button>
            <Button onClick={handleLogout} variant="destructive" className="w-full">
              <LogOut className="mr-2" /> Logout
            </Button>
          </div>
        </Sidebar>
        <main className="flex-1 p-4">
          <SidebarTrigger className="mb-4" />
          {activeView === 'chat' && <ChatInterface />}
          {activeView === 'upload' && <DocumentUpload />}
        </main>
      </div>
    </SidebarProvider>
  )
}
