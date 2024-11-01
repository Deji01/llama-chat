'use client'

import { useState, useEffect } from 'react'
import { useChat } from 'ai/react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'

export default function ChatInterface() {
    const [chatId, setChatId] = useState<string | null>(null)
    const supabase = createClientComponentClient()
    const { messages, input, handleInputChange, handleSubmit } = useChat({
        api: '/api/chat',
        onFinish: (message) => {
            saveMessage(message)
        },
    })

    useEffect(() => {
        initializeChat()
    }, [])

    const initializeChat = async () => {
        const { data, error } = await supabase
            .from('chats')
            .select('*')
            .order('last_message_at', { ascending: false })
            .limit(1)
        if (error) {
            console.error('Error initializing chat:', error)
        } else if (data && data.length > 0) {
            setChatId(data[0].id)
        } else {
            createNewChat()
        }
    }

    const createNewChat = async () => {
        const { data, error } = await supabase
            .from('chats')
            .insert({ user_id: (await supabase.auth.getUser()).data.user?.id })
            .select()
        if (error) {
            console.error('Error creating new chat:', error)
        } else if (data) {
            setChatId(data[0].id)
        }
    }

    const saveMessage = async (message: any) => {
        if (!chatId) return

        const { error } = await supabase
            .from('messages')
            .insert({
                chat_id: chatId,
                user_id: (await supabase.auth.getUser()).data.user?.id,
                sender: message.role,
                content: message.content,
            })
        if (error) {
            console.error('Error saving message:', error)
        }
    }

    return (
        <Card className="h-full flex flex-col">
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`chat-message ${message.role === 'user' ? 'chat-message-user' : 'chat-message-ai'
                            }`}
                    >
                        {message.content}
                    </div>
                ))}
            </CardContent>
            <CardContent className="p-4 border-t">
                <form onSubmit={handleSubmit} className="flex space-x-2">
                    <Input
                        className="input-primary flex-grow"
                        value={input}
                        onChange={handleInputChange}
                        placeholder="Type your message..."
                    />
                    <Button className="btn-primary" type="submit">Send</Button>
                </form>
            </CardContent>
        </Card>
    )
}