import { createOpenAI } from "@ai-sdk/openai"
import { Message, streamText } from "ai"

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: `https://gateway.ai.cloudflare.com/v1/c5b793f894444f1cc7aaac929176106d/dade-ca/openai`,
})

export async function POST(req: Request) {
  const { messages, model } = (await req.json()) as {
    messages: Message[]
    model: string
  }

  const result = streamText({
    model: openai(model),
    messages,
  })

  return result.toDataStreamResponse()
}
