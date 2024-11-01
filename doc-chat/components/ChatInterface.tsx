'use client'

import { useState, useEffect } from 'react';
import { Message, useChat } from 'ai/react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ChatInterface() {
    const [chatId, setChatId] = useState(null)
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
        } else if (data.length > 0) {
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
        } else {
            setChatId(data[0].id)
        }
    }

    const saveMessage = async (message: Message) => {
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
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`p-2 rounded-lg ${message.role === 'user' ? 'bg-blue-100 ml-auto' : 'bg-gray-100'
                            }`}
                    >
                        {message.content}
                    </div>
                ))}
            </div>
            <form onSubmit={handleSubmit} className="p-4 border-t">
                <div className="flex space-x-2">
                    <Input
                        value={input}
                        onChange={handleInputChange}
                        placeholder="Type your message..."
                    />
                    <Button type="submit">Send</Button>
                </div>
            </form>
        </div>
    )
}