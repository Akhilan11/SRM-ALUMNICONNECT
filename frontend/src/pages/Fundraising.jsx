// Fundraising.jsx - Creative Minimal Fundraising
import React, { useEffect, useState, useMemo, useRef } from "react";
import {
  collection,
  getDocs,
  setDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Plus,
  X,
  Target,
  Users,
  Calendar,
  Heart,
  ChevronRight,
  Clock,
  Search,
  Edit3,
  Trash2,
  IndianRupee,
  Award,
  Gift,
  MoreHorizontal,
  TrendingUp,
  CheckCircle,
  ArrowUp,
  Sparkles,
  LayoutGrid,
  List,
} from "lucide-react";

// Animated Counter Component
function AnimatedCounter({ value, prefix = "", suffix = "", duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const end = parseFloat(value) || 0;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      const current = start + eased * (end - start);
      setCount(current);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [value, duration, isInView]);

  const formatted = count >= 1000 
    ? `${(count / 1000).toFixed(count >= 10000 ? 0 : 1)}k`
    : Math.round(count).toLocaleString();

  return <span ref={ref}>{prefix}{formatted}{suffix}</span>;
}

// Semi-circular Progress Gauge
function ProgressGauge({ progress, raised, goal, formatCurrency }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const timer = setTimeout(() => setAnimatedProgress(progress), 100);
    return () => clearTimeout(timer);
  }, [progress, isInView]);

  const radius = 80;
  const circumference = Math.PI * radius;
  const offset = circumference - (animatedProgress / 100) * circumference;

  return (
    <div ref={ref} className="relative flex flex-col items-center">
      <svg width="200" height="110" className="overflow-visible">
        {/* Background Arc */}
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="12"
          strokeLinecap="round"
          className="text-base-300"
        />
        {/* Progress Arc */}
        <motion.path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="text-base-content"
        />
        {/* Center Text */}
        <text x="100" y="75" textAnchor="middle" className="fill-base-content text-3xl font-bold">
          {Math.round(animatedProgress)}%
        </text>
        <text x="100" y="95" textAnchor="middle" className="fill-base-content/50 text-xs">
          funded
        </text>
      </svg>
      
      {/* Labels below gauge */}
      <div className="flex justify-between w-full mt-2 px-2">
        <div className="text-center">
          <p className="text-lg font-bold text-base-content">{formatCurrency(raised)}</p>
          <p className="text-xs text-base-content/40">raised</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-base-content/50">{formatCurrency(goal)}</p>
          <p className="text-xs text-base-content/40">goal</p>
        </div>
      </div>
    </div>
  );
}

