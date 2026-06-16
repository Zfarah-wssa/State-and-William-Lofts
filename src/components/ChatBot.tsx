"use client";

import { useEffect, useRef, useState } from "react";

/* ─── Types ─────────────────────────────────────────────────── */

export type ChatTrigger = "interest" | "maintenance" | "tour" | "contact";

type Collected = Partial<{
  unit: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  category: string;
  description: string;
  tourPreference: string;
  roommates: string;
  notes: string;
}>;

interface APIResponse {
  message: string;
  updates: Collected;
  suggestions: string[];
  readyToSubmit: boolean;
}

interface Msg {
  id: string;
  role: "bot" | "user";
  text: string;
}

type ConversationEntry = { role: string; content: string };

/* ─── Static Data ────────────────────────────────────────────── */

const UNIT_FULL: Record<string, string> = {
  "Level 2 West": "Level 2 West — 615.5 E. William St.",
  "Level 2 East": "Level 2 East — 621 E. William St.",
  "Level 3 East": "Level 3 East — 621 E. William St.",
};

function getInitMessage(trigger: ChatTrigger, unitName?: string): string {
  if (trigger === "interest")
    return unitName
      ? `I'm interested in ${unitName}`
      : "I'm interested in your apartments";
  if (trigger === "maintenance") return "I need to submit a maintenance request";
  if (trigger === "contact") return "I'd like to get in touch";
  return "I'd like to schedule a tour of your lofts";
}

/* ─── API Caller ─────────────────────────────────────────────── */

async function callChatAPI(params: {
  messages: ConversationEntry[];
  trigger: ChatTrigger;
  collected: Collected;
  unitName?: string;
}): Promise<APIResponse> {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

/* ─── Form Submitter ─────────────────────────────────────────── */

async function submitForm(
  trigger: ChatTrigger,
  unitName: string | undefined,
  data: Collected,
  transcript: ConversationEntry[],
) {
  if (trigger === "interest" || trigger === "tour" || trigger === "contact") {
    let notesValue: string;
    if (trigger === "tour") {
      notesValue = `Tour request. Unit: ${data.unit ?? "All units"}. Preferred times: ${data.tourPreference || "Flexible"}`;
      if (data.roommates) notesValue += `\nRoommates: ${data.roommates}`;
    } else if (trigger === "interest") {
      notesValue = data.notes || "";
      if (data.roommates) notesValue = notesValue ? `${notesValue}\nRoommates: ${data.roommates}` : `Roommates: ${data.roommates}`;
    } else {
      notesValue = data.notes || "";
    }
    await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        unitName:
          trigger === "contact"
            ? "General Inquiry"
            : unitName ||
              (data.unit ? UNIT_FULL[data.unit] || data.unit : "Tour Request"),
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        notes: notesValue,
        roommates: data.roommates,
        transcript,
      }),
    });
  } else {
    await fetch("/api/maintenance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        unit: UNIT_FULL[data.unit ?? ""] || data.unit,
        category: data.category,
        description: data.description,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        transcript,
      }),
    });
  }
}

/* ─── UI Helpers ─────────────────────────────────────────────── */

function uid() {
  return Math.random().toString(36).slice(2);
}

function BotText({ text }: { text: string }) {
  return (
    <>
      {text.split("\n").map((line, i) => (
        <span key={i}>
          {i > 0 && <br />}
          {line.split(/(\*\*[^*]+\*\*)/g).map((part, j) =>
            part.startsWith("**") && part.endsWith("**") ? (
              <strong key={j}>{part.slice(2, -2)}</strong>
            ) : (
              <span key={j}>{part}</span>
            ),
          )}
        </span>
      ))}
    </>
  );
}

