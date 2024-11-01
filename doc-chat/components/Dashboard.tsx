'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { PlusCircle, MessageSquare, Upload, LogOut } from 'lucide-react';
import ChatInterface from './ChatInterface';
import DocumentUpload from './DocumentUpload';

export default function Dashboard() {
  const [activeView, setActiveView] = useState<'chat' | 'upload'>('chat')
  const [chats, setChats] = useState([])
  const router = useRouter()
  const supabase = createClientComponentClient()

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
    } else {
      setChats(data)
    }
  }

  const handleNewChat = async () => {
    const { data, error } = await supabase
      .from('chats')
      .insert({ user_id: (await supabase.auth.getUser()).data.user?.id })
      .select()
    if (error) {
      console.error('Error creating new chat:', error)
    } else {
      setChats([data[0], ...chats])
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