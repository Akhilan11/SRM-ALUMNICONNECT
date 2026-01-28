// Announcement.jsx
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  orderBy,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bell, 
  Plus, 
  Edit3, 
  Trash2, 
  Megaphone,
  Search,
  X,
  AlertCircle,
  CheckCircle2,
  Globe,
  Shield,
  GraduationCap,
  UserCircle,
  Clock,
  Pin,
  MoreHorizontal,
  MessageCircle,
  Share2,
  ChevronRight,
  Send,
  ThumbsUp,
  Eye
} from "lucide-react";

export default function Announcements() {
  const { user, role, loading } = useAuth();
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [form, setForm] = useState({ subject: "", body: "", targetRole: "all", priority: "normal" });
  const [showModal, setShowModal] = useState(false);
  const [editingMessage, setEditingMessage] = useState(null);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  const fetchMessages = async () => {
    try {
      const q = query(collection(db, "notifications"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setMessages(data);
      setFilteredMessages(data);
    } catch (err) {
      console.error("Error fetching announcements:", err);
      setError("Failed to fetch announcements.");
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    let filtered = messages;
    if (activeFilter !== "all") {
      filtered = filtered.filter(m => m.targetRole === activeFilter);
    }
    if (searchQuery) {
      filtered = filtered.filter(m => 
        m.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.body?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredMessages(filtered);
  }, [activeFilter, searchQuery, messages]);

  const handleFormChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.subject.trim() || !form.body.trim()) {
      setError("Subject and Body are required.");
      return;
    }
    if (!user || role !== "admin") {
      setError("Only admins can perform this action.");
      return;
    }
    setPosting(true);
    try {
      if (editingMessage) {
        await updateDoc(doc(db, "notifications", editingMessage.id), {
          ...form,
          updatedAt: serverTimestamp(),
        });
        setSuccess("Updated successfully!");
      } else {
        await addDoc(collection(db, "notifications"), {
          ...form,
          createdAt: serverTimestamp(),
        });
        setSuccess("Published!");
      }
      setForm({ subject: "", body: "", targetRole: "all", priority: "normal" });
      setEditingMessage(null);
      setShowModal(false);
      fetchMessages();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to save.");
    }
    setPosting(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this announcement?")) return;
    try {
      await deleteDoc(doc(db, "notifications", id));
      fetchMessages();
      if (selectedAnnouncement?.id === id) setSelectedAnnouncement(null);
    } catch (err) {
      setError("Failed to delete.");
    }
  };

  const categories = [
    { id: "all", label: "All Announcements", icon: Megaphone, color: "primary" },
    { id: "student", label: "For Students", icon: GraduationCap, color: "success" },
    { id: "alumni", label: "For Alumni", icon: UserCircle, color: "info" },
    { id: "admin", label: "Admin Only", icon: Shield, color: "error" },
  ];

  const getCategoryConfig = (targetRole) => {
    return categories.find(c => c.id === targetRole) || categories.find(c => c.id === "all");
  };

  const formatDate = (timestamp) => {
    if (!timestamp?.toDate) return "Just now";
    const date = timestamp.toDate();
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatFullDate = (timestamp) => {
    if (!timestamp?.toDate) return "Just now";
    return timestamp.toDate().toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get pinned (high priority) announcements
  const pinnedAnnouncements = messages.filter(m => m.priority === "high").slice(0, 4);
  
  // Get counts per category
  const getCategoryCount = (categoryId) => {
    if (categoryId === "all") return messages.length;
    return messages.filter(m => m.targetRole === categoryId).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-base-100 flex items-center justify-center mx-auto mb-4 shadow">
            <Bell className="w-8 h-8 text-base-content/40" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Sign in required</h2>
          <p className="text-base-content/60 mb-6">Please sign in to view announcements</p>
          <a href="/auth" className="btn btn-primary">Sign In</a>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      {/* Success Toast */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 z-50 alert alert-success shadow-lg py-3"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{success}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-base-content">Announcements</h1>
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/40" />
              <input
                type="text"
                placeholder="Search..."
                className="input input-bordered input-sm pl-9 w-48 bg-base-100"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* 3-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT SIDEBAR - Categories */}
          <div className="lg:col-span-3">
            <div className="bg-base-100 rounded-2xl shadow-sm p-4 sticky top-6">
              <h2 className="font-semibold text-base-content mb-4">Category</h2>
              
              <nav className="space-y-1">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  const count = getCategoryCount(cat.id);
                  const isActive = activeFilter === cat.id;
                  
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveFilter(cat.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all ${
                        isActive 
                          ? 'bg-primary/10 text-primary font-medium' 
                          : 'text-base-content/70 hover:bg-base-200'
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${isActive ? `text-${cat.color}` : ''}`} />
                        {cat.label}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        isActive ? 'bg-primary text-primary-content' : 'bg-base-200'
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </nav>

              {/* Quick Stats */}
              <div className="mt-6 pt-6 border-t border-base-200">
                <h3 className="text-sm font-medium text-base-content/60 mb-3">Quick Stats</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-base-content/60">Total Posts</span>
                    <span className="font-medium">{messages.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-base-content/60">Urgent</span>
                    <span className="font-medium text-error">{pinnedAnnouncements.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CENTER - Main Feed */}
          <div className="lg:col-span-6">
            {/* Create Post Card - Admin Only */}
        {role === "admin" && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-base-100 rounded-2xl shadow-sm p-4 mb-4"
              >
                <div 
                  className="flex items-center gap-3 cursor-pointer"
            onClick={() => {
                    setForm({ subject: "", body: "", targetRole: "all", priority: "normal" });
              setEditingMessage(null);
              setShowModal(true);
            }}
          >
                  <div className="avatar placeholder">
                    <div className="bg-primary text-primary-content rounded-full w-10">
                      <span className="text-sm font-medium">
                        {user.displayName?.[0] || user.email?.[0]?.toUpperCase() || 'A'}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 px-4 py-2.5 bg-base-200 rounded-full text-base-content/50 hover:bg-base-300 transition-colors">
                    What would you like to announce?
                  </div>
                  <button className="btn btn-primary btn-sm gap-2">
                    <Plus className="w-4 h-4" />
                    Create
                  </button>
                </div>
              </motion.div>
            )}

            {/* Error Alert */}
            {error && (
              <div className="alert alert-error mb-4 py-3">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
                <button className="btn btn-ghost btn-xs" onClick={() => setError("")}>
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Feed */}
            {filteredMessages.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-base-100 rounded-2xl shadow-sm p-12 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-base-200 flex items-center justify-center mx-auto mb-4">
                  <Bell className="w-8 h-8 text-base-content/30" />
                </div>
                <h3 className="font-semibold text-base-content mb-2">No announcements</h3>
                <p className="text-base-content/60 text-sm">
                  {searchQuery ? `No results for "${searchQuery}"` : "Check back later for updates"}
                </p>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {filteredMessages.map((m, idx) => {
                  const category = getCategoryConfig(m.targetRole);
                  const Icon = category.icon;
                  const isPinned = m.priority === "high";
                  
                  return (
                    <motion.article
                      key={m.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="bg-base-100 rounded-2xl shadow-sm overflow-hidden group"
                    >
                      {/* Post Header */}
                      <div className="p-4 pb-0">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="avatar placeholder">
                              <div className={`bg-${category.color}/10 text-${category.color} rounded-full w-11`}>
                                <Icon className="w-5 h-5" />
                              </div>
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-base-content">Admin</span>
                                <span className="text-xs text-base-content/50">• {formatDate(m.createdAt)}</span>
                              </div>
                              <span className="text-xs text-base-content/60">{category.label}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {/* Category Badge - Outlined pill style */}
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-base-300 bg-base-100 text-sm text-base-content/80">
                              <Icon className="w-4 h-4" />
                              {category.label}
                            </span>
                            {/* Pin Icon */}
                            {isPinned && (
                              <div className="tooltip tooltip-left" data-tip="Pinned">
                                <Pin className="w-4 h-4 text-warning fill-warning" />
                              </div>
                            )}
                {role === "admin" && (
                              <div className="dropdown dropdown-end">
                                <label tabIndex={0} className="btn btn-ghost btn-xs btn-square">
                                  <MoreHorizontal className="w-4 h-4" />
                                </label>
                                <ul tabIndex={0} className="dropdown-content z-10 menu p-2 shadow-lg bg-base-100 rounded-xl w-36 border border-base-200">
                                  <li>
                                    <button
                      onClick={() => {
                        setEditingMessage(m);
                        setForm({
                          subject: m.subject,
                          body: m.body,
                                          targetRole: m.targetRole || "all",
                                          priority: m.priority || "normal",
                        });
                        setShowModal(true);
                      }}
                    >
                                      <Edit3 className="w-4 h-4" />
                                      Edit
                                    </button>
                                  </li>
                                  <li>
                                    <button onClick={() => handleDelete(m.id)} className="text-error">
                                      <Trash2 className="w-4 h-4" />
                                      Delete
                                    </button>
                                  </li>
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Post Content */}
                      <div className="p-4 pt-2">
                        <h3 className="text-lg font-bold text-base-content mb-2">
                          {m.subject}
                        </h3>
                        
                        <p className="text-base-content/70 leading-relaxed line-clamp-3">
                          {m.body}
                        </p>
                        
                        {m.body?.length > 200 && (
                          <button 
                            onClick={() => setSelectedAnnouncement(m)}
                            className="text-primary text-sm font-medium mt-2 hover:underline"
                          >
                            Read more...
                          </button>
                        )}
                      </div>

                      {/* Post Footer */}
                      <div className="px-4 py-3 border-t border-base-200 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <button className="flex items-center gap-2 text-base-content/60 hover:text-primary transition-colors text-sm">
                            <ThumbsUp className="w-4 h-4" />
                            <span>Like</span>
                          </button>
                          <button className="flex items-center gap-2 text-base-content/60 hover:text-primary transition-colors text-sm">
                            <MessageCircle className="w-4 h-4" />
                            <span>Comment</span>
                          </button>
                          <button className="flex items-center gap-2 text-base-content/60 hover:text-primary transition-colors text-sm">
                            <Share2 className="w-4 h-4" />
                            <span>Share</span>
                          </button>
                        </div>
                        <button 
                          onClick={() => setSelectedAnnouncement(m)}
                          className="btn btn-ghost btn-sm gap-2 text-base-content/60"
                        >
                          <Eye className="w-4 h-4" />
                          View Full Post
                        </button>
                      </div>
                    </motion.article>
                  );
                })}
              </div>
            )}
          </div>

          {/* RIGHT SIDEBAR - Pinned Announcements */}
          <div className="lg:col-span-3">
            <div className="bg-base-100 rounded-2xl shadow-sm p-4 sticky top-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-base-content">Pinned Announcements</h2>
                <button className="btn btn-ghost btn-xs btn-square">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
              
              {pinnedAnnouncements.length === 0 ? (
                <div className="text-center py-8">
                  <Pin className="w-8 h-8 text-base-content/20 mx-auto mb-2" />
                  <p className="text-sm text-base-content/50">No pinned announcements</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pinnedAnnouncements.map((m) => {
                    const category = getCategoryConfig(m.targetRole);
                    const Icon = category.icon;
                    
                    return (
                      <div 
                        key={m.id}
                        className="group cursor-pointer"
                        onClick={() => setSelectedAnnouncement(m)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="avatar placeholder shrink-0">
                            <div className={`bg-${category.color}/10 text-${category.color} rounded-full w-9`}>
                              <Icon className="w-4 h-4" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <span className="text-sm font-medium text-base-content truncate">Admin</span>
                              <span className="badge badge-warning badge-xs shrink-0">
                                <Pin className="w-2 h-2 mr-0.5" />
                                Pinned
                              </span>
                            </div>
                            <span className={`text-xs text-${category.color}`}>
                              {category.label}
                            </span>
                            <h4 className="font-semibold text-sm text-base-content mt-1.5 line-clamp-2 group-hover:text-primary transition-colors">
                              {m.subject}
                            </h4>
                            <p className="text-xs text-base-content/60 mt-1 line-clamp-2">
                              {m.body}
                            </p>
                            <button className="text-xs text-primary font-medium mt-2 flex items-center gap-1 group-hover:underline">
                              View post
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        
                        <div className="border-b border-base-200 mt-4"></div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Full Post Modal */}
      <AnimatePresence>
        {selectedAnnouncement && (
          <div className="modal modal-open">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="modal-box max-w-2xl"
            >
              {(() => {
                const category = getCategoryConfig(selectedAnnouncement.targetRole);
                const Icon = category.icon;
                return (
                  <>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="avatar placeholder">
                          <div className={`bg-${category.color}/10 text-${category.color} rounded-full w-12`}>
                            <Icon className="w-6 h-6" />
                          </div>
                        </div>
                        <div>
                          <div className="font-semibold">Admin</div>
                          <div className="text-xs text-base-content/60">
                            {formatFullDate(selectedAnnouncement.createdAt)}
                          </div>
                        </div>
                      </div>
                      <button 
                        className="btn btn-ghost btn-sm btn-circle"
                        onClick={() => setSelectedAnnouncement(null)}
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-${category.color}/10 text-${category.color} text-xs font-medium mb-4`}>
                      <Icon className="w-3 h-3" />
                      {category.label}
                    </div>
                    
                    <h2 className="text-2xl font-bold mb-4">{selectedAnnouncement.subject}</h2>
                    <p className="text-base-content/80 whitespace-pre-wrap leading-relaxed">
                      {selectedAnnouncement.body}
                    </p>
                    
                    {selectedAnnouncement.priority === "high" && (
                      <div className="mt-6 p-4 rounded-xl bg-warning/10 border border-warning/20 flex items-center gap-3">
                        <Pin className="w-5 h-5 text-warning" />
                        <span className="text-sm font-medium text-warning">This is a pinned announcement</span>
                  </div>
                )}
                  </>
                );
              })()}
              </motion.div>
            <div 
              className="modal-backdrop bg-neutral/60 backdrop-blur-sm" 
              onClick={() => setSelectedAnnouncement(null)}
            />
          </div>
        )}
      </AnimatePresence>

      {/* Create/Edit Modal */}
        <AnimatePresence>
          {showModal && (
          <div className="modal modal-open">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="modal-box"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold">
                  {editingMessage ? "Edit Announcement" : "Create Announcement"}
                </h3>
                <button 
                  className="btn btn-ghost btn-sm btn-circle"
                  onClick={() => { setShowModal(false); setEditingMessage(null); setError(""); }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
                {error && (
                <div className="alert alert-error mb-4 py-2">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">{error}</span>
                </div>
              )}
              
              <form onSubmit={handleSave} className="space-y-4">
                <div className="form-control">
                  <label className="label"><span className="label-text font-medium">Title</span></label>
                    <input
                      name="subject"
                      value={form.subject}
                    placeholder="Announcement title"
                      onChange={handleFormChange}
                    className="input input-bordered"
                      required
                    />
                  </div>
                
                <div className="form-control">
                  <label className="label"><span className="label-text font-medium">Content</span></label>
                    <textarea
                      name="body"
                      value={form.body}
                    placeholder="Write your announcement..."
                      onChange={handleFormChange}
                    className="textarea textarea-bordered min-h-[150px]"
                      required
                    />
                  </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label"><span className="label-text font-medium">Target Audience</span></label>
                    <select
                      name="targetRole"
                      value={form.targetRole}
                      onChange={handleFormChange}
                      className="select select-bordered"
                    >
                      <option value="all">Everyone</option>
                      <option value="student">Students Only</option>
                      <option value="alumni">Alumni Only</option>
                      <option value="admin">Admins Only</option>
                    </select>
                  </div>

                  <div className="form-control">
                    <label className="label"><span className="label-text font-medium">Priority</span></label>
                    <select
                      name="priority"
                      value={form.priority}
                      onChange={handleFormChange}
                      className="select select-bordered"
                    >
                      <option value="normal">Normal</option>
                      <option value="medium">Important</option>
                      <option value="high">Urgent (Pinned)</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 pt-4">
                  <button
                      type="button"
                    className="btn btn-ghost"
                    onClick={() => { setShowModal(false); setEditingMessage(null); }}
                    >
                      Cancel
                  </button>
                  <button type="submit" className="btn btn-primary gap-2" disabled={posting}>
                    {posting ? <span className="loading loading-spinner loading-sm"></span> : <Send className="w-4 h-4" />}
                    {editingMessage ? "Update" : "Publish"}
                  </button>
                  </div>
                </form>
            </motion.div>
            <div 
              className="modal-backdrop bg-neutral/60 backdrop-blur-sm" 
              onClick={() => { setShowModal(false); setEditingMessage(null); }}
            />
          </div>
          )}
        </AnimatePresence>
    </div>
  );
}
