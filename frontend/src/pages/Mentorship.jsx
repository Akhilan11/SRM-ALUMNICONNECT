// Mentorship.jsx - Clean Minimal Job Board
import React, { useEffect, useState, useMemo } from "react";
import {
  collection,
  getDocs,
  setDoc,
  deleteDoc,
  doc,
  query,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Briefcase,
  Building,
  X,
  Plus,
  MapPin,
  Clock,
  ChevronRight,
  Code,
  Banknote,
  Heart,
  FlaskConical,
  Palette,
  BookOpen,
  Edit3,
  Trash2,
  Globe,
  Zap,
  Bookmark,
  Share2,
  CheckCircle,
  TrendingUp,
  DollarSign,
  LayoutGrid,
  List,
} from "lucide-react";

const DOMAINS = [
  { value: "All", label: "All Domains", icon: Globe },
  { value: "Technology", label: "Technology", icon: Code },
  { value: "Finance", label: "Finance", icon: Banknote },
  { value: "Healthcare", label: "Healthcare", icon: Heart },
  { value: "Research", label: "Research", icon: FlaskConical },
  { value: "Education", label: "Education", icon: BookOpen },
  { value: "Design", label: "Design", icon: Palette },
];

const TYPES = [
  { value: "All", label: "All" },
  { value: "Job", label: "Full-time" },
  { value: "Internship", label: "Internship" },
  { value: "Hackathon", label: "Hackathon" },
  { value: "Fellowship", label: "Fellowship" },
  { value: "Scholarship", label: "Scholarship" },
];

