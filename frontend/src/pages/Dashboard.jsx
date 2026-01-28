// Dashboard.jsx - Clean Minimal Dashboard
import React, { useEffect, useState, useMemo } from "react";
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  getCountFromServer,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Calendar,
  Users,
  Bell,
  Clock,
  MapPin,
  Building,
  Briefcase,
  ChevronRight,
  Heart,
  MessageCircle,
  Sun,
  Moon,
  CloudSun,
  ArrowUpRight,
  TrendingUp,
  Target,
  Sparkles,
} from "lucide-react";

export default function Dashboard() {
  const { user, role } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalCampaigns: 0,
    totalOpportunities: 0,
    totalAnnouncements: 0,
    totalDonations: 0,
  });
  const [recentData, setRecentData] = useState({
    events: [],
    fundraising: [],
    announcements: [],
    opportunities: [],
  });

  useEffect(() => {
    if (user && (role === "student" || role === "alumni" || role === "admin")) {
      fetchDashboardData();
    }
  }, [user, role]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [eventsCount, campaignsCount, opportunitiesCount, announcementsCount] = await Promise.all([
        getCountFromServer(collection(db, "events")),
        getCountFromServer(collection(db, "fundraising")),
        getCountFromServer(collection(db, "internships")),
        getCountFromServer(collection(db, "notifications")),
      ]);

      const [eventsSnapshot, fundraisingSnapshot, announcementsSnapshot, opportunitiesSnapshot] = await Promise.all([
        getDocs(query(collection(db, "events"), orderBy("date", "desc"), limit(5))),
        getDocs(query(collection(db, "fundraising"), orderBy("createdAt", "desc"), limit(5))),
        getDocs(query(collection(db, "notifications"), orderBy("createdAt", "desc"), limit(5))),
        getDocs(query(collection(db, "internships"), orderBy("createdAt", "desc"), limit(5))),
      ]);

      const events = eventsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const fundraising = fundraisingSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const announcements = announcementsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const opportunities = opportunitiesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const totalDonations = fundraising.reduce((sum, c) => sum + (parseFloat(c.raised || 0)), 0);

      setStats({
        totalEvents: eventsCount.data().count,
        totalCampaigns: campaignsCount.data().count,
        totalOpportunities: opportunitiesCount.data().count,
        totalAnnouncements: announcementsCount.data().count,
        totalDonations,
      });
      setRecentData({ events, fundraising, announcements, opportunities });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: "Good morning", icon: Sun };
    if (hour < 17) return { text: "Good afternoon", icon: CloudSun };
    return { text: "Good evening", icon: Moon };
  };

  const formatDate = (dateString) => {
    if (!dateString) return "TBA";
    return new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getTimeAgo = (timestamp) => {
    if (!timestamp) return "Recently";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const diffHours = Math.floor((new Date() - date) / (1000 * 60 * 60));
    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffHours < 168) return `${Math.floor(diffHours / 24)}d ago`;
    return formatDate(timestamp);
  };

  const greeting = getGreeting();
  const GreetingIcon = greeting.icon;

  if (!user || (role !== "student" && role !== "alumni" && role !== "admin")) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
        <div className="bg-base-100 rounded-2xl border border-base-300 p-8 text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-base-200 flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-base-content/30" />
          </div>
          <h2 className="text-xl font-bold text-base-content mb-2">Access Denied</h2>
          <p className="text-base-content/50">This page is for registered members only.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex flex-col items-center justify-center">
        <span className="loading loading-spinner loading-lg text-base-content/30"></span>
        <p className="mt-4 text-base-content/50">Loading dashboard...</p>
      </div>
    );
  }

  const quickStats = [
    { label: "Events", value: stats.totalEvents, icon: Calendar, href: "/events" },
    { label: "Opportunities", value: stats.totalOpportunities, icon: Briefcase, href: "/opportunities" },
    { label: "Campaigns", value: stats.totalCampaigns, icon: Heart, href: "/fundraising" },
    { label: "Announcements", value: stats.totalAnnouncements, icon: Bell, href: "/announcements" },
  ];

  return (
    <div className="min-h-screen bg-base-200">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-base-100 rounded-2xl border border-base-300 p-6 lg:p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 text-base-content/50 text-sm mb-2">
                  <GreetingIcon className="w-4 h-4" />
                  <span>{greeting.text}</span>
                </div>
                <h1 className="text-2xl lg:text-3xl font-bold text-base-content mb-1">
                  Welcome back, {user.displayName?.split(" ")[0] || "User"}
                </h1>
                <p className="text-base-content/50">
                  Here's what's happening in your alumni network today.
                </p>
              </div>
              <div className="flex gap-3">
                <Link to="/events" className="btn btn-ghost gap-2">
                  <Calendar className="w-4 h-4" />
                  Events
                </Link>
                <Link to="/chat" className="btn btn-neutral gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Chat
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {quickStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  to={stat.href}
                  className="block bg-base-100 rounded-xl border border-base-300 p-5 hover:border-base-content/20 transition-all group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-base-200 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-base-content/50" />
                    </div>
                    <ChevronRight className="w-4 h-4 text-base-content/20 group-hover:text-base-content/50 group-hover:translate-x-1 transition-all" />
                  </div>
                  <p className="text-2xl font-bold text-base-content">{stat.value}</p>
                  <p className="text-sm text-base-content/50">{stat.label}</p>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Upcoming Events */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-base-100 rounded-xl border border-base-300 overflow-hidden"
            >
              <div className="p-5 border-b border-base-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-base-200 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-base-content/50" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-base-content">Upcoming Events</h2>
                    <p className="text-xs text-base-content/40">Don't miss out</p>
                  </div>
                </div>
                <Link to="/events" className="btn btn-ghost btn-sm gap-1 text-base-content/60">
                  View all <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="divide-y divide-base-200">
                {recentData.events.length > 0 ? (
                  recentData.events.slice(0, 4).map((event, index) => (
                    <Link
                      key={event.id}
                      to={`/events/${event.id}`}
                      className="flex items-center gap-4 p-4 hover:bg-base-50 transition-colors group"
                    >
                      <div className="w-12 h-12 rounded-lg bg-base-200 flex flex-col items-center justify-center shrink-0">
                        <span className="text-[10px] text-base-content/50 uppercase">
                          {new Date(event.date).toLocaleDateString("en-US", { month: "short" })}
                        </span>
                        <span className="text-lg font-bold text-base-content leading-none">
                          {new Date(event.date).getDate()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-base-content truncate group-hover:text-base-content/80">
                          {event.title}
                        </h3>
                        <div className="flex items-center gap-3 text-xs text-base-content/40 mt-1">
                          {event.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {event.location}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {event.time || "TBA"}
                          </span>
                        </div>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-base-content/20 group-hover:text-base-content/50" />
                    </Link>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <Calendar className="w-10 h-10 text-base-content/20 mx-auto mb-2" />
                    <p className="text-sm text-base-content/50">No upcoming events</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Job Opportunities */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-base-100 rounded-xl border border-base-300 overflow-hidden"
            >
              <div className="p-5 border-b border-base-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-base-200 flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-base-content/50" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-base-content">Opportunities</h2>
                    <p className="text-xs text-base-content/40">Latest openings</p>
                  </div>
                </div>
                <Link to="/opportunities" className="btn btn-ghost btn-sm gap-1 text-base-content/60">
                  View all <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="divide-y divide-base-200">
                {recentData.opportunities.length > 0 ? (
                  recentData.opportunities.slice(0, 3).map((job) => (
                    <div key={job.id} className="p-4 hover:bg-base-50 transition-colors group cursor-pointer">
                      <div className="flex items-start gap-4">
                        <div className="w-11 h-11 rounded-lg bg-base-200 flex items-center justify-center shrink-0">
                          <Building className="w-5 h-5 text-base-content/40" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-base-content">{job.title}</h3>
                          <p className="text-sm text-base-content/50">{job.company}</p>
                          <div className="flex items-center gap-3 text-xs text-base-content/40 mt-1">
                            {job.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {job.location}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {getTimeAgo(job.createdAt)}
                            </span>
                          </div>
                        </div>
                        <span className="text-xs px-2 py-1 rounded-full bg-base-200 text-base-content/60">
                          {job.type || "Full-time"}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <Briefcase className="w-10 h-10 text-base-content/20 mx-auto mb-2" />
                    <p className="text-sm text-base-content/50">No opportunities available</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Fundraising */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-base-100 rounded-xl border border-base-300 p-5"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-lg bg-base-200 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-base-content/50" />
                </div>
                <div>
                  <h3 className="font-semibold text-base-content">Total Raised</h3>
                  <p className="text-xs text-base-content/40">Community impact</p>
                </div>
              </div>

              <p className="text-3xl font-bold text-base-content mb-4">{formatCurrency(stats.totalDonations)}</p>

              <div className="space-y-3">
                {recentData.fundraising.slice(0, 2).map((campaign) => {
                  const progress = campaign.goal ? Math.min(100, (campaign.raised / campaign.goal) * 100) : 0;
                  return (
                    <div key={campaign.id} className="p-3 bg-base-200 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-sm font-medium text-base-content line-clamp-1">{campaign.title}</h4>
                        <span className="text-xs text-base-content/50">{progress.toFixed(0)}%</span>
                      </div>
                      <div className="h-1.5 bg-base-300 rounded-full overflow-hidden">
                        <div className="h-full bg-base-content/70 rounded-full" style={{ width: `${progress}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              <Link to="/fundraising" className="btn btn-ghost btn-sm btn-block mt-4 gap-1 text-base-content/60">
                View campaigns <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-base-100 rounded-xl border border-base-300 p-5"
            >
              <h3 className="font-semibold text-base-content mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-base-content/50" />
                Quick Actions
              </h3>

              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Events", icon: Calendar, href: "/events" },
                  { label: "Jobs", icon: Briefcase, href: "/opportunities" },
                  { label: "Chat", icon: MessageCircle, href: "/chat" },
                  { label: "Directory", icon: Users, href: "/directory" },
                ].map((action) => {
                  const Icon = action.icon;
                  return (
                    <Link
                      key={action.label}
                      to={action.href}
                      className="flex flex-col items-center gap-2 p-4 rounded-lg bg-base-200 hover:bg-base-300 transition-colors"
                    >
                      <div className="w-9 h-9 rounded-lg bg-base-100 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-base-content/50" />
                      </div>
                      <span className="text-xs text-base-content/60">{action.label}</span>
                    </Link>
                  );
                })}
              </div>
            </motion.div>

            {/* Announcements */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-base-100 rounded-xl border border-base-300 p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-base-content flex items-center gap-2">
                  <Bell className="w-5 h-5 text-base-content/50" />
                  Announcements
                </h3>
                <Link to="/announcements" className="btn btn-ghost btn-xs gap-1 text-base-content/50">
                  All <ChevronRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="space-y-3">
                {recentData.announcements.slice(0, 3).map((item) => (
                  <div key={item.id} className="p-3 bg-base-200 rounded-lg cursor-pointer hover:bg-base-300 transition-colors">
                    <h4 className="text-sm font-medium text-base-content line-clamp-1">
                      {item.subject || item.title}
                    </h4>
                    <p className="text-xs text-base-content/50 mt-1 line-clamp-2">
                      {item.body || item.description}
                    </p>
                    <p className="text-[10px] text-base-content/40 mt-2 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {getTimeAgo(item.createdAt)}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Pro Tip */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-base-200/50 rounded-xl border border-base-300 p-5"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-base-content/10 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 text-base-content/50" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-base-content mb-1">Pro Tip</h4>
                  <p className="text-xs text-base-content/50">
                    Complete your profile to get personalized recommendations.
                  </p>
                  <Link to="/profile" className="text-xs text-base-content/70 font-medium mt-2 inline-block hover:underline">
                    Update Profile →
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