export default function Fundraising() {
  const { role, user } = useAuth();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [form, setForm] = useState({});
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");

  useEffect(() => {
    fetchCampaigns();
  }, []);

  async function fetchCampaigns() {
    setLoading(true);
    try {
      const snap = await getDocs(query(collection(db, "fundraising")));
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setCampaigns(list);
    } catch (err) {
      console.error("Error fetching campaigns:", err);
      setError("Failed to fetch campaigns.");
    } finally {
      setLoading(false);
    }
  }

  function handleFormChange(e) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  async function handleSaveCampaign(e) {
    e.preventDefault();
    setError("");
    if (!user || role !== "admin") {
      setError("Only admins can manage campaigns.");
      return;
    }
    if (!form.title || !form.goal || !form.deadline) {
      setError("Title, Goal, and Deadline are required.");
      return;
    }
    try {
      if (editingCampaign) {
        await updateDoc(doc(db, "fundraising", editingCampaign.id), form);
      } else {
        const id = Date.now().toString();
        await setDoc(doc(db, "fundraising", id), {
          ...form,
          raised: 0,
          donors: 0,
          createdAt: new Date().toISOString(),
          createdBy: user.uid,
        });
      }
      await fetchCampaigns();
      setShowModal(false);
      setForm({});
      setEditingCampaign(null);
    } catch (err) {
      setError("Failed to save campaign.");
    }
  }

  async function handleDeleteCampaign(id) {
    if (!window.confirm("Delete this campaign?")) return;
    try {
      await deleteDoc(doc(db, "fundraising", id));
      await fetchCampaigns();
    } catch (err) {
      setError("Failed to delete campaign.");
    }
  }

  const formatCurrency = (amount) => {
    if (!amount) return "₹0";
    const num = parseFloat(amount);
    if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
    if (num >= 1000) return `₹${(num / 1000).toFixed(1)}k`;
    return `₹${num.toLocaleString("en-IN")}`;
  };

  const formatCurrencyFull = (amount) => {
    if (!amount) return "₹0";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const calculateProgress = (raised, goal) => {
    if (!raised || !goal) return 0;
    return Math.min(100, (raised / goal) * 100);
  };

  const getDaysLeft = (deadline) => {
    if (!deadline) return null;
    const days = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  const stats = useMemo(() => {
    const totalRaised = campaigns.reduce((sum, c) => sum + (parseFloat(c.raised) || 0), 0);
    const totalGoal = campaigns.reduce((sum, c) => sum + (parseFloat(c.goal) || 0), 0);
    const totalDonors = campaigns.reduce((sum, c) => sum + (parseInt(c.donors) || 0), 0);
    
    // Active = not ended AND not fully funded
    const activeCampaigns = campaigns.filter((c) => {
      const daysLeft = getDaysLeft(c.deadline);
      const progress = calculateProgress(c.raised, c.goal);
      return (daysLeft === null || daysLeft > 0) && progress < 100;
    }).length;
    
    // Completed = fully funded
    const completedCampaigns = campaigns.filter((c) => calculateProgress(c.raised, c.goal) >= 100).length;
    
    const overallProgress = totalGoal > 0 ? (totalRaised / totalGoal) * 100 : 0;
    return { totalRaised, totalGoal, totalDonors, activeCampaigns, completedCampaigns, overallProgress, total: campaigns.length };
  }, [campaigns]);

  const filteredCampaigns = useMemo(() => {
    let filtered = [...campaigns];
    
    if (filter === "active") {
      // Active = deadline not passed AND not fully funded
      filtered = filtered.filter((c) => {
        const daysLeft = getDaysLeft(c.deadline);
        const progress = calculateProgress(c.raised, c.goal);
        return (daysLeft === null || daysLeft > 0) && progress < 100;
      });
    } else if (filter === "completed") {
      // Completed = fully funded (100% or more)
      filtered = filtered.filter((c) => {
        const progress = calculateProgress(c.raised, c.goal);
        return progress >= 100;
      });
    } else if (filter === "ending") {
      // Ending Soon = within 7 days AND not completed
      filtered = filtered.filter((c) => {
        const daysLeft = getDaysLeft(c.deadline);
        const progress = calculateProgress(c.raised, c.goal);
        return daysLeft !== null && daysLeft > 0 && daysLeft <= 7 && progress < 100;
      });
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((c) =>
        c.title?.toLowerCase().includes(query) ||
        c.purpose?.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [campaigns, filter, searchQuery]);

  const featuredCampaign = useMemo(() => {
    return campaigns.find((c) => getDaysLeft(c.deadline) > 0 && calculateProgress(c.raised, c.goal) < 100);
  }, [campaigns]);

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex flex-col items-center justify-center">
        <span className="loading loading-spinner loading-lg text-base-content/30"></span>
        <p className="mt-4 text-base-content/50">Loading campaigns...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="alert mb-6 bg-base-100 border border-base-300"
            >
              <span className="text-base-content/70">{error}</span>
              <button onClick={() => setError("")} className="btn btn-sm btn-ghost">
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8"
        >
          <div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-base-content/10 text-base-content/60 font-medium mb-3 inline-block">
              Support Our Community
            </span>
            <h1 className="text-3xl lg:text-4xl font-bold text-base-content mb-2">Fundraising</h1>
            <p className="text-base-content/50 max-w-lg">
              Join hands with fellow alumni to make a difference. Every contribution counts.
            </p>
          </div>
          {role === "admin" && (
            <button
              onClick={() => { setEditingCampaign(null); setForm({}); setShowModal(true); }}
              className="btn btn-neutral gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Campaign
            </button>
          )}
        </motion.div>

        {/* Creative Stats Bento Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-12 gap-4 mb-8"
        >
          {/* Main Progress Card - Large */}
          <div className="col-span-12 lg:col-span-5 bg-base-100 rounded-2xl border border-base-300 p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-medium text-base-content/50 uppercase tracking-wider">Overall Progress</span>
              <span className="text-xs px-2 py-1 rounded-full bg-base-200 text-base-content/60">
                {stats.activeCampaigns} active
              </span>
            </div>
            <ProgressGauge 
              progress={stats.overallProgress} 
              raised={stats.totalRaised}
              goal={stats.totalGoal}
              formatCurrency={formatCurrency}
            />
          </div>

          {/* Right Column - Stacked Cards */}
          <div className="col-span-12 lg:col-span-7 grid grid-cols-2 gap-4">
            {/* Total Raised - Featured */}
            <div className="col-span-2 bg-base-100 rounded-2xl border border-base-300 p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-base-content/[0.02] rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-3">
                  <IndianRupee className="w-4 h-4 text-base-content/40" />
                  <span className="text-xs font-medium text-base-content/50 uppercase tracking-wider">Total Raised</span>
                </div>
                <div className="flex items-end gap-3">
                  <p className="text-4xl font-bold text-base-content">
                    <AnimatedCounter value={stats.totalRaised} prefix="₹" />
                  </p>
                  {stats.overallProgress > 0 && (
                    <span className="text-xs px-2 py-1 rounded-full bg-base-content/10 text-base-content/70 flex items-center gap-1 mb-1">
                      <ArrowUp className="w-3 h-3" />
                      {stats.overallProgress.toFixed(0)}%
                    </span>
                  )}
                </div>
                {/* Visual Bar */}
                <div className="mt-4 h-2 bg-base-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${stats.overallProgress}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-base-content/80 rounded-full"
                  />
                </div>
                <p className="text-xs text-base-content/40 mt-2">Goal: {formatCurrencyFull(stats.totalGoal)}</p>
              </div>
            </div>

            {/* Campaigns Count */}
            <div className="bg-base-100 rounded-2xl border border-base-300 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-4 h-4 text-base-content/40" />
                <span className="text-xs font-medium text-base-content/50 uppercase tracking-wider">Campaigns</span>
              </div>
              <p className="text-3xl font-bold text-base-content mb-2">
                <AnimatedCounter value={stats.total} />
              </p>
              {/* Mini breakdown */}
              <div className="flex gap-3 text-xs">
                <span className="flex items-center gap-1 text-base-content/60">
                  <span className="w-2 h-2 rounded-full bg-base-content/60"></span>
                  {stats.activeCampaigns} active
                </span>
                <span className="flex items-center gap-1 text-base-content/40">
                  <span className="w-2 h-2 rounded-full bg-base-content/30"></span>
                  {stats.completedCampaigns} done
                </span>
              </div>
            </div>

            {/* Donors Count */}
            <div className="bg-base-100 rounded-2xl border border-base-300 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-4 h-4 text-base-content/40" />
                <span className="text-xs font-medium text-base-content/50 uppercase tracking-wider">Supporters</span>
              </div>
              <p className="text-3xl font-bold text-base-content mb-2">
                <AnimatedCounter value={stats.totalDonors} />
              </p>
              {/* Avatars placeholder */}
              <div className="flex -space-x-2">
                {[...Array(Math.min(5, stats.totalDonors || 3))].map((_, i) => (
                  <div key={i} className="w-6 h-6 rounded-full bg-base-300 border-2 border-base-100 flex items-center justify-center">
                    <span className="text-[8px] text-base-content/50">{String.fromCharCode(65 + i)}</span>
                  </div>
                ))}
                {stats.totalDonors > 5 && (
                  <div className="w-6 h-6 rounded-full bg-base-200 border-2 border-base-100 flex items-center justify-center">
                    <span className="text-[8px] text-base-content/50">+{stats.totalDonors - 5}</span>
                  </div>
                )}
              </div>
            </div>
            </div>
          </motion.div>

        {/* Featured Campaign */}
        {featuredCampaign && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-base-content/40" />
              <span className="text-sm font-medium text-base-content/60">Featured Campaign</span>
            </div>
            <div className="bg-base-100 rounded-2xl border border-base-300 p-6 lg:p-8">
              <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-base-content mb-2">{featuredCampaign.title}</h2>
                  <p className="text-base-content/50 mb-4 line-clamp-2">{featuredCampaign.purpose}</p>
                  
                  <div className="flex items-center gap-4 mb-4">
                    <div>
                      <p className="text-xl font-bold text-base-content">{formatCurrencyFull(featuredCampaign.raised || 0)}</p>
                      <p className="text-xs text-base-content/40">of {formatCurrencyFull(featuredCampaign.goal)}</p>
                    </div>
                    <div className="w-px h-10 bg-base-300" />
                    <div>
                      <p className="text-xl font-bold text-base-content">{getDaysLeft(featuredCampaign.deadline)}</p>
                      <p className="text-xs text-base-content/40">days left</p>
                            </div>
                    <div className="w-px h-10 bg-base-300" />
                    <div>
                      <p className="text-xl font-bold text-base-content">{featuredCampaign.donors || 0}</p>
                      <p className="text-xs text-base-content/40">donors</p>
                            </div>
                            </div>

                  {/* Progress */}
                  <div className="mb-4">
                    <div className="h-2 bg-base-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${calculateProgress(featuredCampaign.raised, featuredCampaign.goal)}%` }}
                        transition={{ duration: 1 }}
                        className="h-full bg-base-content/80 rounded-full"
                                />
                              </div>
                  </div>

                  <Link to={`/payments?campaignId=${featuredCampaign.id}`} className="btn btn-neutral gap-2">
                    <Gift className="w-4 h-4" />
                    Donate Now
                  </Link>
                </div>

                {/* Visual Element */}
                <div className="hidden lg:flex items-center justify-center w-48 h-48 rounded-2xl bg-base-200/50">
                  <div className="text-center">
                    <p className="text-5xl font-bold text-base-content">
                      {Math.round(calculateProgress(featuredCampaign.raised, featuredCampaign.goal))}%
                    </p>
                    <p className="text-sm text-base-content/40 mt-1">funded</p>
                  </div>
                </div>
                            </div>
            </div>
          </motion.div>
        )}

{/* Search, Filters & View Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-base-100 rounded-xl border border-base-300 p-4 mb-6"
        >
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/40" />
              <input
                type="text"
                placeholder="Search campaigns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input input-bordered w-full pl-10 bg-base-200/50 h-10"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-1">
              {["all", "active", "ending", "completed"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`btn btn-sm capitalize h-10 ${
                    filter === f ? "bg-base-content/10 text-base-content" : "btn-ghost text-base-content/60"
                  }`}
                >
                  {f === "ending" ? "Ending Soon" : f}
                </button>
              ))}
            </div>

            {/* View Toggle */}
            <div className="join border border-base-300 rounded-lg h-10">
              <button
                onClick={() => setViewMode("grid")}
                className={`btn btn-sm join-item border-0 h-10 min-h-0 ${viewMode === "grid" ? "bg-base-content/10" : "bg-transparent"}`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`btn btn-sm join-item border-0 h-10 min-h-0 ${viewMode === "list" ? "bg-base-content/10" : "bg-transparent"}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Results count */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-base-200">
            <p className="text-sm text-base-content/50">
              <span className="font-medium text-base-content">{filteredCampaigns.length}</span> of {campaigns.length} campaigns
            </p>
            {(searchQuery || filter !== "all") && (
              <button
                onClick={() => { setSearchQuery(""); setFilter("all"); }}
                className="btn btn-ghost btn-xs gap-1"
              >
                <X className="w-3 h-3" />
                Clear
              </button>
            )}
            </div>
          </motion.div>

        {/* Campaigns Grid */}
        {filteredCampaigns.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            className="bg-base-100 rounded-xl p-12 text-center border border-base-300"
          >
            <div className="w-16 h-16 rounded-full bg-base-200 flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-base-content/30" />
            </div>
            <h3 className="text-lg font-semibold text-base-content mb-2">No campaigns found</h3>
            <p className="text-base-content/50 mb-6 text-sm">
              {searchQuery ? `No results for "${searchQuery}"` : "Be the first to create a campaign!"}
              </p>
              {role === "admin" && (
                <button 
                  onClick={() => { setEditingCampaign(null); setForm({}); setShowModal(true); }}
                className="btn btn-neutral btn-sm"
                >
                Create Campaign
                </button>
              )}
            </motion.div>
        ) : viewMode === "grid" ? (
          /* Grid View */
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {filteredCampaigns.map((campaign, index) => (
                <CampaignCard
                  key={campaign.id}
                  campaign={campaign}
                  index={index}
                  role={role}
                  formatCurrencyFull={formatCurrencyFull}
                  calculateProgress={calculateProgress}
                  getDaysLeft={getDaysLeft}
                  onEdit={() => { setEditingCampaign(campaign); setForm(campaign); setShowModal(true); }}
                  onDelete={() => handleDeleteCampaign(campaign.id)}
                />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          /* List View */
          <div className="space-y-3">
            <AnimatePresence>
              {filteredCampaigns.map((campaign, index) => (
                <CampaignListItem
                  key={campaign.id}
                  campaign={campaign}
                  index={index}
                  role={role}
                  formatCurrencyFull={formatCurrencyFull}
                  calculateProgress={calculateProgress}
                  getDaysLeft={getDaysLeft}
                  onEdit={() => { setEditingCampaign(campaign); setForm(campaign); setShowModal(true); }}
                  onDelete={() => handleDeleteCampaign(campaign.id)}
                />
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Modal */}
          <AnimatePresence>
            {showModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              className="modal modal-open"
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="modal-box max-w-lg"
              >
                <button
                  onClick={() => setShowModal(false)}
                  className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3"
                >
                  <X className="w-4 h-4" />
                </button>

                <h3 className="font-bold text-lg mb-6">
                  {editingCampaign ? "Edit Campaign" : "Create Campaign"}
                </h3>

                <form onSubmit={handleSaveCampaign} className="space-y-4">
                  <div className="form-control">
                    <label className="label"><span className="label-text text-sm">Title *</span></label>
                        <input
                          name="title"
                          value={form.title || ""}
                      placeholder="e.g., Scholarship Fund 2024"
                          onChange={handleFormChange}
                      className="input input-bordered"
                          required
                        />
                      </div>

                  <div className="form-control">
                    <label className="label"><span className="label-text text-sm">Purpose</span></label>
                    <textarea
                          name="purpose"
                          value={form.purpose || ""}
                      placeholder="Describe what this campaign is for..."
                          onChange={handleFormChange}
                      className="textarea textarea-bordered h-24"
                        />
                      </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="form-control">
                      <label className="label"><span className="label-text text-sm">Goal *</span></label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40">₹</span>
                        <input
                          name="goal"
                          value={form.goal || ""}
                          placeholder="100000"
                          onChange={handleFormChange}
                          className="input input-bordered w-full pl-8"
                          type="number"
                          required
                        />
                      </div>
                    </div>
                    <div className="form-control">
                      <label className="label"><span className="label-text text-sm">Raised</span></label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40">₹</span>
                        <input
                          name="raised"
                          value={form.raised || ""}
                          placeholder="0"
                          onChange={handleFormChange}
                          className="input input-bordered w-full pl-8"
                          type="number"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="form-control">
                      <label className="label"><span className="label-text text-sm">Deadline *</span></label>
                        <input
                          type="date"
                          name="deadline"
                          value={form.deadline || ""}
                          onChange={handleFormChange}
                        className="input input-bordered"
                          required
                        />
                      </div>
                    <div className="form-control">
                      <label className="label"><span className="label-text text-sm">Donors</span></label>
                      <input
                        name="donors"
                        value={form.donors || ""}
                        placeholder="0"
                        onChange={handleFormChange}
                        className="input input-bordered"
                        type="number"
                        />
                      </div>
                    </div>

                    {error && (
                    <div className="text-sm text-error bg-base-200 rounded-lg p-3">{error}</div>
                  )}

                  <div className="flex justify-end gap-3 pt-4">
                    <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                    <button type="submit" className="btn btn-neutral">{editingCampaign ? "Save" : "Create"}</button>
                  </div>
                </form>
                </motion.div>
              <div className="modal-backdrop bg-base-content/20" onClick={() => setShowModal(false)} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
  );
}

// Campaign Card Component (Grid View)
function CampaignCard({ campaign, index, role, formatCurrencyFull, calculateProgress, getDaysLeft, onEdit, onDelete }) {
  const progress = calculateProgress(campaign.raised, campaign.goal);
  const daysLeft = getDaysLeft(campaign.deadline);
  const isCompleted = progress >= 100;
  const isEnding = daysLeft > 0 && daysLeft <= 7;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.03 }}
      className="bg-base-100 rounded-xl border border-base-300 overflow-hidden group hover:border-base-content/20 transition-all"
    >
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            {isCompleted && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-base-200 text-base-content/60 inline-flex items-center gap-1 mb-2">
                <Award className="w-3 h-3" />
                Completed
              </span>
            )}
            {isEnding && !isCompleted && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-base-200 text-base-content/60 inline-flex items-center gap-1 mb-2">
                <Clock className="w-3 h-3" />
                Ending Soon
              </span>
            )}
            <h3 className="font-semibold text-base-content line-clamp-1">{campaign.title}</h3>
          </div>

          {role === "admin" && (
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-xs btn-square text-base-content/40">
                <MoreHorizontal className="w-4 h-4" />
              </label>
              <ul tabIndex={0} className="dropdown-content menu p-2 shadow-lg bg-base-100 rounded-lg w-28 border border-base-300 z-10">
                <li><button onClick={onEdit} className="text-sm"><Edit3 className="w-3 h-3" />Edit</button></li>
                <li><button onClick={onDelete} className="text-sm text-error"><Trash2 className="w-3 h-3" />Delete</button></li>
              </ul>
            </div>
          )}
        </div>

        {/* Purpose */}
        <p className="text-sm text-base-content/50 line-clamp-2 mb-4 min-h-[2.5rem]">
          {campaign.purpose || "Support this campaign."}
        </p>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium text-base-content">{formatCurrencyFull(campaign.raised || 0)}</span>
            <span className="text-base-content/40">{formatCurrencyFull(campaign.goal)}</span>
          </div>
          <div className="h-1.5 bg-base-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, delay: index * 0.05 }}
              className="h-full bg-base-content/70 rounded-full"
            />
          </div>
          <div className="flex justify-between text-xs text-base-content/40 mt-1.5">
            <span>{progress.toFixed(0)}% funded</span>
            <span>{campaign.donors || 0} donors</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-base-200">
          <div className="flex items-center gap-1.5 text-xs text-base-content/40">
            <Calendar className="w-3.5 h-3.5" />
            {daysLeft !== null ? (daysLeft > 0 ? `${daysLeft} days left` : "Ended") : "No deadline"}
          </div>
          <Link
            to={`/payments?campaignId=${campaign.id}`}
            className="btn btn-ghost btn-sm gap-1 text-base-content/70 hover:text-base-content"
          >
            Donate <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

// Campaign List Item Component (List View)
function CampaignListItem({ campaign, index, role, formatCurrencyFull, calculateProgress, getDaysLeft, onEdit, onDelete }) {
  const progress = calculateProgress(campaign.raised, campaign.goal);
  const daysLeft = getDaysLeft(campaign.deadline);
  const isCompleted = progress >= 100;
  const isEnding = daysLeft > 0 && daysLeft <= 7;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.03 }}
      className="bg-base-100 rounded-xl border border-base-300 p-4 hover:border-base-content/20 transition-all"
    >
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        {/* Left - Progress Circle */}
        <div className="flex items-center gap-4 lg:w-48 shrink-0">
          <div className="relative w-14 h-14 shrink-0">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="4" fill="none" className="text-base-300" />
              <circle
                cx="28"
                cy="28"
                r="24"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                strokeDasharray={151}
                strokeDashoffset={151 - (151 * progress) / 100}
                strokeLinecap="round"
                className="text-base-content transition-all duration-500"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold text-base-content">{Math.round(progress)}%</span>
            </div>
          </div>
          <div className="hidden lg:block">
            <p className="text-sm font-medium text-base-content">{formatCurrencyFull(campaign.raised || 0)}</p>
            <p className="text-xs text-base-content/40">of {formatCurrencyFull(campaign.goal)}</p>
          </div>
        </div>

        {/* Center - Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-base-content truncate">{campaign.title}</h3>
            {isCompleted && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-base-200 text-base-content/60 shrink-0">Completed</span>
            )}
            {isEnding && !isCompleted && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-base-200 text-base-content/60 shrink-0">Ending Soon</span>
            )}
          </div>
          <p className="text-sm text-base-content/50 line-clamp-1">{campaign.purpose || "Support this campaign."}</p>
          
          {/* Mobile stats */}
          <div className="flex items-center gap-4 mt-2 lg:hidden text-xs text-base-content/50">
            <span>{formatCurrencyFull(campaign.raised || 0)} raised</span>
            <span>{campaign.donors || 0} donors</span>
          </div>
        </div>

        {/* Right - Meta & Actions */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden lg:flex items-center gap-4 text-sm text-base-content/50">
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4" />
              {campaign.donors || 0}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {daysLeft !== null ? (daysLeft > 0 ? `${daysLeft}d` : "Ended") : "—"}
            </span>
          </div>

          <Link
            to={`/payments?campaignId=${campaign.id}`}
            className="btn btn-neutral btn-sm gap-1"
          >
            Donate
          </Link>

          {role === "admin" && (
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-sm btn-square text-base-content/40">
                <MoreHorizontal className="w-4 h-4" />
              </label>
              <ul tabIndex={0} className="dropdown-content menu p-2 shadow-lg bg-base-100 rounded-lg w-28 border border-base-300 z-10">
                <li><button onClick={onEdit} className="text-sm"><Edit3 className="w-3 h-3" />Edit</button></li>
                <li><button onClick={onDelete} className="text-sm text-error"><Trash2 className="w-3 h-3" />Delete</button></li>
              </ul>
            </div>
          )}
        </div>
    </div>
    </motion.div>
  );
}

