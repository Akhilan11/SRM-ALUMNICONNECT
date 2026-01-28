// Chatbot.jsx
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, 
  Sparkles, 
  X, 
  Copy, 
  ThumbsUp, 
  ThumbsDown, 
  RotateCcw,
  Calendar,
  Users,
  Briefcase,
  GraduationCap,
  Heart,
  Bell,
  ArrowUp,
  Check,
  MessageSquare,
  Bot
} from "lucide-react";

export default function Chatbot() {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState({});
  const [showChat, setShowChat] = useState(false);
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);

  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  // Auto-scroll to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory, loading]);

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!message.trim() || loading) return;

    const userMessage = message.trim();
    setChatHistory(prev => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);
    setError("");
    setMessage("");
    setShowChat(true);

    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.details || 'Failed to get response');
      }

      setChatHistory(prev => [...prev, { 
        role: "assistant", 
        content: data.reply,
        id: Date.now()
      }]);

    } catch (err) {
      console.error("Chatbot request error:", err);
      setError(err.message || "Failed to get response. Please try again.");
      
      setChatHistory(prev => [...prev, { 
        role: "assistant", 
        content: "I'm having trouble connecting right now. Please try again in a moment.",
        isError: true
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyMessage = (content) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    const text = tempDiv.textContent || tempDiv.innerText || '';
    navigator.clipboard.writeText(text);
    setFeedback(prev => ({ ...prev, [content]: 'copied' }));
    setTimeout(() => {
      setFeedback(prev => {
        const newFeedback = { ...prev };
        delete newFeedback[content];
        return newFeedback;
      });
    }, 2000);
  };

  const handleFeedback = (messageId, isPositive) => {
    setFeedback(prev => ({ ...prev, [messageId]: isPositive ? 'liked' : 'disliked' }));
  };

  const handleClearChat = () => {
    setChatHistory([]);
    setFeedback({});
    setShowChat(false);
  };

  const handleExampleClick = (question) => {
    setMessage(question);
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  const examplePrompts = [
    { 
      text: "What events are coming up this month?", 
      icon: Calendar,
      desc: "View upcoming events"
    },
    { 
      text: "Show me active fundraising campaigns", 
      icon: Heart,
      desc: "Explore fundraisers"
    },
    { 
      text: "Find internship opportunities", 
      icon: Briefcase,
      desc: "Browse internships"
    },
    { 
      text: "List alumni from my batch", 
      icon: Users,
      desc: "Alumni directory"
    },
  ];

  const renderHTML = (htmlContent) => {
    return { __html: htmlContent };
  };

  return (
    <div className="min-h-screen bg-base-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        
        {/* Welcome Screen - Show when no chat */}
        {!showChat ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center min-h-[80vh]"
          >
            {/* Animated Orb */}
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative mb-8"
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary via-secondary to-accent opacity-80 blur-sm absolute inset-0"></div>
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary via-secondary to-accent relative flex items-center justify-center">
                <Bot className="w-10 h-10 text-primary-content" />
              </div>
            </motion.div>

            {/* Greeting */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-10"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-base-content mb-2">
                {getGreeting()}
              </h1>
              <h2 className="text-3xl md:text-4xl font-bold">
                <span className="text-base-content">What's on </span>
                <span className="text-primary">your mind?</span>
              </h2>
            </motion.div>

            {/* Main Input Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="w-full max-w-2xl mb-10"
            >
              <div className="bg-base-100 border border-base-300 rounded-2xl shadow-sm p-4">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-base-content/40 mt-1 shrink-0" />
                  <textarea
                    ref={inputRef}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Ask AI a question or make a request..."
                    className="flex-1 bg-transparent border-0 outline-none resize-none text-base-content placeholder-base-content/40 min-h-[80px]"
                    rows={3}
                  />
                </div>
                
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-base-200">
                  <div className="text-xs text-base-content/40">
                    Press Enter to send
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={!message.trim() || loading}
                    className="btn btn-primary btn-sm btn-circle"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Example Prompts */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="w-full max-w-2xl"
            >
              <p className="text-xs font-medium text-base-content/50 uppercase tracking-wider mb-4">
                Get started with an example below
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {examplePrompts.map((prompt, index) => {
                  const Icon = prompt.icon;
                  return (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      onClick={() => handleExampleClick(prompt.text)}
                      className="flex flex-col items-start p-4 bg-base-100 border border-base-300 rounded-xl hover:border-base-400 hover:shadow-sm transition-all text-left group"
                    >
                      <p className="text-sm text-base-content mb-4 leading-relaxed">
                        {prompt.text}
                      </p>
                      <Icon className="w-5 h-5 text-base-content/30 group-hover:text-base-content/50 transition-colors mt-auto" />
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        ) : (
          /* Chat Interface */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col h-[85vh]"
          >
            {/* Chat Header */}
            <div className="flex items-center justify-between pb-4 border-b border-base-200 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <Bot className="w-5 h-5 text-primary-content" />
                </div>
                <div>
                  <h3 className="font-semibold text-base-content">Alumni Assistant</h3>
                  <p className="text-xs text-base-content/50">Always here to help</p>
                </div>
              </div>
              <button
                onClick={handleClearChat}
                className="btn btn-ghost btn-sm gap-2 text-base-content/60"
              >
                <RotateCcw className="w-4 h-4" />
                New Chat
              </button>
            </div>

            {/* Error */}
            {error && (
              <div className="alert alert-error mb-4 py-2">
                <span className="text-sm">{error}</span>
                <button onClick={() => setError("")} className="btn btn-xs btn-ghost">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Messages */}
            <div 
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto space-y-6 pr-2"
            >
              <AnimatePresence>
                {chatHistory.map((chat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-3 ${chat.role === "user" ? "flex-row-reverse" : ""}`}
                  >
                    {/* Avatar */}
                    <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      chat.role === "user" 
                        ? "bg-primary text-primary-content" 
                        : "bg-base-200 text-base-content"
                    }`}>
                      {chat.role === "user" ? (
                        <span className="text-xs font-medium">You</span>
                      ) : (
                        <Bot className="w-4 h-4" />
                      )}
                    </div>

                    {/* Message */}
                    <div className={`flex-1 max-w-[80%] ${chat.role === "user" ? "text-right" : ""}`}>
                      <div className={`inline-block px-4 py-3 rounded-2xl ${
                        chat.role === "user"
                          ? "bg-primary text-primary-content rounded-tr-md"
                          : chat.isError 
                            ? "bg-error/10 text-error border border-error/20 rounded-tl-md"
                            : "bg-base-200 text-base-content rounded-tl-md"
                      }`}>
                        {chat.role === "assistant" && chat.content.includes('<') ? (
                          <div 
                            dangerouslySetInnerHTML={renderHTML(chat.content)}
                            className="prose prose-sm max-w-none"
                          />
                        ) : (
                          <p className="text-sm whitespace-pre-wrap">{chat.content}</p>
                        )}
                      </div>
                      
                      {/* Actions for assistant messages */}
                      {chat.role === "assistant" && !chat.isError && (
                        <div className="flex items-center gap-1 mt-2 opacity-0 hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleCopyMessage(chat.content)}
                            className="btn btn-xs btn-ghost gap-1 text-base-content/50"
                          >
                            {feedback[chat.content] === 'copied' ? (
                              <>
                                <Check className="w-3 h-3" />
                                Copied
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                Copy
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => handleFeedback(chat.id || index, true)}
                            className={`btn btn-xs btn-ghost ${feedback[chat.id || index] === 'liked' ? 'text-success' : 'text-base-content/50'}`}
                          >
                            <ThumbsUp className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleFeedback(chat.id || index, false)}
                            className={`btn btn-xs btn-ghost ${feedback[chat.id || index] === 'disliked' ? 'text-error' : 'text-base-content/50'}`}
                          >
                            <ThumbsDown className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
                
                {/* Loading */}
                {loading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-base-200 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-base-content" />
                    </div>
                    <div className="bg-base-200 rounded-2xl rounded-tl-md px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="loading loading-dots loading-sm text-base-content/60"></span>
                        <span className="text-sm text-base-content/60">Thinking...</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Input */}
            <div className="pt-4 border-t border-base-200 mt-4">
              <form onSubmit={handleSendMessage} className="flex items-end gap-3">
                <div className="flex-1 bg-base-200 rounded-2xl p-3">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Type your message..."
                    className="w-full bg-transparent border-0 outline-none resize-none text-base-content placeholder-base-content/40 text-sm min-h-[24px] max-h-[120px]"
                    rows={1}
                    disabled={loading}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || !message.trim()}
                  className="btn btn-primary btn-circle shrink-0"
                >
                  {loading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    <ArrowUp className="w-5 h-5" />
                  )}
                </button>
              </form>
              <p className="text-xs text-base-content/40 text-center mt-3">
                AI can make mistakes. Verify important information.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
