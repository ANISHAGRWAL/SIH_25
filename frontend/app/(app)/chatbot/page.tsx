"use client"

import { useState } from "react"

type Message = { id: string; role: "user" | "bot"; text: string; time: string }

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", role: "bot", text: "Hi", time: "9:00 am" },
    { id: "2", role: "bot", text: "How are you", time: "9:01 am" },
    { id: "3", role: "user", text: "I am ok", time: "9:02 am" },
    { id: "4", role: "bot", text: "Are you feeling good", time: "9:03 am" },
  ])
  const [input, setInput] = useState("")

  function send() {
    if (!input.trim()) return
    setMessages((m) => [
      ...m,
      { id: crypto.randomUUID(), role: "user", text: input, time: new Date().toLocaleTimeString() },
    ])
    setInput("")
    // TODO: connect to AI SDK backed by your Node/Express API
  }

  return (
    <div className="max-w-3xl">
      <div className="rounded-2xl bg-white ring-1 ring-slate-200 overflow-hidden">
        <div className="bg-teal-500/85 text-white px-4 py-3 font-medium">Your Well Wisher</div>
        <div className="p-4 space-y-3">
          {messages.map((m) => (
            <div key={m.id} className={m.role === "bot" ? "text-left" : "text-right"}>
              <div
                className={
                  m.role === "bot"
                    ? "inline-block rounded-xl bg-teal-500 text-white px-4 py-2 shadow"
                    : "inline-block rounded-xl bg-slate-50 text-slate-800 px-4 py-2 shadow"
                }
              >
                {m.text}
                <span className="ml-2 text-xs opacity-70">{m.time}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="p-3 border-t flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Message"
            className="flex-1 rounded-full border border-slate-300 px-4 py-3"
          />
          <button
            className="rounded-full px-4 py-2 bg-gradient-to-r from-teal-400 to-sky-700 text-white"
            onClick={send}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}
