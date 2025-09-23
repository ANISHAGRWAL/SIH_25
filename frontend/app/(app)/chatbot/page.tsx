// /app/(or pages)/ChatbotPage.tsx — or wherever your page lives
// Adjust import paths as needed

"use client";

import { useState, useRef, useEffect } from "react";
import { chat } from "@/actions/chat";
import { useAuth } from "@/contexts/AuthContext";
import { Mic } from "lucide-react";
import SpeechInput from "@/components/SpeechInput";
import { useSpeechRecognition } from "@/hooks/useSeechRecognition";

type Message = {
  id: string;
  role: "user" | "bot";
  text: string;
  time: string;
  isTyping?: boolean;
};

function generateId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
}

const botAvatar = (
  <svg
    className="w-5 h-5 text-white"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);

const userAvatar = (
  <svg
    className="w-5 h-5 text-white"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [provider, setProvider] = useState<"Gemini" | "Groq">("Gemini");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { user } = useAuth();

  const {
    transcript,
    isListening,
    startListening,
    stopListening,
    hasRecognitionSupport,
  } = useSpeechRecognition();

  useEffect(() => {
    if (transcript) {
      setInput(transcript);
    }
  }, [transcript]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showSettings && !target.closest(".settings-container")) {
        setShowSettings(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showSettings]);

  const clearChat = () => {
    setMessages([]);
    setShowClearConfirm(false);
    setShowSettings(false);
  };

  async function send() {
    if (!input.trim() || loading) return;

    if (isListening) {
      stopListening();
    }

    const userMessage: Message = {
      id: generateId(),
      role: "user",
      text: input.trim(),
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    const typingMessage: Message = {
      id: "typing",
      role: "bot",
      text: "",
      time: "",
      isTyping: true,
    };
    setMessages((prev) => [...prev, typingMessage]);

    try {
      const token = localStorage.getItem("token") || "";
      const data = await chat(token, provider, [...messages, userMessage]);

      const botMessage: Message = {
        id: generateId(),
        role: "bot",
        text: data.response || "No response from server",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => {
        const filtered = prev.filter((msg) => msg.id !== "typing");
        return [...filtered, botMessage];
      });
    } catch (error) {
      console.error(error);
      setMessages((prev) => {
        const filtered = prev.filter((msg) => msg.id !== "typing");
        const errorMessage: Message = {
          id: generateId(),
          role: "bot",
          text: "⚠️ Could not connect to backend. Please check server.",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        return [...filtered, errorMessage];
      });
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const quickActions = [
    "I need someone to talk to",
    "I'm feeling anxious",
    "Help me relax",
    "I'm stressed about work",
  ];

  const handleQuickAction = (action: string) => {
    setInput(action);
    inputRef.current?.focus();
  };

  const adjustTextareaHeight = (textarea: HTMLTextAreaElement) => {
    textarea.style.height = "auto";
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px";
  };

  useEffect(() => {
    if (inputRef.current) {
      adjustTextareaHeight(inputRef.current);
    }
  }, [input]);

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="flex items-center justify-between p-2 sm:p-2 border-b gap-2 border-gray-200/60 bg-white/80 backdrop-blur-lg relative z-10">
        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg flex-shrink-0">
            <svg
              className="w-4 h-4 sm:w-6 sm:h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-lg sm:text-xl font-bold text-gray-800 truncate">
              CampBud
            </h1>
            <div className="flex items-center gap-1 text-xs sm:text-sm text-emerald-600">
              <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
              <span>Online</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          <div className="flex items-center gap-1 sm:gap-2">
            <label className="text-xs sm:text-sm text-gray-600 hidden sm:inline">
              Model:
            </label>
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value as "Gemini" | "Groq")}
              className="px-2 py-1 border rounded text-xs sm:text-sm bg-white min-w-0"
            >
              <option value="Daisy">Daisy</option>
              <option value="Rocky">Rocky</option>
            </select>
          </div>

          <div className="relative settings-container">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-1.5 sm:p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all duration-200"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                />
              </svg>
            </button>

            {showSettings && (
              <div className="absolute top-full right-0 mt-2 w-40 sm:w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-50">
                <button
                  onClick={() => setShowClearConfirm(true)}
                  className="flex items-center gap-2 w-full px-3 py-2 text-xs sm:text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <svg
                    className="w-3 h-3 sm:w-4 sm:h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Clear Chat
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 w-full max-w-xs sm:max-w-sm">
            <div className="text-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                Clear Chat History
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">
                This will permanently delete all your messages. This action
                cannot be undone.
              </p>
              <div className="flex gap-2 sm:gap-3">
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="flex-1 px-3 py-2 text-xs sm:text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={clearChat}
                  className="flex-1 px-3 py-2 text-xs sm:text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                >
                  Clear Chat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-h-0 p-0 sm:p-4 relative z-10">
        <div className="flex-1 flex flex-col min-h-0 rounded-none sm:rounded-2xl bg-white/80 backdrop-blur-lg border-0 sm:border sm:border-gray-200/60 shadow-none sm:shadow-xl overflow-hidden">
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-3 sm:p-4 text-center">
              <div className="max-w-sm sm:max-w-md">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <svg
                    className="w-6 h-6 sm:w-8 sm:h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
                  Hello! I'm your mental health companion.
                </h2>
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                  I'm here to listen and support you. Feel free to share what's
                  on your mind - whether it's something that's bothering you, a
                  win you'd like to celebrate, or just how your day is going.
                </p>
                <p className="text-xs sm:text-sm text-gray-700 mb-2 sm:mb-3 font-medium">
                  Quick responses:
                </p>
                <div className="grid grid-cols-1 sm:flex sm:flex-wrap sm:justify-center gap-2">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickAction(action)}
                      className="px-3 py-2 text-xs sm:text-sm text-gray-700 bg-white hover:bg-blue-50 hover:text-blue-700 border border-gray-200 hover:border-blue-300 rounded-lg sm:rounded-full transition-all duration-200 text-left sm:text-center"
                    >
                      {action}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 p-3 sm:p-4 overflow-y-auto space-y-2 sm:space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[90%] sm:max-w-[80%] flex gap-2 sm:gap-3 ${
                      message.role === "user" ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    <div
                      className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.role === "user"
                          ? "bg-gradient-to-br from-blue-500 to-indigo-600"
                          : "bg-gradient-to-br from-emerald-500 to-teal-600"
                      }`}
                    >
                      {message.role === "user" ? (
                        user?.avatarUrl ? (
                          <img
                            src={user.avatarUrl}
                            alt={`${user.name}'s profile picture`}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          userAvatar
                        )
                      ) : (
                        botAvatar
                      )}
                    </div>

                    <div className="flex flex-col">
                      <div
                        className={`px-3 py-2 sm:px-4 sm:py-3 rounded-xl sm:rounded-2xl ${
                          message.role === "user"
                            ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-tr-md"
                            : "bg-gray-100 text-gray-800 rounded-tl-md"
                        }`}
                      >
                        {message.isTyping ? (
                          <div className="flex items-center gap-1">
                            <div className="flex gap-1">
                              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce"></div>
                              <div
                                className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce"
                                style={{ animationDelay: "0.1s" }}
                              ></div>
                              <div
                                className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce"
                                style={{ animationDelay: "0.2s" }}
                              ></div>
                            </div>
                          </div>
                        ) : (
                          <p className="text-xs sm:text-sm leading-relaxed">
                            {message.text}
                          </p>
                        )}
                      </div>
                      {message.time && !message.isTyping && (
                        <p
                          className={`text-xs mt-1 ${
                            message.role === "user" ? "text-right" : "text-left"
                          } text-gray-500`}
                        >
                          {message.time}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}

          <div className="p-3 sm:p-4 border-t border-gray-200/60 bg-white/90">
            <div className="flex items-end gap-2 sm:gap-3">
              {hasRecognitionSupport ? (
                <button
                  onClick={handleVoiceToggle}
                  disabled={loading}
                  className={`p-2 sm:p-3 rounded-lg sm:rounded-xl transition-all duration-200 ${
                    isListening
                      ? "bg-red-500 text-white shadow-lg"
                      : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                  } flex items-center justify-center h-[40px] sm:h-[52px]`}
                >
                  <Mic className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              ) : (
                <SpeechInput
                  onTranscript={(text) => setInput(text)}
                  disabled={loading}
                />
              )}
              <SpeechInput
                onTranscript={(text) => setInput(text)}
                disabled={loading}
              />

              {/* Optional: you might still want to allow fallback even if browser recog exists but fails at runtime */}
              {/* e.g. always show SpeechInput as fallback or in parallel, depending on UX you prefer */}

              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder={
                    isListening ? "Listening..." : "Share your thoughts..."
                  }
                  disabled={loading}
                  rows={1}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 pr-8 sm:pr-12 rounded-lg sm:rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200 placeholder-gray-500 text-sm resize-none bg-white"
                  style={{ minHeight: "40px", maxHeight: "120px" }}
                />
                {input && !isListening && (
                  <button
                    onClick={() => setInput("")}
                    className="absolute right-2 top-2 sm:right-3 sm:top-3 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg
                      className="w-3 h-3 sm:w-4 sm:h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>

              <button
                onClick={send}
                disabled={loading || !input.trim()}
                className={`p-2 sm:p-3 rounded-lg sm:rounded-xl transition-all duration-200 ${
                  loading || !input.trim()
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl"
                } flex items-center justify-center h-[40px] sm:h-[52px]`}
              >
                {loading ? (
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
