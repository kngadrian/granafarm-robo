"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Send, User } from "lucide-react";
import { Suspense } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const agents = [
  {
    id: "anaf",
    icon: "🏛️",
    name: "ANAF",
    description: "Fiscalitate & TVA",
    color: "bg-blue-50 border-blue-200",
    activeColor: "bg-blue-600 text-white",
  },
  {
    id: "apia",
    icon: "🌾",
    name: "APIA",
    description: "Subvenții & Plăți",
    color: "bg-green-50 border-green-200",
    activeColor: "bg-green-600 text-white",
  },
  {
    id: "afir",
    icon: "🇪🇺",
    name: "AFIR",
    description: "Fonduri Europene",
    color: "bg-indigo-50 border-indigo-200",
    activeColor: "bg-indigo-600 text-white",
  },
  {
    id: "ministerul-agriculturii",
    icon: "🌿",
    name: "Min. Agriculturii",
    description: "Reglementări",
    color: "bg-emerald-50 border-emerald-200",
    activeColor: "bg-emerald-600 text-white",
  },
  {
    id: "furnizori",
    icon: "🚚",
    name: "Furnizori",
    description: "Găsire Furnizori",
    color: "bg-orange-50 border-orange-200",
    activeColor: "bg-orange-600 text-white",
  },
  {
    id: "contabilitate",
    icon: "📊",
    name: "Contabilitate",
    description: "Contabilitate",
    color: "bg-purple-50 border-purple-200",
    activeColor: "bg-purple-600 text-white",
  },
];

function ChatContent() {
  const searchParams = useSearchParams();
  const initialAgent = searchParams.get("agent") || "anaf";
  const [selectedAgent, setSelectedAgent] = useState(
    agents.find((a) => a.id === initialAgent) || agents[0]
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    setMessages([]);
  }, [selectedAgent]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: "user", content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          agent: selectedAgent.id,
          history: messages,
        }),
      });

      const data = await res.json();
      if (data.message) {
        setMessages([...newMessages, { role: "assistant", content: data.message }]);
      }
    } catch {
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: "Eroare de conexiune. Verificați cheia API OpenAI.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Agent selector sidebar */}
      <div className="w-72 bg-white border-r border-gray-100 flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Agenți AI</h2>
          <p className="text-xs text-gray-500 mt-1">Selectează agentul specializat</p>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {agents.map((agent) => (
            <button
              key={agent.id}
              onClick={() => setSelectedAgent(agent)}
              className={`w-full text-left p-4 rounded-xl border transition-all duration-150 ${
                selectedAgent.id === agent.id
                  ? `${agent.activeColor} border-transparent shadow-sm`
                  : `${agent.color} hover:shadow-sm`
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{agent.icon}</span>
                <div>
                  <p className={`text-sm font-bold ${selectedAgent.id === agent.id ? "text-white" : "text-gray-800"}`}>
                    {agent.name}
                  </p>
                  <p className={`text-xs ${selectedAgent.id === agent.id ? "text-white/80" : "text-gray-500"}`}>
                    {agent.description}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col bg-background">
        {/* Chat header */}
        <div className="bg-white border-b border-gray-100 p-4 flex items-center gap-3">
          <span className="text-2xl">{selectedAgent.icon}</span>
          <div>
            <h3 className="font-bold text-gray-900">{selectedAgent.name}</h3>
            <p className="text-xs text-gray-500">{selectedAgent.description} · GRANA FARM SRL</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <span className="text-5xl mb-4">{selectedAgent.icon}</span>
              <h3 className="text-xl font-bold text-gray-700">Agent {selectedAgent.name}</h3>
              <p className="text-gray-400 mt-2 max-w-md">
                Bun venit! Sunt agentul tău specializat în {selectedAgent.description.toLowerCase()}.
                Cum te pot ajuta astăzi?
              </p>
            </div>
          )}
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex items-start gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  msg.role === "user" ? "bg-primary text-white" : "bg-gray-100"
                }`}
              >
                {msg.role === "user" ? (
                  <User size={16} />
                ) : (
                  <span className="text-base">{selectedAgent.icon}</span>
                )}
              </div>
              <div
                className={`max-w-2xl px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "bg-primary text-white rounded-tr-sm"
                    : "bg-white text-gray-800 border border-gray-100 rounded-tl-sm shadow-sm"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <span className="text-base">{selectedAgent.icon}</span>
              </div>
              <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]" />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="bg-white border-t border-gray-100 p-4">
          <div className="flex gap-3 items-end">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Întreabă agentul ${selectedAgent.name}...`}
              rows={1}
              className="flex-1 resize-none border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="bg-primary text-white p-3 rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={18} />
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center">
            Enter pentru trimite · Shift+Enter pentru linie nouă
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">Se încarcă...</div>}>
      <ChatContent />
    </Suspense>
  );
}
