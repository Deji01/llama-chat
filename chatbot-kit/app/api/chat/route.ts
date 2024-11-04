import { ChatGroq } from "@langchain/groq";
import { NextRequest, NextResponse } from 'next/server';
import { LangChainAdapter, type Message as VercelChatMessage } from 'ai';
import { HumanMessage, AIMessage, ChatMessage } from '@langchain/core/messages';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { PromptTemplate } from '@langchain/core/prompts';
import { RunnableSequence } from "@langchain/core/runnables";


export const runtime = 'edge';

const formatVercelMessages = (message: VercelChatMessage) => {
    if (message.role === 'user') {
        return new HumanMessage(message.content);
    } else if (message.role === 'assistant') {
        return new AIMessage(message.content);
    } else {
        console.warn(
            `Unknown message type passed: "${message.role}". Falling back to generic message type.`,
        );
        return new ChatMessage({ content: message.content, role: message.role });
    }
};

const TEMPLATE = `You are a helpful AI assistant. Try as much as possible to help the user to the best of your abilities

Current Conversation:
{chat_history}

User: {input}
AI:`;

export async function POST(req: NextRequest) {
    try {
        const { messages } = await req.json();
        messages ?? [];
        if (!messages.length) {
            throw new Error('No messages provided.');
        }
        const formattedPreviousMessages = messages
            .slice(0, -1)
            .map(formatVercelMessages);
        const currentMessageContent = messages[messages.length - 1].content;

        const prompt = PromptTemplate.fromTemplate(TEMPLATE)
        const model = new ChatGroq({
            model: "mixtral-8x7b-32768",
            apiKey: process.env.GROQ_API_KEY,
            temperature: 0.5,
            cache: true,
        });
        ;

        const outputparser = new StringOutputParser();
        // const stream = await prompt.pipe(model).pipe(outputparser).stream(messages)

        const chain = RunnableSequence.from([prompt, model, outputparser])
        const stream = await chain.stream({
            chat_history: formattedPreviousMessages.join("\n"),
            input: currentMessageContent,
        })


        return LangChainAdapter.toDataStreamResponse(stream)
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}