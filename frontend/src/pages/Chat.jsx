// Chat.jsx - Alumni Community Chat
import React, { useEffect, useState, useRef, useMemo } from "react";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Users,
  Edit3,
  Trash2,
  X,
  Reply,
  Send,
  ArrowDown,
  Hash,
  Wifi,
  WifiOff,
  Sparkles,
  Shield,
  GraduationCap,
  User,
  Circle,
  Heart,
  ThumbsUp,
  Laugh,
  Flame,
  Clock,
  MessageCircle,
  TrendingUp,
  Calendar,
} from "lucide-react";

const REACTIONS = [
  { emoji: "👍", label: "Like" },
  { emoji: "❤️", label: "Love" },
  { emoji: "😂", label: "Haha" },
  { emoji: "🔥", label: "Fire" },
];

export default function Chat() {
  const { user, role } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editText, setEditText] = useState("");
  const [replyToMessage, setReplyToMessage] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    const q = query(
      collection(db, "chats", "global", "messages"),
      orderBy("timestamp", "asc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(messagesData);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleScroll = () => {
      if (messagesContainerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
        setShowScrollButton(scrollHeight - scrollTop > clientHeight + 100);
      }
    };
    const container = messagesContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setReplyToMessage(null);
        setEditingMessageId(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    return timestamp.toDate().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    const date = timestamp.toDate();
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMsg.trim() || !isOnline) return;

    try {
      const messageData = {
        text: newMsg,
        senderId: user.uid,
        senderName: user.displayName || user.email?.split("@")[0] || "Anonymous",
        role: role || "Member",
        timestamp: serverTimestamp(),
        edited: false,
        reactions: {},
      };

      if (replyToMessage) {
        messageData.replyTo = {
          messageId: replyToMessage.id,
          senderName: replyToMessage.senderName,
          text: replyToMessage.text,
        };
      }

      await addDoc(collection(db, "chats", "global", "messages"), messageData);
      setNewMsg("");
      setReplyToMessage(null);
      inputRef.current?.focus();
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  };

  const editMessage = async (messageId) => {
    const original = messages.find((m) => m.id === messageId);
    if (!editText.trim() || editText === original?.text) {
      setEditingMessageId(null);
      setEditText("");
      return;
    }

    try {
      const messageRef = doc(db, "chats", "global", "messages", messageId);
      await updateDoc(messageRef, { text: editText, edited: true, editedAt: serverTimestamp() });
      setEditingMessageId(null);
      setEditText("");
    } catch (error) {
      console.error("Error editing message: ", error);
    }
  };

  const deleteMessage = async (messageId) => {
    if (window.confirm("Delete this message?")) {
      try {
        await deleteDoc(doc(db, "chats", "global", "messages", messageId));
      } catch (error) {
        console.error("Error deleting message: ", error);
      }
    }
  };

  const addReaction = async (messageId, emoji) => {
    try {
      const messageRef = doc(db, "chats", "global", "messages", messageId);
      const msg = messages.find((m) => m.id === messageId);
      const reactions = { ...(msg?.reactions || {}) };
      const users = reactions[emoji] || [];

      if (users.includes(user.uid)) {
        reactions[emoji] = users.filter((u) => u !== user.uid);
        if (reactions[emoji].length === 0) delete reactions[emoji];
      } else {
        reactions[emoji] = [...users, user.uid];
      }

      await updateDoc(messageRef, { reactions });
    } catch (error) {
      console.error("Error adding reaction: ", error);
    }
  };

  const getInitials = (name) => name.split(" ").map((n) => n[0]).join("").toUpperCase().substring(0, 2);

  const getRoleStyle = (role) => {
    switch (role?.toLowerCase()) {
      case "admin": return { bg: "bg-error", text: "text-error", label: "Admin" };
      case "alumni": return { bg: "bg-primary", text: "text-primary", label: "Alumni" };
      case "student": return { bg: "bg-success", text: "text-success", label: "Student" };
      default: return { bg: "bg-neutral", text: "text-neutral", label: "Member" };
    }
  };

  const groupedMessages = useMemo(() => {
    return messages.reduce((groups, message) => {
      const date = message.timestamp ? message.timestamp.toDate().toDateString() : "no-date";
      if (!groups[date]) groups[date] = [];
      groups[date].push(message);
      return groups;
    }, {});
  }, [messages]);

  const participants = useMemo(() => {
    const stats = messages.reduce((acc, msg) => {
      if (!acc[msg.senderId]) {
        acc[msg.senderId] = { id: msg.senderId, name: msg.senderName, role: msg.role, count: 0 };
      }
      acc[msg.senderId].count++;
      return acc;
    }, {});
    return Object.values(stats).sort((a, b) => b.count - a.count);
  }, [messages]);

  const todayMessages = useMemo(() => {
    const today = new Date().toDateString();
    return messages.filter((m) => m.timestamp?.toDate().toDateString() === today).length;
  }, [messages]);

  return (
    <div className="min-h-screen bg-base-200">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-base-content flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-primary-content" />
                </div>
                Community Chat
              </h1>
              <p className="text-base-content/60 mt-1">
                Connect with fellow alumni in real-time
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`badge badge-lg gap-2 ${isOnline ? "badge-success" : "badge-error"}`}>
                {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                {isOnline ? "Connected" : "Offline"}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
        >
          <div className="bg-base-100 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-base-content">{messages.length}</p>
                <p className="text-xs text-base-content/60">Total Messages</p>
              </div>
            </div>
          </div>
          <div className="bg-base-100 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-base-content">{participants.length}</p>
                <p className="text-xs text-base-content/60">Participants</p>
              </div>
            </div>
          </div>
          <div className="bg-base-100 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-base-content">{todayMessages}</p>
                <p className="text-xs text-base-content/60">Today</p>
              </div>
            </div>
          </div>
          <div className="bg-base-100 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center">
                <Circle className="w-5 h-5 text-info fill-info" />
              </div>
              <div>
                <p className="text-2xl font-bold text-base-content">{participants.length}</p>
                <p className="text-xs text-base-content/60">Online Now</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Chat Area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3"
          >
            <div className="bg-base-100 rounded-2xl shadow-sm overflow-hidden flex flex-col" style={{ height: "600px" }}>
              {/* Chat Header */}
              <div className="px-5 py-4 border-b border-base-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Hash className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-base-content">general</h3>
                    <p className="text-xs text-base-content/50">{participants.length} members</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  <span className="text-xs text-base-content/50">Live</span>
                </div>
              </div>

              {/* Messages */}
              <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                {loading ? (
                  <div className="flex flex-col items-center justify-center h-full">
                    <span className="loading loading-spinner loading-lg text-primary" />
                    <p className="mt-3 text-sm text-base-content/50">Loading messages...</p>
                  </div>
                ) : messages.length === 0 ? (
                  <EmptyChat inputRef={inputRef} />
                ) : (
                  Object.entries(groupedMessages).map(([date, dateMessages]) => (
                    <div key={date}>
                      <div className="flex items-center gap-3 my-4">
                        <div className="flex-1 h-px bg-base-200" />
                        <span className="text-[11px] text-base-content/40 bg-base-200 px-2 py-0.5 rounded">
                          {formatDate(dateMessages[0].timestamp)}
                        </span>
                        <div className="flex-1 h-px bg-base-200" />
                      </div>

                      <div className="space-y-3">
                        {dateMessages.map((msg, idx) => {
                          const isMe = msg.senderId === user.uid;
                          const showHeader = idx === 0 || dateMessages[idx - 1].senderId !== msg.senderId;
                          const style = getRoleStyle(msg.role);
                          const reactions = msg.reactions || {};

                          return (
                            <motion.div
                              key={msg.id}
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              className={`group ${showHeader ? "mt-4" : ""}`}
                            >
                              <div className="flex gap-3">
                                <div className={`shrink-0 ${showHeader ? "" : "invisible"}`}>
                                  <div className={`w-8 h-8 rounded-full ${style.bg} flex items-center justify-center text-white text-xs font-medium`}>
                                    {getInitials(msg.senderName)}
                                  </div>
                                </div>

                                <div className="flex-1 min-w-0">
                                  {showHeader && (
                                    <div className="flex items-center gap-2 mb-0.5">
                                      <span className="font-medium text-sm text-base-content">{msg.senderName}</span>
                                      <span className={`text-[10px] ${style.text}`}>{style.label}</span>
                                      <span className="text-[10px] text-base-content/30">{formatTime(msg.timestamp)}</span>
                                    </div>
                                  )}

                                  {msg.replyTo && (
                                    <div className="mb-1 pl-2 border-l-2 border-primary/30 text-xs text-base-content/50">
                                      <span className="font-medium">{msg.replyTo.senderName}:</span> {msg.replyTo.text}
                                    </div>
                                  )}

                                  {editingMessageId === msg.id ? (
                                    <div className="bg-base-200 rounded-lg p-2">
                                      <textarea
                                        value={editText}
                                        onChange={(e) => setEditText(e.target.value)}
                                        className="textarea textarea-sm w-full bg-base-100 min-h-[50px]"
                                        autoFocus
                                      />
                                      <div className="flex justify-end gap-2 mt-2">
                                        <button onClick={() => setEditingMessageId(null)} className="btn btn-xs btn-ghost">Cancel</button>
                                        <button onClick={() => editMessage(msg.id)} className="btn btn-xs btn-primary">Save</button>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="relative">
                                      <p className="text-sm text-base-content/90 leading-relaxed whitespace-pre-wrap">
                                        {msg.text}
                                        {msg.edited && <span className="text-[10px] text-base-content/30 ml-1">(edited)</span>}
                                      </p>

                                      {Object.keys(reactions).length > 0 && (
                                        <div className="flex gap-1 mt-1">
                                          {Object.entries(reactions).map(([emoji, users]) => (
                                            <button
                                              key={emoji}
                                              onClick={() => addReaction(msg.id, emoji)}
                                              className={`text-xs px-1.5 py-0.5 rounded-full ${
                                                users.includes(user.uid) ? "bg-primary/20" : "bg-base-200"
                                              }`}
                                            >
                                              {emoji} {users.length}
                                            </button>
                                          ))}
                                        </div>
                                      )}

                                      <div className="absolute -top-2 right-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 bg-base-100 border border-base-200 rounded-lg p-0.5 shadow-sm">
                                        {REACTIONS.map((r) => (
                                          <button
                                            key={r.emoji}
                                            onClick={() => addReaction(msg.id, r.emoji)}
                                            className="btn btn-xs btn-ghost px-1"
                                            title={r.label}
                                          >
                                            {r.emoji}
                                          </button>
                                        ))}
                                        <div className="w-px h-4 bg-base-200 mx-0.5" />
                                        <button onClick={() => setReplyToMessage(msg)} className="btn btn-xs btn-ghost btn-square">
                                          <Reply className="w-3 h-3" />
                                        </button>
                                        {isMe && (
                                          <>
                                            <button onClick={() => { setEditText(msg.text); setEditingMessageId(msg.id); }} className="btn btn-xs btn-ghost btn-square">
                                              <Edit3 className="w-3 h-3" />
                                            </button>
                                            <button onClick={() => deleteMessage(msg.id)} className="btn btn-xs btn-ghost btn-square text-error">
                                              <Trash2 className="w-3 h-3" />
                                            </button>
                                          </>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Reply Bar */}
              <AnimatePresence>
                {replyToMessage && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    className="border-t border-base-200 bg-primary/5 px-4 py-2 overflow-hidden"
                  >
                    <div className="flex items-center gap-2">
                      <Reply className="w-4 h-4 text-primary shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-primary">Replying to {replyToMessage.senderName}</p>
                        <p className="text-xs text-base-content/50 truncate">{replyToMessage.text}</p>
                      </div>
                      <button onClick={() => setReplyToMessage(null)} className="btn btn-xs btn-ghost btn-circle">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Input */}
              <div className="p-4 border-t border-base-200">
                <form onSubmit={sendMessage} className="flex gap-2">
                  <input
                    ref={inputRef}
                    className="input input-bordered flex-1 bg-base-200/50 focus:bg-base-100"
                    value={newMsg}
                    onChange={(e) => setNewMsg(e.target.value)}
                    placeholder={isOnline ? "Type a message..." : "You're offline..."}
                    disabled={!isOnline}
                  />
                  <button
                    type="submit"
                    disabled={!newMsg.trim() || !isOnline}
                    className="btn btn-primary btn-square"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </form>
              </div>
            </div>

            {/* Scroll Button */}
            <AnimatePresence>
              {showScrollButton && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  onClick={scrollToBottom}
                  className="fixed bottom-8 left-1/2 -translate-x-1/2 btn btn-sm btn-neutral shadow-lg gap-2"
                >
                  <ArrowDown className="w-4 h-4" />
                  New messages
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            {/* Active Members */}
            <div className="bg-base-100 rounded-2xl shadow-sm p-4">
              <h3 className="font-semibold text-base-content mb-4 flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                Active Members
              </h3>
              <div className="space-y-2">
                {participants.slice(0, 8).map((p) => {
                  const style = getRoleStyle(p.role);
                  return (
                    <div key={p.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-base-200/50 transition-colors">
                      <div className="relative">
                        <div className={`w-8 h-8 rounded-full ${style.bg} flex items-center justify-center text-white text-xs font-medium`}>
                          {getInitials(p.name)}
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-success rounded-full border-2 border-base-100" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-base-content truncate">{p.name}</p>
                        <p className="text-[10px] text-base-content/50">{p.count} messages</p>
                      </div>
                    </div>
                  );
                })}
                {participants.length > 8 && (
                  <p className="text-xs text-center text-base-content/50 pt-2">
                    +{participants.length - 8} more members
                  </p>
                )}
              </div>
            </div>

            {/* Chat Guidelines */}
            <div className="bg-base-100 rounded-2xl shadow-sm p-4">
              <h3 className="font-semibold text-base-content mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-warning" />
                Guidelines
              </h3>
              <ul className="text-xs text-base-content/60 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-success">✓</span>
                  Be respectful and supportive
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success">✓</span>
                  Share knowledge and experiences
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success">✓</span>
                  Help fellow alumni
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-error">✗</span>
                  No spam or self-promotion
                </li>
              </ul>
            </div>

            {/* Quick Tips */}
            <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10">
              <p className="text-xs text-base-content/70">
                <span className="font-semibold text-primary">Pro tip:</span> Press <kbd className="kbd kbd-xs">Esc</kbd> to cancel reply or edit
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function EmptyChat({ inputRef }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-4">
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4"
      >
        <MessageSquare className="w-8 h-8 text-primary" />
      </motion.div>
      <h3 className="text-lg font-semibold text-base-content mb-1">No messages yet</h3>
      <p className="text-sm text-base-content/60 mb-4">Be the first to start the conversation!</p>
      <button onClick={() => inputRef.current?.focus()} className="btn btn-primary btn-sm gap-2">
        <Send className="w-4 h-4" />
        Start chatting
      </button>
    </div>
  );
}
