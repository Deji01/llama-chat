"use client"

import { useChat } from "ai/react"

import { ChatContainer, ChatForm, ChatMessages, PromptSuggestions } from "@/components/ui/chat"
import { MessageInput } from "@/components/ui/message-input"
import { MessageList } from "@/components/ui/message-list"
// import { PromptSuggestions } from "@/components/ui/prompt-suggestions"

export function CustomChat() {
    const {
        messages,
        input,
        handleInputChange,
        handleSubmit,
        append,
        isLoading,
        stop,
    } = useChat()

    const lastMessage = messages.at(-1)
    const isEmpty = messages.length === 0
    const isTyping = lastMessage?.role === "user"

    return (
        <ChatContainer>
            {isEmpty ? (
                <PromptSuggestions
                    append={append}
                    suggestions={["What is the capital of France?", "Tell me a joke"]} label={""}                />
            ) : null}

            {!isEmpty ? (
                <ChatMessages messages={messages}>
                    <MessageList messages={messages} isTyping={isTyping} />
                </ChatMessages>
            ) : null}

            <ChatForm
                className="mt-auto"
                isPending={isLoading || isTyping}
                handleSubmit={handleSubmit}
            >
                {({ files, setFiles }) => (
                    <MessageInput
                        value={input}
                        onChange={handleInputChange}
                        allowAttachments
                        files={files}
                        setFiles={setFiles}
                        stop={stop}
                        isGenerating={isLoading}
                    />
                )}
            </ChatForm>
        </ChatContainer>
    )
}