export default function Mentorship() {
  const { user, role, loading: authLoading } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [viewMode, setViewMode] = useState("list");
  const [form, setForm] = useState({
    title: "",
    company: "",
    description: "",
    postedBy: "",
    contact: "",
    domain: "",
    type: "",
    category: "",
    date: "",
    location: "",
    salary: "",
    experience: "",
  });
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [domainFilter, setDomainFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [savedPosts, setSavedPosts] = useState([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    setLoading(true);
    try {
      const snap = await getDocs(query(collection(db, "internships")));
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setPosts(list);
      if (list.length > 0 && !selectedPost) {
        setSelectedPost(list[0]);
      }
    } catch (err) {
      console.error("Error fetching opportunities:", err);
      setError("Failed to fetch opportunities.");
    } finally {
      setLoading(false);
    }
  }

  const filtered = useMemo(() => {
    let data = [...posts];
    if (search.trim()) {
      const s = search.toLowerCase();
      data = data.filter((p) =>
        [p.title, p.company, p.description, p.domain, p.location]
          .filter(Boolean)
          .some((field) => field.toLowerCase().includes(s))
      );
    }
    if (domainFilter !== "All") {
      data = data.filter((p) => p.domain?.toLowerCase() === domainFilter.toLowerCase());
    }
    if (typeFilter !== "All") {
      data = data.filter((p) => p.type?.toLowerCase() === typeFilter.toLowerCase());
    }
    return data;
  }, [posts, search, domainFilter, typeFilter]);

  const stats = useMemo(() => ({
    total: posts.length,
    jobs: posts.filter((p) => p.type?.toLowerCase() === "job").length,
    internships: posts.filter((p) => p.type?.toLowerCase() === "internship").length,
    new: posts.filter((p) => {
      if (!p.createdAt) return false;
      const date = p.createdAt.toDate ? p.createdAt.toDate() : new Date(p.createdAt);
      return (new Date() - date) / (1000 * 60 * 60 * 24) < 7;
    }).length,
  }), [posts]);

  function handleFormChange(e) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  async function handleSavePost(e) {
    e.preventDefault();
    setError("");
    if (!user || (role !== "admin" && role !== "alumni")) {
      setError("Only admins and alumni can post opportunities.");
      return;
    }
    if (!form.title || !form.company || !form.description || !form.domain || !form.type) {
      setError("Please fill in all required fields.");
      return;
    }
    try {
      if (editingId) {
        await updateDoc(doc(db, "internships", editingId), form);
      } else {
        const id = Date.now().toString();
        await setDoc(doc(db, "internships", id), {
          ...form,
          createdBy: user.uid,
          createdAt: serverTimestamp(),
        });
      }
      await fetchPosts();
      setShowModal(false);
      resetForm();
    } catch (err) {
      setError("Failed to save opportunity.");
    }
  }

  async function handleDeletePost(id) {
    if (!window.confirm("Delete this opportunity?")) return;
    try {
      await deleteDoc(doc(db, "internships", id));
      if (selectedPost?.id === id) setSelectedPost(null);
      await fetchPosts();
    } catch (err) {
      setError("Failed to delete opportunity.");
    }
  }

  function resetForm() {
    setForm({ title: "", company: "", description: "", postedBy: "", contact: "", domain: "", type: "", category: "", date: "", location: "", salary: "", experience: "" });
    setEditingId(null);
  }

  function openEdit(post) {
    setForm(post);
    setEditingId(post.id);
    setShowModal(true);
  }

  const toggleSave = (id) => {
    setSavedPosts((prev) => prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]);
  };

  const getDomainIcon = (domain) => DOMAINS.find((d) => d.value.toLowerCase() === domain?.toLowerCase())?.icon || Globe;

  const formatDate = (timestamp) => {
    if (!timestamp) return "Recently";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const diff = Math.floor((new Date() - date) / (1000 * 60 * 60 * 24));
    if (diff === 0) return "Today";
    if (diff === 1) return "Yesterday";
    if (diff < 7) return `${diff}d ago`;
    if (diff < 30) return `${Math.floor(diff / 7)}w ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-base-200 flex flex-col items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p className="mt-4 text-base-content/60">Loading opportunities...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
          {/* Header */}
      <div className="bg-base-100 border-b border-base-300 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            {/* Title & Stats */}
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-base-content/10 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-base-content" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-base-content">Opportunities</h1>
                  <p className="text-xs text-base-content/50">{stats.total} openings • {stats.new} new this week</p>
                </div>
              </div>
            </div>

            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/40" />
                <input
                  type="text"
                  placeholder="Search jobs, companies..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="input input-bordered input-sm w-full pl-10 bg-base-200/50"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <div className="join border border-base-300 rounded-lg">
                <button onClick={() => setViewMode("list")} className={`btn btn-sm join-item border-0 ${viewMode === "list" ? "bg-base-content/10" : "bg-transparent"}`}>
                  <List className="w-4 h-4" />
                </button>
                <button onClick={() => setViewMode("grid")} className={`btn btn-sm join-item border-0 ${viewMode === "grid" ? "bg-base-content/10" : "bg-transparent"}`}>
                  <LayoutGrid className="w-4 h-4" />
                </button>
            </div>

            {(role === "admin" || role === "alumni") && (
                <button onClick={() => { resetForm(); setShowModal(true); }} className="btn btn-neutral btn-sm gap-2">
                  <Plus className="w-4 h-4" />
                  Post
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Left Sidebar - Filters */}
          <aside className="hidden lg:block w-56 shrink-0">
            <div className="sticky top-24 space-y-6">
              {/* Type Filter */}
              <div className="bg-base-100 rounded-xl p-4 border border-base-300">
                <h3 className="font-semibold text-sm text-base-content mb-3">Type</h3>
                <div className="space-y-1">
                  {TYPES.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setTypeFilter(type.value)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-sm transition-colors ${
                        typeFilter === type.value ? "bg-base-content/10 text-base-content font-medium" : "text-base-content/60 hover:bg-base-200"
                      }`}
                    >
                      {type.label}
                      {typeFilter === type.value && <CheckCircle className="w-4 h-4 text-base-content/70" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Domain Filter */}
              <div className="bg-base-100 rounded-xl p-4 border border-base-300">
                <h3 className="font-semibold text-sm text-base-content mb-3">Domain</h3>
                <div className="space-y-1">
                  {DOMAINS.map((domain) => {
                    const Icon = domain.icon;
                    return (
                      <button
                        key={domain.value}
                        onClick={() => setDomainFilter(domain.value)}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-sm transition-colors ${
                          domainFilter === domain.value ? "bg-base-content/10 text-base-content font-medium" : "text-base-content/60 hover:bg-base-200"
                        }`}
                      >
                        <Icon className="w-4 h-4 opacity-60" />
                        {domain.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-base-100 rounded-xl p-4 border border-base-300">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-4 h-4 text-base-content/60" />
                  <span className="text-sm font-semibold text-base-content">Overview</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-base-content/60">Full-time</span>
                    <span className="font-medium text-base-content">{stats.jobs}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-base-content/60">Internships</span>
                    <span className="font-medium text-base-content">{stats.internships}</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Mobile Filters */}
            <div className="lg:hidden flex gap-2 mb-4 overflow-x-auto pb-2">
              {TYPES.slice(0, 5).map((type) => (
                <button
                  key={type.value}
                  onClick={() => setTypeFilter(type.value)}
                  className={`btn btn-sm shrink-0 ${typeFilter === type.value ? "btn-neutral" : "btn-ghost"}`}
                >
                  {type.label}
                </button>
              ))}
            </div>

            {/* Results Info */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-base-content/60">
                <span className="font-semibold text-base-content">{filtered.length}</span> opportunities
              </p>
              {(search || domainFilter !== "All" || typeFilter !== "All") && (
                <button onClick={() => { setSearch(""); setDomainFilter("All"); setTypeFilter("All"); }} className="btn btn-ghost btn-xs gap-1">
                  <X className="w-3 h-3" />
                  Clear
              </button>
              )}
            </div>

            {filtered.length === 0 ? (
              <EmptyState onRefresh={fetchPosts} search={search} />
            ) : viewMode === "list" ? (
              <div className="grid lg:grid-cols-5 gap-6">
                {/* Job List */}
                <div className="lg:col-span-2 space-y-2">
                  {filtered.map((post, index) => (
                    <JobListItem
                      key={post.id}
                      post={post}
                      index={index}
                      isSelected={selectedPost?.id === post.id}
                      isSaved={savedPosts.includes(post.id)}
                      onSelect={() => setSelectedPost(post)}
                      onSave={() => toggleSave(post.id)}
                      formatDate={formatDate}
                    />
                  ))}
                        </div>

                {/* Job Details */}
                <div className="hidden lg:block lg:col-span-3">
                  {selectedPost ? (
                    <JobDetails
                      post={selectedPost}
                      isSaved={savedPosts.includes(selectedPost.id)}
                      onSave={() => toggleSave(selectedPost.id)}
                      onEdit={() => openEdit(selectedPost)}
                      onDelete={() => handleDeletePost(selectedPost.id)}
                      formatDate={formatDate}
                      getDomainIcon={getDomainIcon}
                      role={role}
                    />
                  ) : (
                    <div className="bg-base-100 rounded-2xl p-12 text-center border border-base-300">
                      <Briefcase className="w-12 h-12 text-base-content/20 mx-auto mb-3" />
                      <p className="text-base-content/60">Select a job to view details</p>
                        </div>
                  )}
                        </div>
                        </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((post, index) => (
                  <JobCard
                    key={post.id}
                    post={post}
                    index={index}
                    isSaved={savedPosts.includes(post.id)}
                    onSave={() => toggleSave(post.id)}
                    onSelect={() => setSelectedPost(post)}
                    onEdit={() => openEdit(post)}
                    onDelete={() => handleDeletePost(post.id)}
                    formatDate={formatDate}
                    getDomainIcon={getDomainIcon}
                    role={role}
                  />
                ))}
                          </div>
                        )}
                        </div>
                        </div>
                      </div>

      {/* Mobile Job Details Modal */}
      <AnimatePresence>
        {selectedPost && viewMode === "list" && (
          <div className="lg:hidden fixed inset-0 z-50 bg-base-100">
            <div className="h-full overflow-y-auto">
              <div className="sticky top-0 bg-base-100 border-b border-base-300 px-4 py-3 flex items-center justify-between z-10">
                <button onClick={() => setSelectedPost(null)} className="btn btn-ghost btn-sm gap-1">
                  <ChevronRight className="w-4 h-4 rotate-180" />
                  Back
                </button>
                <div className="flex gap-2">
                  <button onClick={() => toggleSave(selectedPost.id)} className={`btn btn-ghost btn-sm btn-square ${savedPosts.includes(selectedPost.id) ? "text-base-content" : "text-base-content/40"}`}>
                    <Bookmark className={`w-4 h-4 ${savedPosts.includes(selectedPost.id) ? "fill-current" : ""}`} />
                  </button>
                  <button className="btn btn-ghost btn-sm btn-square">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <JobDetails
                  post={selectedPost}
                  isSaved={savedPosts.includes(selectedPost.id)}
                  onSave={() => toggleSave(selectedPost.id)}
                  onEdit={() => openEdit(selectedPost)}
                  onDelete={() => handleDeletePost(selectedPost.id)}
                  formatDate={formatDate}
                  getDomainIcon={getDomainIcon}
                  role={role}
                  isMobile
                />
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <Modal
            form={form}
            editingId={editingId}
            error={error}
            onClose={() => setShowModal(false)}
            onChange={handleFormChange}
            onSubmit={handleSavePost}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Job List Item Component
function JobListItem({ post, index, isSelected, isSaved, onSelect, onSave, formatDate }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03 }}
      onClick={onSelect}
      className={`bg-base-100 rounded-xl p-4 cursor-pointer transition-all border ${
        isSelected ? "border-base-content/30 shadow-sm" : "border-base-300 hover:border-base-content/20"
      }`}
    >
      <div className="flex gap-3">
        <div className="w-11 h-11 rounded-lg bg-base-200 flex items-center justify-center shrink-0">
          <Building className="w-5 h-5 text-base-content/60" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-base-content line-clamp-1 text-sm">{post.title}</h3>
            <button
              onClick={(e) => { e.stopPropagation(); onSave(); }}
              className={`shrink-0 ${isSaved ? "text-base-content" : "text-base-content/30 hover:text-base-content/60"}`}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
            </button>
          </div>
          <p className="text-xs text-base-content/50 line-clamp-1">{post.company}</p>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className="text-xs px-2 py-0.5 rounded-full bg-base-200 text-base-content/70">{post.type}</span>
            {post.location && (
              <span className="text-xs text-base-content/40 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {post.location}
              </span>
            )}
          </div>
          <p className="text-xs text-base-content/40 mt-2">{formatDate(post.createdAt)}</p>
        </div>
      </div>
    </motion.div>
  );
}

// Job Card Component (Grid View)
function JobCard({ post, index, isSaved, onSave, onSelect, onEdit, onDelete, formatDate, getDomainIcon, role }) {
  const DomainIcon = getDomainIcon(post.domain);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className="bg-base-100 rounded-xl border border-base-300 overflow-hidden group hover:border-base-content/20 transition-all"
    >
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="w-11 h-11 rounded-lg bg-base-200 flex items-center justify-center">
            <DomainIcon className="w-5 h-5 text-base-content/60" />
          </div>
          <div className="flex items-center gap-1">
            <button onClick={onSave} className={`btn btn-ghost btn-xs btn-square ${isSaved ? "text-base-content" : "text-base-content/30"}`}>
              <Bookmark className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
            </button>
            {(role === "admin" || role === "alumni") && (
              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-ghost btn-xs btn-square text-base-content/50">⋯</label>
                <ul tabIndex={0} className="dropdown-content menu p-2 shadow-lg bg-base-100 rounded-lg w-28 border border-base-300 z-10">
                  <li><button onClick={onEdit} className="text-sm"><Edit3 className="w-3 h-3" />Edit</button></li>
                  <li><button onClick={onDelete} className="text-sm text-error"><Trash2 className="w-3 h-3" />Delete</button></li>
                </ul>
                        </div>
                      )}
          </div>
        </div>

        <h3 className="font-semibold text-base-content line-clamp-1 mb-1">{post.title}</h3>
        <p className="text-sm text-base-content/50 mb-3">{post.company}</p>

        <p className="text-sm text-base-content/40 line-clamp-2 mb-4 min-h-[2.5rem]">{post.description}</p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          <span className="text-xs px-2 py-0.5 rounded-full bg-base-200 text-base-content/70">{post.type}</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-base-200 text-base-content/70">{post.domain}</span>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-base-200">
          <span className="text-xs text-base-content/40">{formatDate(post.createdAt)}</span>
          <button onClick={onSelect} className="btn btn-ghost btn-sm gap-1 text-base-content/70 hover:text-base-content">
            View <ChevronRight className="w-4 h-4" />
          </button>
        </div>
                    </div>
                  </motion.div>
  );
}

// Job Details Component
function JobDetails({ post, isSaved, onSave, onEdit, onDelete, formatDate, getDomainIcon, role, isMobile }) {
  const DomainIcon = getDomainIcon(post.domain);

  return (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
      className={`bg-base-100 rounded-xl border border-base-300 overflow-hidden ${isMobile ? "" : "sticky top-24"}`}
    >
      {/* Header */}
      <div className="bg-base-200/50 p-6 border-b border-base-300">
        <div className="flex items-start justify-between mb-4">
          <span className="text-xs px-2.5 py-1 rounded-full bg-base-content/10 text-base-content/70 font-medium">{post.type}</span>
          {!isMobile && (
            <div className="flex gap-1">
              <button onClick={onSave} className={`btn btn-ghost btn-sm btn-square ${isSaved ? "text-base-content" : "text-base-content/40"}`}>
                <Bookmark className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
              </button>
              <button className="btn btn-ghost btn-sm btn-square text-base-content/40">
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
        <h2 className="text-xl font-bold text-base-content mb-2">{post.title}</h2>
        <p className="text-base-content/60 flex items-center gap-2">
          <Building className="w-4 h-4" />
          {post.company}
        </p>
                      </div>

      <div className="p-6">
        {/* Quick Info */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {post.location && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-base-200 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-base-content/40" />
              </div>
                        <div>
                <p className="text-xs text-base-content/40">Location</p>
                <p className="text-sm font-medium text-base-content">{post.location}</p>
              </div>
                        </div>
                      )}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-base-200 flex items-center justify-center">
              <DomainIcon className="w-5 h-5 text-base-content/40" />
            </div>
                      <div>
              <p className="text-xs text-base-content/40">Domain</p>
              <p className="text-sm font-medium text-base-content">{post.domain}</p>
                      </div>
                      </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-base-200 flex items-center justify-center">
              <Clock className="w-5 h-5 text-base-content/40" />
                      </div>
                      <div>
              <p className="text-xs text-base-content/40">Posted</p>
              <p className="text-sm font-medium text-base-content">{formatDate(post.createdAt)}</p>
                      </div>
                      </div>
          {post.salary && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-base-200 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-base-content/40" />
                      </div>
                      <div>
                <p className="text-xs text-base-content/40">Salary</p>
                <p className="text-sm font-medium text-base-content">{post.salary}</p>
                      </div>
            </div>
          )}
        </div>

        {/* Description */}
        <div className="mb-6">
          <h3 className="font-semibold text-base-content text-sm mb-3">About this opportunity</h3>
          <p className="text-base-content/60 text-sm leading-relaxed whitespace-pre-wrap">
            {post.description || "No description available."}
          </p>
                    </div>

        {/* Contact */}
        {(post.postedBy || post.contact) && (
          <div className="bg-base-200/50 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-sm text-base-content mb-2">Contact</h4>
            {post.postedBy && <p className="text-sm text-base-content/60">Posted by: {post.postedBy}</p>}
            {post.contact && (
              <a href={`mailto:${post.contact}`} className="text-sm text-base-content/80 hover:text-base-content hover:underline">
                {post.contact}
              </a>
            )}
                      </div>
                    )}

        {/* Actions */}
        <div className="flex gap-3">
          <button className="btn btn-neutral flex-1 gap-2">
            <Zap className="w-4 h-4" />
            Apply Now
          </button>
          {(role === "admin" || role === "alumni") && (
            <>
              <button onClick={onEdit} className="btn btn-ghost btn-square">
                <Edit3 className="w-4 h-4" />
              </button>
              <button onClick={onDelete} className="btn btn-ghost btn-square text-error/70 hover:text-error">
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
                    </div>
                  </div>
                </motion.div>
  );
}

// Empty State
function EmptyState({ onRefresh, search }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-base-100 rounded-xl p-12 text-center border border-base-300">
      <div className="w-16 h-16 rounded-full bg-base-200 flex items-center justify-center mx-auto mb-4">
        <Briefcase className="w-8 h-8 text-base-content/30" />
      </div>
      <h3 className="text-lg font-semibold text-base-content mb-2">No opportunities found</h3>
      <p className="text-base-content/50 mb-6 max-w-md mx-auto text-sm">
        {search ? `No results for "${search}"` : "Check back later for new opportunities!"}
      </p>
      <button onClick={onRefresh} className="btn btn-neutral btn-sm">Refresh</button>
              </motion.div>
  );
}

// Modal Component
function Modal({ form, editingId, error, onClose, onChange, onSubmit }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="modal modal-open">
      <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="modal-box max-w-xl max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3">
          <X className="w-4 h-4" />
        </button>
        <h3 className="font-bold text-lg mb-6">{editingId ? "Edit Opportunity" : "Post Opportunity"}</h3>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="form-control col-span-2">
              <label className="label"><span className="label-text text-sm">Title *</span></label>
              <input name="title" value={form.title} onChange={onChange} placeholder="e.g., Software Engineer" className="input input-bordered" required />
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text text-sm">Company *</span></label>
              <input name="company" value={form.company} onChange={onChange} placeholder="e.g., Google" className="input input-bordered" required />
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text text-sm">Location</span></label>
              <input name="location" value={form.location} onChange={onChange} placeholder="e.g., Remote" className="input input-bordered" />
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text text-sm">Type *</span></label>
              <select name="type" value={form.type} onChange={onChange} className="select select-bordered" required>
                <option value="">Select</option>
                <option value="Job">Full-time Job</option>
                <option value="Internship">Internship</option>
                <option value="Hackathon">Hackathon</option>
                <option value="Fellowship">Fellowship</option>
                <option value="Scholarship">Scholarship</option>
              </select>
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text text-sm">Domain *</span></label>
              <select name="domain" value={form.domain} onChange={onChange} className="select select-bordered" required>
                <option value="">Select</option>
                <option value="Technology">Technology</option>
                <option value="Finance">Finance</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Research">Research</option>
                <option value="Education">Education</option>
                <option value="Design">Design</option>
              </select>
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text text-sm">Contact Name</span></label>
              <input name="postedBy" value={form.postedBy} onChange={onChange} placeholder="e.g., John Doe" className="input input-bordered" />
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text text-sm">Contact Email</span></label>
              <input name="contact" value={form.contact} onChange={onChange} placeholder="e.g., hr@company.com" className="input input-bordered" />
            </div>
            <div className="form-control col-span-2">
              <label className="label"><span className="label-text text-sm">Description *</span></label>
              <textarea name="description" value={form.description} onChange={onChange} placeholder="Describe the role, requirements..." className="textarea textarea-bordered h-28" required />
        </div>
      </div>
          {error && <div className="alert alert-error text-sm py-2"><span>{error}</span></div>}
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-neutral">{editingId ? "Save" : "Post"}</button>
    </div>
        </form>
      </motion.div>
      <div className="modal-backdrop bg-base-content/20" onClick={onClose} />
    </motion.div>
  );
}
