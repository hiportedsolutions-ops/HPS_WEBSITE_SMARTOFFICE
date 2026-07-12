"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Loader2, Sparkles } from "lucide-react";
import { HPS_CONTACT } from "@/lib/hps-data";
import { cn } from "@/lib/utils";

interface Msg {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "How do I register a business with CAC?",
  "What's the difference between Business Name and LTD?",
  "Can HPS register my company in the UK or US?",
  "What services does HPS offer?",
];

const GREETING: Msg = {
  role: "assistant",
  content:
    "Hello — I'm the HPS Assistant. I can help you find the right service, understand our CAC registration packages, or guide you toward booking a free consultation. What would you like to know?",
};

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, loading]);

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 200);
      return () => clearTimeout(t);
    }
  }, [open]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    setError(null);
    const next: Msg[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          history: next
            .filter((m) => m !== GREETING)
            .slice(-9, -1)
            .map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(
          data?.error ??
            "The assistant is unavailable right now. Please try again or message us on WhatsApp."
        );
        return;
      }
      setMessages((cur) => [
        ...cur,
        { role: "assistant", content: data.reply },
      ]);
    } catch {
      setError(
        "Network error — please check your connection or message us on WhatsApp."
      );
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void send(input);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void send(input);
    }
  };

  return (
    <>
      {/* Floating toggle button — Royal Blue */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close HPS Assistant" : "Open HPS Assistant"}
        aria-expanded={open}
        className="fixed bottom-5 right-5 z-50 size-14 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105"
        style={{
          background: "linear-gradient(135deg, #0057B8, #0066CC)",
          color: "#FFFFFF",
          boxShadow: "0 8px 24px -6px rgba(0, 87, 184, 0.5)",
        }}
      >
        {open ? <X className="size-6" /> : <MessageCircle className="size-6" />}
        {!open && (
          <span
            className="absolute -top-1 -right-1 size-3.5 rounded-full"
            style={{ background: "#D4AF37", border: "2px solid #FFFFFF" }}
          />
        )}
      </button>

      {/* Panel */}
      <div
        className={cn(
          "fixed bottom-[88px] right-5 z-50 w-[calc(100vw-2.5rem)] max-w-[400px] origin-bottom-right transition-all duration-200",
          open
            ? "opacity-100 scale-100 pointer-events-auto"
            : "opacity-0 scale-95 pointer-events-none"
        )}
      >
        <div
          className="flex flex-col rounded-lg overflow-hidden shadow-2xl"
          style={{
            background: "#FFFFFF",
            border: "1px solid #E2E8F0",
            height: "min(70vh, 560px)",
          }}
        >
          {/* Header — Royal Blue */}
          <div
            className="flex items-center gap-3 px-4 py-3.5 border-b"
            style={{
              background: "linear-gradient(120deg, #0057B8, #0A2540)",
              borderColor: "rgba(255,255,255,0.1)",
            }}
          >
            <span
              className="grid place-items-center size-9 rounded-full flex-shrink-0"
              style={{
                background: "linear-gradient(135deg, #B8902E, #E6C466 55%, #9A7A25)",
                color: "#0A2540",
              }}
            >
              <Sparkles className="size-4" />
            </span>
            <div className="flex-1 min-w-0">
              <div
                className="font-extrabold text-[0.95rem] leading-tight text-white"
                style={{ fontFamily: "var(--font-archivo)" }}
              >
                HPS Assistant
              </div>
              <div className="text-[0.72rem] text-[#C9D6E5] flex items-center gap-1.5">
                <span
                  className="size-1.5 rounded-full"
                  style={{ background: "#4ADE80" }}
                />
                Online · typically replies instantly
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="text-[#C9D6E5] hover:text-white transition-colors"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto hps-scroll p-4 space-y-3"
            style={{ background: "#F6F8FB" }}
          >
            {messages.map((m, i) => (
              <MessageBubble key={i} msg={m} />
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-[0.85rem] text-[var(--color-steel)] pl-1">
                <Loader2 className="size-3.5 animate-spin" style={{ color: "var(--color-blue)" }} />
                HPS Assistant is typing…
              </div>
            )}
            {error && (
              <div className="space-y-2">
                <div
                  className="text-[0.85rem] p-3 rounded"
                  style={{
                    background: "rgba(220,80,80,0.08)",
                    border: "1px solid rgba(220,80,80,0.3)",
                    color: "#B91C1C",
                  }}
                >
                  {error}
                </div>
                <a
                  href={HPS_CONTACT.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-wa !py-2 !px-3 text-[0.82rem] w-full"
                >
                  Message us on WhatsApp
                </a>
              </div>
            )}

            {messages.length === 1 && !loading && !error && (
              <div className="pt-2 space-y-2">
                <p
                  className="text-[0.7rem] uppercase tracking-wider text-[var(--color-steel)]"
                  style={{ fontFamily: "var(--font-ibm-plex-mono)" }}
                >
                  Suggested questions
                </p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => void send(s)}
                      className="text-left text-[0.8rem] px-3 py-2 rounded transition-colors hover:bg-[rgba(0,87,184,0.08)]"
                      style={{
                        border: "1px solid rgba(0, 87, 184, 0.25)",
                        color: "var(--color-blue)",
                        background: "#FFFFFF",
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Composer */}
          <form
            onSubmit={onSubmit}
            className="p-3 border-t"
            style={{ borderColor: "#E2E8F0", background: "#FFFFFF" }}
          >
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                rows={1}
                placeholder="Ask about our services, packages, process…"
                className="flex-1 resize-none max-h-32 px-3 py-2 text-[0.9rem] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-blue)]"
                style={{
                  background: "#F6F8FB",
                  border: "1px solid #E2E8F0",
                  color: "#1A222B",
                  fontFamily: "var(--font-public-sans)",
                }}
                disabled={loading}
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                aria-label="Send message"
                className="size-9 rounded flex items-center justify-center flex-shrink-0 transition-transform hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
                style={{
                  background: "linear-gradient(135deg, #0057B8, #0066CC)",
                  color: "#FFFFFF",
                }}
              >
                <Send className="size-4" />
              </button>
            </div>
            <p
              className="mt-2 text-[0.68rem] text-[var(--color-steel)] text-center"
              style={{ fontFamily: "var(--font-ibm-plex-mono)" }}
            >
              AI assistant · {HPS_CONTACT.bn}
            </p>
          </form>
        </div>
      </div>
    </>
  );
}

function MessageBubble({ msg }: { msg: Msg }) {
  const isUser = msg.role === "user";
  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] px-3.5 py-2.5 rounded-lg text-[0.88rem] leading-relaxed whitespace-pre-wrap break-words",
          isUser ? "rounded-br-sm" : "rounded-bl-sm"
        )}
        style={
          isUser
            ? {
                background: "linear-gradient(120deg, #0057B8, #0066CC)",
                color: "#FFFFFF",
              }
            : {
                background: "#FFFFFF",
                color: "#1A222B",
                border: "1px solid #E2E8F0",
              }
        }
      >
        {msg.content}
      </div>
    </div>
  );
}
