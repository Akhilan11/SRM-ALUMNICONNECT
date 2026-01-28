import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Calendar, MapPin, User, Tag, X } from "lucide-react";

export default function EventDetails() {
  const { id } = useParams();
  const { role } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});

  useEffect(() => {
    loadEvent();
  }, [id]);

  async function loadEvent() {
    try {
      const snap = await getDoc(doc(db, "events", id));
      if (snap.exists()) {
        setEvent({ id: snap.id, ...snap.data() });
        setForm(snap.data());
      }
    } catch (err) {
      console.error("Error fetching event:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(e) {
    e.preventDefault();
    try {
      await updateDoc(doc(db, "events", id), form);
      setEvent({ ...event, ...form });
      setEditing(false);
    } catch (err) {
      console.error("Error updating event:", err);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p className="ml-4 text-base-content">Loading...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="card bg-base-100 shadow-xl p-8 text-center">
          <p className="text-base-content/70 text-lg">Event not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <motion.div
          className="card bg-base-100 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="card-body">
            <h1 className="card-title text-3xl">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {event.title}
              </span>
            </h1>

            {/* Photo */}
            {event.photoUrl && (
              <figure className="mt-4">
                <img
                  src={event.photoUrl}
                  alt={event.title}
                  className="w-full max-h-96 object-cover rounded-lg"
                />
              </figure>
            )}

            {/* Event Details */}
            {!editing ? (
              <div className="space-y-4 mt-6">
                {event.date && (
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-primary" />
                    <span className="text-base-content">{event.date}</span>
                  </div>
                )}
                {event.type && (
                  <div className="flex items-center gap-3">
                    <Tag className="w-5 h-5 text-primary" />
                    <span className="badge badge-primary">{event.type}</span>
                  </div>
                )}
                {event.domain && (
                  <div className="flex items-center gap-3">
                    <Tag className="w-5 h-5 text-secondary" />
                    <span className="badge badge-secondary">{event.domain}</span>
                  </div>
                )}
                {event.location && (
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-accent" />
                    <span className="text-base-content">{event.location}</span>
                  </div>
                )}
                {event.organizer && (
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-info" />
                    <span className="text-base-content">{event.organizer}</span>
                  </div>
                )}

                {/* Description with Markdown */}
                {event.description && (
                  <div className="mt-6 prose prose-sm max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {event.description}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleSave} className="space-y-4 mt-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Title *</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Title"
                    value={form.title || ""}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="input input-bordered"
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Date *</span>
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
                    <span className="label-text">Type</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Type"
                    value={form.type || ""}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="input input-bordered"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Domain</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Domain"
                    value={form.domain || ""}
                    onChange={(e) => setForm({ ...form, domain: e.target.value })}
                    className="input input-bordered"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Location</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Location"
                    value={form.location || ""}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="input input-bordered"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Organizer</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Organizer"
                    value={form.organizer || ""}
                    onChange={(e) => setForm({ ...form, organizer: e.target.value })}
                    className="input input-bordered"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Photo URL</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Photo URL"
                    value={form.photoUrl || ""}
                    onChange={(e) => setForm({ ...form, photoUrl: e.target.value })}
                    className="input input-bordered"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Description (Markdown)</span>
                  </label>
                  <textarea
                    placeholder="Write your content in Markdown..."
                    value={form.description || ""}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="textarea textarea-bordered min-h-[200px]"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="btn btn-ghost flex-1"
                    onClick={() => setEditing(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary flex-1">
                    Save
                  </button>
                </div>
              </form>
            )}

            {/* Admin Edit button */}
            {role === "admin" && !editing && (
              <div className="card-actions justify-end mt-6">
                <button
                  className="btn btn-primary"
                  onClick={() => setEditing(true)}
                >
                  Edit Event
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