function TypingDots() {
  return (
    <div className="flex items-end gap-2">
      <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-brass/20">
        <span className="font-display text-[9px] font-bold text-brass">SW</span>
      </div>
      <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-ink-soft px-4 py-3">
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-stone/50 [animation-delay:-0.3s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-stone/50 [animation-delay:-0.15s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-stone/50" />
      </div>
    </div>
  );
}

/* ─── ChatBot ────────────────────────────────────────────────── */

interface ChatBotProps {
  isOpen: boolean;
  onClose: () => void;
  trigger: ChatTrigger;
  unitName?: string;
  variant?: "modal" | "page";
}

export function ChatBot({ isOpen, onClose, trigger, unitName, variant = "modal" }: ChatBotProps) {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [history, setHistory] = useState<ConversationEntry[]>([]);
  const [collected, setCollected] = useState<Collected>({});
  const [chips, setChips] = useState<string[]>([]);
  const [val, setVal] = useState("");
  const [busy, setBusy] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const submittedRef = useRef(false);

  // Auto-scroll to latest message
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, busy]);

  // Lock body scroll (modal only)
  useEffect(() => {
    if (variant !== "modal") return;
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, variant]);

  // ESC to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  // Initialize conversation on open (or on mount for page variant)
  useEffect(() => {
    if (!isOpen && variant === "modal") return;

    setMsgs([]);
    setHistory([]);
    setCollected({});
    setChips([]);
    setVal("");
    setBusy(false);
    submittedRef.current = false;

    const initMsg = getInitMessage(trigger, unitName);
    const initHistory: ConversationEntry[] = [
      { role: "user", content: initMsg },
    ];

    setBusy(true);
    callChatAPI({ messages: initHistory, trigger, collected: {}, unitName })
      .then((data) => {
        setMsgs([{ id: uid(), role: "bot", text: data.message }]);
        setHistory([
          ...initHistory,
          { role: "assistant", content: data.message },
        ]);
        setCollected(data.updates || {});
        setChips(data.suggestions || []);
      })
      .catch(() => {
        setMsgs([
          {
            id: uid(),
            role: "bot",
            text: "Hi! I'm here to help. What can I assist you with today?",
          },
        ]);
      })
      .finally(() => {
        setBusy(false);
        setTimeout(() => inputRef.current?.focus(), 100);
      });
  }, [isOpen, trigger, unitName]); // eslint-disable-line react-hooks/exhaustive-deps

  const send = async (text?: string) => {
    const message = (text ?? val).trim();
    if (!message || busy) return;

    setVal("");
    setChips([]);
    setBusy(true);

    // Show user message immediately
    setMsgs((prev) => [...prev, { id: uid(), role: "user", text: message }]);

    // Build updated history (history is current at event-trigger time)
    const newHistory: ConversationEntry[] = [
      ...history,
      { role: "user", content: message },
    ];

    try {
      const data = await callChatAPI({
        messages: newHistory,
        trigger,
        collected, // current at event-trigger time
        unitName,
      });

      const newCollected: Collected = { ...collected, ...data.updates };
      setCollected(newCollected);
      setChips(data.suggestions || []);
      setHistory([
        ...newHistory,
        { role: "assistant", content: data.message },
      ]);
      setMsgs((prev) => [
        ...prev,
        { id: uid(), role: "bot", text: data.message },
      ]);

      if (data.readyToSubmit && !submittedRef.current) {
        submittedRef.current = true;
        const fullTranscript: ConversationEntry[] = [
          ...newHistory,
          { role: "assistant", content: data.message },
        ];
        submitForm(trigger, unitName, newCollected, fullTranscript).catch(() => {});
      }
    } catch {
      setMsgs((prev) => [
        ...prev,
        {
          id: uid(),
          role: "bot",
          text: "I'm having trouble right now — please try again.",
        },
      ]);
    } finally {
      setBusy(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  if (!isOpen && variant === "modal") return null;

  const chatInner = (
    <>
      {/* ── Header ── */}
      <div className="flex flex-shrink-0 items-center gap-3 border-b border-stone/10 px-5 py-4">
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-brass/15 ring-1 ring-brass/30">
          <span className="font-display text-xs font-bold text-brass">S&W</span>
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-stone">
            State &amp; William Assistant
          </p>
          <p className="text-xs text-stone/45">Leasing &amp; Resident Support</p>
        </div>
        {variant === "modal" && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close chat"
            className="ml-auto flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-stone/40 transition-colors hover:bg-stone/10 hover:text-stone"
          >
            ✕
          </button>
        )}
      </div>

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-3">
        {msgs.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-end gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "bot" && (
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-brass/20">
                <span className="font-display text-[9px] font-bold text-brass">
                  SW
                </span>
              </div>
            )}
            <div
              className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "rounded-br-sm bg-brass font-medium text-ink"
                  : "rounded-bl-sm bg-ink-soft text-stone"
              }`}
            >
              {msg.role === "bot" ? <BotText text={msg.text} /> : msg.text}
            </div>
          </div>
        ))}
        {busy && <TypingDots />}
        <div ref={scrollRef} />
      </div>

      {/* ── Input Area ── */}
      <div className="flex-shrink-0 border-t border-stone/10 bg-ink-soft px-4 py-3 space-y-2.5">
        {chips.length > 0 && !busy && (
          <div className="flex flex-wrap gap-2">
            {chips.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => send(chip)}
                className="rounded-full border border-stone/20 px-3 py-1 text-xs font-medium text-stone/70 transition hover:border-brass hover:bg-brass/10 hover:text-brass"
              >
                {chip}
              </button>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={val}
            onChange={(e) => setVal(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder={busy ? "..." : "Type a message…"}
            disabled={busy}
            className="min-w-0 flex-1 rounded-xl border border-stone/15 bg-ink px-4 py-2.5 text-sm text-stone placeholder:text-stone/35 outline-none transition focus:border-brass/50 disabled:opacity-50"
          />
          <button
            type="button"
            onClick={() => send()}
            disabled={busy || !val.trim()}
            className="rounded-xl bg-brass px-4 py-2.5 text-sm font-semibold text-ink transition hover:bg-brass-soft disabled:opacity-40"
          >
            Send
          </button>
        </div>
      </div>
    </>
  );

  if (variant === "page") {
    return (
      <div
        role="region"
        aria-label="State & William Assistant"
        className="flex w-full flex-col overflow-hidden rounded-2xl bg-ink shadow-xl"
        style={{ height: "min(640px, 80dvh)" }}
      >
        {chatInner}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-4">
      <div
        aria-hidden
        className="absolute inset-0 bg-ink/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="State & William Assistant"
        className="relative flex w-full flex-col overflow-hidden rounded-t-2xl bg-ink shadow-2xl sm:max-w-md sm:rounded-2xl"
        style={{ height: "min(620px, 92dvh)" }}
      >
        {chatInner}
      </div>
    </div>
  );
}
