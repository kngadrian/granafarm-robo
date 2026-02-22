"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Send, Trash2 } from "lucide-react";
import { Suspense } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
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

function storageKey(agentId: string) {
  return `granafarm:chat:history:${agentId}`;
}

function loadHistory(agentId: string): Message[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(storageKey(agentId));
    if (!raw) return [];
    return JSON.parse(raw) as Message[];
  } catch {
    return [];
  }
}

function saveHistory(agentId: string, messages: Message[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(storageKey(agentId), JSON.stringify(messages));
  } catch {
    // ignore quota errors
  }
}

function formatTime(timestamp?: string): string {
  if (!timestamp) return "";
  const d = new Date(timestamp);
  return d.toLocaleTimeString("ro-RO", { hour: "2-digit", minute: "2-digit" });
}

function linkifyText(text: string): React.ReactNode[] {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);
  return parts.map((part, i) =>
    urlRegex.test(part) ? (
      <a
        key={i}
        href={part}
        target="_blank"
        rel="noopener noreferrer"
        className="text-green-700 underline"
      >
        {part}
      </a>
    ) : (
      part
    )
  );
}

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
  const prevAgentIdRef = useRef<string>(selectedAgent.id);

  // Load history on mount
  useEffect(() => {
    setMessages(loadHistory(selectedAgent.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Save history whenever messages change
  useEffect(() => {
    saveHistory(selectedAgent.id, messages);
  }, [messages, selectedAgent.id]);

  const switchAgent = (agent: typeof agents[0]) => {
    if (agent.id === selectedAgent.id) return;
    // Save current messages for old agent (already done via effect above, but be explicit)
    saveHistory(prevAgentIdRef.current, messages);
    // Load messages for new agent
    const history = loadHistory(agent.id);
    setMessages(history);
    setSelectedAgent(agent);
    prevAgentIdRef.current = agent.id;
  };

  const clearHistory = (agentId: string) => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(storageKey(agentId));
    }
    if (agentId === selectedAgent.id) {
      setMessages([]);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const now = new Date().toISOString();
    const userMessage: Message = { role: "user", content: input, timestamp: now };
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
        const assistantMsg: Message = {
          role: "assistant",
          content: data.message,
          timestamp: new Date().toISOString(),
        };
        setMessages([...newMessages, assistantMsg]);
      }
    } catch {
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: "Eroare de conexiune. Verificați cheia API OpenAI.",
          timestamp: new Date().toISOString(),
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
          {agents.map((agent) => {
            const isActive = selectedAgent.id === agent.id;
            return (
              <div key={agent.id} className="relative group">
                <button
                  onClick={() => switchAgent(agent)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-150 ${
                    isActive
                      ? `${agent.activeColor} border-transparent shadow-sm`
                      : `${agent.color} hover:shadow-sm`
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{agent.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-bold ${
                          isActive ? "text-white" : "text-gray-800"
                        }`}
                      >
                        {agent.name}
                      </p>
                      <p
                        className={`text-xs ${
                          isActive ? "text-white/80" : "text-gray-500"
                        }`}
                      >
                        {agent.description}
                      </p>
                    </div>
                  </div>
                </button>
                {/* Delete history button — shown on hover */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    clearHistory(agent.id);
                  }}
                  title="Șterge conversația"
                  className={`absolute top-2 right-2 p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity ${
                    isActive
                      ? "text-white/70 hover:text-white hover:bg-white/20"
                      : "text-gray-400 hover:text-red-500 hover:bg-red-50"
                  }`}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col bg-background">
        {/* Chat header */}
        <div className="bg-white border-b border-gray-100 p-4 flex items-center gap-3">
          <span className="text-2xl">{selectedAgent.icon}</span>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900">{selectedAgent.name}</h3>
            <p className="text-xs text-gray-500">
              {selectedAgent.description} · GRANA FARM SRL
            </p>
          </div>
          <button
            onClick={() => clearHistory(selectedAgent.id)}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
            title="Șterge conversația curentă"
          >
            <Trash2 size={12} />
            Șterge conversația
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <span className="text-5xl mb-4">{selectedAgent.icon}</span>
              <h3 className="text-xl font-bold text-gray-700">
                Agent {selectedAgent.name}
              </h3>
              <p className="text-gray-400 mt-2 max-w-md">
                Bun venit! Sunt agentul tău specializat în{" "}
                {selectedAgent.description.toLowerCase()}. Cum te pot ajuta
                astăzi?
              </p>
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex flex-col ${
                msg.role === "user" ? "items-end" : "items-start"
              }`}
            >
              {/* Agent label above bubble */}
              {msg.role === "assistant" && (
                <div className="flex items-center gap-1.5 mb-1 ml-1">
                  <span className="text-sm">{selectedAgent.icon}</span>
                  <span className="text-xs font-semibold text-gray-500">
                    {selectedAgent.name}
                  </span>
                </div>
              )}

              {/* Bubble */}
              {msg.role === "user" ? (
                <div className="max-w-[70%] bg-[#2D6A35] text-white rounded-lg p-3 text-sm leading-relaxed">
                  {linkifyText(msg.content)}
                </div>
              ) : (
                <div className="max-w-[80%] bg-white border-l-4 border-green-500 shadow-sm rounded-lg p-4 text-sm leading-relaxed text-gray-800">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      a: ({ href, children }) => (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-700 underline hover:text-yellow-600 font-medium"
                        >
                          {children}
                        </a>
                      ),
                      strong: ({ children }) => (
                        <strong className="font-semibold text-gray-900">
                          {children}
                        </strong>
                      ),
                      ul: ({ children }) => (
                        <ul className="list-disc list-inside my-2 space-y-1">
                          {children}
                        </ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="list-decimal list-inside my-2 space-y-1">
                          {children}
                        </ol>
                      ),
                      li: ({ children }) => (
                        <li className="text-gray-700">{children}</li>
                      ),
                      p: ({ children }) => (
                        <p className="mb-2 last:mb-0">{children}</p>
                      ),
                      h3: ({ children }) => (
                        <h3 className="font-bold text-gray-900 mt-3 mb-1">
                          {children}
                        </h3>
                      ),
                      h4: ({ children }) => (
                        <h4 className="font-semibold text-gray-800 mt-2 mb-1">
                          {children}
                        </h4>
                      ),
                      code: ({ children }) => (
                        <code className="bg-green-50 text-green-800 px-1 rounded text-sm font-mono">
                          {children}
                        </code>
                      ),
                      blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-yellow-400 pl-3 italic text-gray-600 my-2">
                          {children}
                        </blockquote>
                      ),
                      hr: () => <hr className="border-green-200 my-3" />,
                      table: ({ children }) => (
                        <div className="overflow-x-auto my-2">
                          <table className="text-sm border-collapse w-full">
                            {children}
                          </table>
                        </div>
                      ),
                      th: ({ children }) => (
                        <th className="border border-green-200 bg-green-50 px-2 py-1 text-left font-semibold">
                          {children}
                        </th>
                      ),
                      td: ({ children }) => (
                        <td className="border border-green-200 px-2 py-1">
                          {children}
                        </td>
                      ),
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                </div>
              )}

              {/* Timestamp */}
              {msg.timestamp && (
                <span className="text-[10px] text-gray-400 mt-1 mx-1">
                  {formatTime(msg.timestamp)}
                </span>
              )}
            </div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-1.5 mb-1 ml-1">
                <span className="text-sm">{selectedAgent.icon}</span>
                <span className="text-xs font-semibold text-gray-500">
                  {selectedAgent.name}
                </span>
              </div>
              <div className="bg-white border-l-4 border-green-500 shadow-sm rounded-lg px-4 py-3">
                <div className="flex gap-1 items-center">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]" />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
                  <span className="text-xs text-gray-400 ml-1">se scrie...</span>
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
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-gray-400">
              Enter pentru trimite · Shift+Enter pentru linie nouă
            </p>
            <span className="text-xs text-gray-300 bg-gray-50 px-2 py-0.5 rounded-full">
              💾 Conversație salvată local
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          Se încarcă...
        </div>
      }
    >
      <ChatContent />
    </Suspense>
  );
}
