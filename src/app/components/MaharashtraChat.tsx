"use client";

import { useChat } from "@ai-sdk/react";
import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";

export default function MaharashtraChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState("");

  // ✅ NEW SDK API
  const { messages, sendMessage, status } = useChat();

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="fixed bottom-6 right-6 z-[10000] font-serif">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-500 border-2 ${
          isOpen
            ? "bg-[#1a1a1a] border-[#e2b23c] rotate-90"
            : "bg-[#f25135] border-[#fff6e9] hover:scale-110 shadow-[#f25135]/40"
        }`}
      >
        {isOpen ? (
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[320px] md:w-[360px] h-[450px] bg-[#fff6e9] border-2 border-[#e2b23c]/30 rounded-[2rem] shadow-2xl flex flex-col overflow-hidden">
          
          {/* Header */}
          <div className="bg-[#f25135] p-4 flex items-center justify-between border-b-2 border-[#e2b23c]">
            <div className="flex flex-col text-white">
              <span className="text-[8px] font-black opacity-70 uppercase tracking-[0.3em]">
                Official Guide
              </span>
              <h3 className="font-bold text-sm tracking-tight">
                EXPLORE MAHARASHTRA
              </h3>
            </div>
            <div
              className={`w-2 h-2 rounded-full bg-[#e2b23c] ${
                status === "streaming" ? "animate-ping" : ""
              }`}
            />
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-white/40"
          >
            {messages.length === 0 && (
              <div className="mt-10 text-center space-y-2 px-4">
                <p className="text-[#f25135] text-xs italic">
                  "Jai Maharashtra! Ask me about forts, beaches & traditions."
                </p>
                <div className="h-px w-8 bg-[#e2b23c] mx-auto" />
              </div>
            )}

            {messages.map((m) => {
              const text =
                m.parts?.find((p) => p.type === "text")?.text || "";

              return (
                <div
                  key={m.id}
                  className={`flex ${
                    m.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[90%] px-4 py-2 rounded-2xl text-[13px] leading-relaxed shadow-sm ${
                      m.role === "user"
                        ? "bg-[#1a1a1a] text-white rounded-br-none"
                        : "bg-white border-l-4 border-[#e2b23c] text-[#1a1a1a] rounded-tl-none border"
                    }`}
                  >
                    {/* ✅ Wrap markdown to avoid TS className error */}
                    <div className="prose prose-sm prose-p:my-0.5 prose-strong:text-[#f25135]">
                      <ReactMarkdown>{text}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!prompt.trim()) return;

              sendMessage({ text: prompt });
              setPrompt("");
            }}
            className="p-4 bg-white border-t border-[#e2b23c]/20"
          >
            <div className="flex items-center gap-2 bg-[#fff6e9] rounded-full px-4 py-1.5 border border-[#e2b23c]/40 focus-within:border-[#f25135] transition-all">
              <input
                className="flex-1 bg-transparent py-1 text-xs outline-none placeholder:text-[#1a1a1a]/30"
                value={prompt}
                placeholder="Where shall we go?"
                onChange={(e) => setPrompt(e.target.value)}
              />
              <button type="submit" className="text-[#f25135] hover:scale-110 transition-transform">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
