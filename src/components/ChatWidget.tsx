"use client";

import { useEffect, useRef, useState } from "react";

type ChatMessage = { role: "user" | "assistant"; content: string };

const WELCOME_MESSAGE: ChatMessage = {
  role: "assistant",
  content:
    "Hi! I'm here to help with questions about State & William Lofts — units, pricing, location, and more. What would you like to know?",
};

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  const sendMessage = async (event: React.FormEvent) => {
    event.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const nextMessages = [...messages, { role: "user", content: text } as ChatMessage];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });
      const data = await res.json();
      setMessages([
        ...nextMessages,
        {
          role: "assistant",
          content: res.ok ? data.reply : "Sorry, something went wrong. Please try again.",
        },
      ]);
    } catch {
      setMessages([
        ...nextMessages,
        { role: "assistant", content: "Sorry, something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[150] flex flex-col items-end gap-3">
      {open && (
        <div className="flex h-[28rem] w-[22rem] max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-2xl border border-ink/8 bg-cloud shadow-2xl">
          <div className="flex items-center justify-between border-b border-ink/8 bg-ink px-4 py-3.5">
            <p className="font-display text-lg text-stone">State &amp; William Assistant</p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="flex h-8 w-8 items-center justify-center rounded-full text-stone/70 transition-colors hover:text-stone"
            >
              ✕
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <p
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    message.role === "user"
                      ? "bg-ink text-stone"
                      : "bg-stone-deep text-ink-text"
                  }`}
                >
                  {message.content}
                </p>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <p className="max-w-[85%] rounded-2xl bg-stone-deep px-4 py-2.5 text-sm text-ink-text">
                  Typing&hellip;
                </p>
              </div>
            )}
          </div>

          <form onSubmit={sendMessage} className="flex items-center gap-2 border-t border-ink/8 p-3">
            <input
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about a unit, pricing, location..."
              className="flex-1 rounded-full border border-ink/15 bg-stone px-4 py-2.5 text-sm text-ink outline-none ring-2 ring-transparent transition focus:border-transparent focus:ring-brass/30"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brass text-ink transition-colors hover:bg-brass-soft disabled:opacity-50"
              aria-label="Send"
            >
              ➤
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label={open ? "Close chat" : "Open chat"}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-ink text-2xl text-stone shadow-2xl transition-transform hover:-translate-y-0.5"
      >
        {open ? "✕" : "💬"}
      </button>
    </div>
  );
}
