"use client"

import { useChat } from "ai/react"
import { ChatContainer, ChatForm, ChatMessages, PromptSuggestions } from "@/components/ui/chat"
import { MessageInput } from "@/components/ui/message-input"
import { MessageList } from "@/components/ui/message-list"
import type { Message as VercelChatMessage } from 'ai';

interface ChatInterfaceProps {
    chatId: string
    updateChatHistory: (chatId: string, messages: VercelChatMessage[]) => void
}

export function CustomChat({ chatId, updateChatHistory }: ChatInterfaceProps) {
    const {
        messages,
        input,
        handleInputChange,
        handleSubmit,
        append,
        isLoading,
        stop,
    } = useChat(
        {
            id: chatId,
            onFinish: (message) => { updateChatHistory(chatId, messages) }
        },
    )

    const lastMessage = messages.at(-1)
    const isEmpty = messages.length === 0
    const isTyping = lastMessage?.role === "user"

    return (
        // <div className="flex justify-center items-end h-screen pb-4 w-full">
        <div className="flex flex-col h-full">
            <div className="flex justify-center items-end h-screen w-full pb-4 px-2 md:px-4">
            {/* <div className="flex-1 overflow-auto"> */}
                <ChatContainer className="w-full max-w-[100%]">

                    {isEmpty ? (
                        <PromptSuggestions
                            append={append}
                            suggestions={["What is the capital of France?", "Tell me a joke"]}
                            label=""
                        />
                    ) : null}

                    {!isEmpty ? (
                        <ChatMessages messages={messages}>
                            <MessageList messages={messages} isTyping={isTyping} />
                        </ChatMessages>
                    ) : null}
                        <ChatForm
                            // className="mt-4 w-full"
                            className="mt-4 w-full max-w-[100%] overflow-hidden"
                            isPending={isLoading || isTyping}
                            handleSubmit={handleSubmit}
                        >
                            {() => (
                                <MessageInput
                                    className="w-full"
                                    value={input}
                                    onChange={handleInputChange}
                                    // allowAttachments
                                    // files={files}
                                    // setFiles={setFiles}
                                    stop={stop}
                                    isGenerating={isLoading}
                                />
                            )}
                        </ChatForm>
                </ChatContainer>
            </div>
        </div>
    )
}
