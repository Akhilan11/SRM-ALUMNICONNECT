import React, { useEffect, useState, useRef } from "react";
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
import { Link } from "react-router-dom";
import { 
  ExternalLink, 
  X, 
  Calendar, 
  MapPin, 
  Search, 
  Plus, 
  ChevronRight,
  ChevronLeft,
  MoreHorizontal,
  Edit3,
  Trash2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Events() {
  const { role } = useAuth();
  const [events, setEvents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [form, setForm] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showImageConverter, setShowImageConverter] = useState(false);
  const [converterLoading, setConverterLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const carouselRef = useRef(null);

  // Scroll handlers for featured carousel
  const checkScrollButtons = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = 300;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
      setTimeout(checkScrollButtons, 300);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [search, activeFilter, events]);

  async function loadEvents() {
    setLoading(true);
    setError("");
    try {
      const q = query(collection(db, "events"));
      const snap = await getDocs(q);
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setEvents(list);
      setFiltered(list);
    } catch (err) {
      console.error("Error loading events:", err);
      setError("Failed to load events. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const normalize = (val) => (val ? val.toString().toLowerCase().trim() : "");

  function applyFilters() {
    let data = [...events];

    // Filter by search
    if (search.trim()) {
      const s = normalize(search);
      data = data.filter(
        (e) =>
          normalize(e.title).includes(s) ||
          normalize(e.organizer).includes(s) ||
          normalize(e.type).includes(s) ||
          normalize(e.location).includes(s)
      );
    }

    // Filter by status
    if (activeFilter === "upcoming") {
      const today = new Date();
      data = data.filter(e => new Date(e.date) >= today);
    } else if (activeFilter === "past") {
      const today = new Date();
      data = data.filter(e => new Date(e.date) < today);
    }

    setFiltered(data);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.title || !form.date) {
      setError("Title and Date are required!");
      return;
    }

    try {
      if (editingId) {
        await updateDoc(doc(db, "events", editingId), form);
      } else {
        const id = form.title.replace(/\s+/g, "-").toLowerCase() + "-" + Date.now();
        await setDoc(doc(db, "events", id), form);
      }

      setForm({});
      setEditingId(null);
      setShowModal(false);
      loadEvents();
    } catch (err) {
      console.error("Error saving event:", err);
      setError("Failed to save event. Please try again.");
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this event?")) return;
    try {
      await deleteDoc(doc(db, "events", id));
      loadEvents();
    } catch (err) {
      console.error("Error deleting event:", err);
    }
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return { month: '', day: '' };
    const date = new Date(dateStr);
    return {
      month: date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
      day: date.getDate()
    };
  };

  const formatFullDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Featured events (events with images)
  const featuredEvents = events.filter(e => e.photoUrl).slice(0, 6);

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      <div className="max-w-7xl mx-auto px-4 py-6">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6 mt-12">
          <h1 className="text-2xl font-bold text-base-content pb-2 border-b-2 border-primary">All Events</h1>
          
          {role === "admin" && (
            <button
              onClick={() => { setForm({}); setEditingId(null); setShowModal(true); }}
              className="btn btn-primary btn-sm gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Event
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          {/* Status Filters */}
          <div className="flex gap-1">
            {[
              { id: "all", label: "All" },
              { id: "upcoming", label: "Upcoming" },
              { id: "past", label: "Past" },
            ].map((filter) => (
              <button 
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeFilter === filter.id
                    ? "bg-base-200 text-base-content"
                    : "text-base-content/60 hover:bg-base-200"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <div className="h-6 w-px bg-base-300"></div>

          {/* Search */}
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/40" />
                <input
                  type="text"
              placeholder="Search by event name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
              className="input input-bordered input-sm w-full pl-9 bg-base-100"
                />
          </div>
              </div>

        {/* Error Alert */}
        {error && (
          <div className="alert alert-error mb-6 py-3">
            <span>{error}</span>
            <button onClick={() => setError("")} className="btn btn-ghost btn-xs">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Featured Events */}
        {featuredEvents.length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-base-content mb-4">Featured Events</h2>
            <div className="relative group/carousel">
              {/* Left Scroll Button */}
              {canScrollLeft && (
                <button 
                  onClick={() => scrollCarousel('left')}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-base-100 border border-base-300 shadow-lg flex items-center justify-center hover:bg-base-200 transition-all opacity-0 group-hover/carousel:opacity-100"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}

              <div 
                ref={carouselRef}
                onScroll={checkScrollButtons}
                className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
              >
                {featuredEvents.map((event) => (
                  <Link
                    key={event.id}
                    to={`/events/${event.id}`}
                    className="flex-shrink-0 w-72 bg-base-100 border border-base-300 rounded-xl overflow-hidden hover:shadow-lg transition-all group"
                  >
                    <div className="flex gap-3 p-3">
                      <img
                        src={event.photoUrl}
                        alt={event.title}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base-content line-clamp-2 text-sm group-hover:text-primary transition-colors">
                          {event.title}
                        </h3>
                        <div className="flex items-center gap-1 text-xs text-base-content/60 mt-1">
                          <MapPin className="w-3 h-3" />
                          <span className="truncate">{event.location || 'TBD'}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-base-content/60 mt-1">
                          <Calendar className="w-3 h-3" />
                          <span>{formatFullDate(event.date)}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              
              {/* Right Scroll Button */}
              {canScrollRight && featuredEvents.length > 3 && (
                <button 
                  onClick={() => scrollCarousel('right')}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-base-100 border border-base-300 shadow-lg flex items-center justify-center hover:bg-base-200 transition-all opacity-0 group-hover/carousel:opacity-100"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </div>
          </section>
        )}

        {/* Events List */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <Calendar className="w-16 h-16 text-base-content/20 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-base-content mb-2">No events found</h3>
            <p className="text-base-content/60 text-sm">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8">
            {filtered.map((event, index) => {
              const { month, day } = formatDate(event.date);
              const isPast = new Date(event.date) < new Date();
              
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="group"
                >
                  <div className="flex items-start gap-4 py-4 border-b border-base-200">
                    {/* Date Badge */}
                    <div className={`text-center shrink-0 w-12 ${isPast ? 'opacity-50' : ''}`}>
                      <div className="text-xs font-semibold text-primary">{month}</div>
                      <div className="text-2xl font-bold text-base-content">{day}</div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/events/${event.id}`}
                        className="block group-hover:text-primary transition-colors"
                      >
                        <h3 className={`font-semibold text-base-content line-clamp-1 ${isPast ? 'opacity-60' : ''}`}>
                          {event.title}
                        </h3>
                      </Link>
                      <p className="text-sm text-base-content/60 mt-0.5 line-clamp-1">
                        {event.location || 'Location TBD'}
                        {event.organizer && ` • ${event.organizer}`}
                      </p>
                      
                      {/* Tags */}
                      <div className="flex items-center gap-2 mt-2">
                        {event.type && (
                          <span className="px-2 py-0.5 rounded-md bg-base-200 text-xs text-base-content/70">
                            {event.type}
                          </span>
                        )}
                        {isPast && (
                          <span className="px-2 py-0.5 rounded-md bg-base-200 text-xs text-base-content/50">
                            Past Event
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Admin Actions */}
                    {role === "admin" && (
                      <div className="dropdown dropdown-end shrink-0">
                        <label tabIndex={0} className="btn btn-ghost btn-xs btn-square opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreHorizontal className="w-4 h-4" />
                        </label>
                        <ul tabIndex={0} className="dropdown-content z-10 menu p-2 shadow-lg bg-base-100 rounded-lg w-32 border border-base-200">
                          <li>
                            <button onClick={() => { setForm(event); setEditingId(event.id); setShowModal(true); }}>
                              <Edit3 className="w-4 h-4" />
                              Edit
                            </button>
                          </li>
                          <li>
                            <button onClick={() => handleDelete(event.id)} className="text-error">
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </button>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Results Count */}
        {filtered.length > 0 && (
          <div className="text-center mt-8 text-sm text-base-content/50">
            Showing {filtered.length} of {events.length} events
          </div>
        )}
      </div>

      {/* Add/Edit Event Modal */}
      <AnimatePresence>
      {showModal && (
          <div className="modal modal-open">
          <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="modal-box"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold">{editingId ? "Edit Event" : "Create Event"}</h3>
                <button onClick={() => setShowModal(false)} className="btn btn-ghost btn-sm btn-circle">
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              {error && (
                <div className="alert alert-error mb-4 py-2">
                  <span className="text-sm">{error}</span>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Event Title *</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter event title"
                    value={form.title || ""}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="input input-bordered"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Date *</span>
                    </label>
                    <input
                      type="date"
                      value={form.date || ""}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                      className="input input-bordered"
                      required
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Type</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Workshop, Meetup"
                      value={form.type || ""}
                      onChange={(e) => setForm({ ...form, type: e.target.value })}
                      className="input input-bordered"
                    />
                  </div>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Location</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Event location or address"
                    value={form.location || ""}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="input input-bordered"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Organizer</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Who's organizing this event?"
                    value={form.organizer || ""}
                    onChange={(e) => setForm({ ...form, organizer: e.target.value })}
                    className="input input-bordered"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Banner Image URL</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="https://..."
                    value={form.photoUrl || ""}
                    onChange={(e) => setForm({ ...form, photoUrl: e.target.value })}
                      className="input input-bordered flex-1"
                  />
                  <button
                    type="button"
                      onClick={() => setShowImageConverter(true)}
                      className="btn btn-ghost btn-square"
                      title="Convert image to URL"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                  </div>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Description</span>
                  </label>
                <textarea
                    placeholder="Describe your event..."
                  value={form.description || ""}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="textarea textarea-bordered"
                  rows="3"
                />
                </div>
                
                <div className="flex justify-end gap-2 pt-4">
                  <button type="button" onClick={() => setShowModal(false)} className="btn btn-ghost">
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingId ? "Update Event" : "Create Event"}
                  </button>
                </div>
              </form>
          </motion.div>
            <div className="modal-backdrop bg-neutral/60 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
        </div>
      )}
      </AnimatePresence>

      {/* Image Converter Modal */}
      {showImageConverter && (
        <div className="modal modal-open">
          <div className="modal-box max-w-5xl h-[80vh]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Image to URL Converter</h3>
              <button onClick={() => setShowImageConverter(false)} className="btn btn-sm btn-circle btn-ghost">
                <X className="w-4 h-4" />
              </button>
            </div>

            {converterLoading && (
              <div className="flex flex-col items-center justify-center h-full">
                <span className="loading loading-spinner loading-lg"></span>
                <p className="mt-4 text-base-content/60">Loading converter...</p>
              </div>
            )}

              <iframe
                src="https://www.imagetourl.org/"
              className="w-full h-full rounded-lg"
              style={{ opacity: converterLoading ? 0 : 1 }}
                onLoad={() => setConverterLoading(false)}
                title="Image to URL Converter"
            />
          </div>
          <div className="modal-backdrop" onClick={() => setShowImageConverter(false)}></div>
        </div>
      )}
    </div>
  );
}
