import { createOpenAI } from "@ai-sdk/openai"
import { convertToCoreMessages, streamText } from "ai"
import { NextRequest } from "next/server"

export const maxDuration = 30

const groq = createOpenAI({
    baseURL: "https://api.groq.com/openai/v1",
    apiKey: process.env.GROQ_API_KEY,
})

export async function POST(req: NextRequest) {
    const { messages } = await req.json()

    const result = await streamText({
        model: groq("llama-3.1-70b-versatile"),
        messages: convertToCoreMessages(messages)
    })

    return result.toDataStreamResponse()
}