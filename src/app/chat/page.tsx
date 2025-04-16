"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useChat, type Message } from "@ai-sdk/react"
import { useEffect, useRef, useState } from "react"

const MODELS = [
  { value: "o3-mini", label: "o3-mini" },
  { value: "gpt-4o", label: "gpt-4o" },
  { value: "gpt-4o-mini", label: "gpt-4o-mini" },
  { value: "gpt-4-turbo", label: "gpt-4-turbo" },
  { value: "o1", label: "o1" },
]

export default function Home() {
  const [selectedModel, setSelectedModel] = useState(MODELS[0].value)
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      body: {
        model: selectedModel,
      },
    })
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    if (!isLoading && inputRef.current) {
      if (document.activeElement !== inputRef.current) {
        inputRef.current.focus()
      }
    }
  }, [isLoading])

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4 dark:from-slate-900 dark:to-slate-950">
      <div className="flex h-[85vh] w-full max-w-3xl flex-col rounded-lg border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-200 p-4 dark:border-slate-700">
          <h1 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
            AI Chat
          </h1>
          <Select value={selectedModel} onValueChange={setSelectedModel}>
            <SelectTrigger className="w-[180px] rounded-full">
              <SelectValue placeholder="Select model" />
            </SelectTrigger>
            <SelectContent>
              {MODELS.map((model) => (
                <SelectItem key={model.value} value={model.value}>
                  {model.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div
          ref={messagesContainerRef}
          className="flex-1 space-y-4 overflow-y-auto p-6"
        >
          {messages.map((message: Message) => (
            <div
              key={message.id}
              className={`animate-in fade-in slide-in-from-bottom-4 flex duration-300 ease-out ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] rounded-lg p-3 px-4 whitespace-pre-wrap shadow-md transition-all hover:shadow-lg ${
                  message.role === "user"
                    ? "rounded-br-none bg-teal-600 text-white dark:bg-teal-700"
                    : "rounded-bl-none bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                }`}
              >
                <span className="mb-1 block text-xs font-semibold opacity-80">
                  {message.role === "user" ? "You" : "AI"}
                </span>
                {typeof message.content === "string"
                  ? message.content
                  : JSON.stringify(message.content)}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-center justify-center pt-6">
              <div className="flex space-x-1">
                <span className="h-2 w-2 animate-pulse rounded-full bg-gray-400 delay-0 duration-1000"></span>
                <span className="h-2 w-2 animate-pulse rounded-full bg-gray-400 delay-150 duration-1000"></span>
                <span className="h-2 w-2 animate-pulse rounded-full bg-gray-400 delay-300 duration-1000"></span>
              </div>
            </div>
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-3 border-t border-slate-200 p-4 dark:border-slate-700"
        >
          <Input
            ref={inputRef}
            className="flex-1 rounded-full border-slate-300 px-4 py-2 shadow-sm transition-shadow focus:border-teal-500 focus:ring-2 focus:ring-teal-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:focus:border-teal-600 dark:focus:ring-teal-700"
            value={input}
            placeholder="Ask something..."
            onChange={handleInputChange}
            disabled={isLoading}
          />
          <Button
            type="submit"
            disabled={isLoading || !input}
            className="rounded-full bg-teal-600 px-5 py-2 text-white shadow-md transition-all hover:bg-teal-700 hover:shadow-lg focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50 disabled:shadow-none dark:bg-teal-700 dark:hover:bg-teal-800 dark:focus:ring-offset-slate-900"
          >
            Send
          </Button>
        </form>
      </div>
    </div>
  )
}
