import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import {
  User,
  Mail,
  Calendar,
  MapPin,
  Briefcase,
  BookOpen,
  Award,
  Edit2,
  Check,
  X,
  Shield,
  Building,
  GraduationCap,
  Camera,
  Phone,
  Globe,
  Linkedin,
  Github,
  CheckCircle,
  AlertCircle,
  Loader2,
  Settings
} from "lucide-react";

export default function UserProfile() {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [originalData, setOriginalData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  useEffect(() => {
    if (user) fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    try {
      const docRef = doc(db, "users", user.uid);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data();
        setFormData(data);
        setOriginalData(data);
      } else {
        setFormData({});
        setOriginalData({});
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      showNotification("Failed to load profile", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const ref = doc(db, "users", user.uid);
      await updateDoc(ref, formData);
      setOriginalData(formData);
      setEditing(false);
      showNotification("Profile updated successfully!", "success");
    } catch (err) {
      console.error("Update failed:", err);
      showNotification("Failed to update profile", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(originalData);
    setEditing(false);
  };

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 3000);
  };

  // Profile completion calculation
  const profileFields = [
    "name", "email", "dob", "phone", "location",
    "profession", "company", "role",
    "collegeName", "batch", "graduateYear", "registrationNo",
    "linkedin", "github"
  ];
  const completedFields = profileFields.filter(field => formData[field] && formData[field] !== "-").length;
  const completionPercentage = Math.round((completedFields / profileFields.length) * 100);

  // Field configurations
  const personalFields = [
    { key: "name", label: "Full Name", icon: User, editable: true, type: "text", placeholder: "Enter your name" },
    { key: "email", label: "Email", icon: Mail, editable: false, type: "email", placeholder: "your@email.com" },
    { key: "dob", label: "Date of Birth", icon: Calendar, editable: true, type: "date", placeholder: "" },
    { key: "phone", label: "Phone Number", icon: Phone, editable: true, type: "tel", placeholder: "+91 12345 67890" },
    { key: "location", label: "Location", icon: MapPin, editable: true, type: "text", placeholder: "City, Country" },
  ];

  const professionalFields = [
    { key: "profession", label: "Profession", icon: Briefcase, editable: true, type: "text", placeholder: "Software Engineer" },
    { key: "company", label: "Company", icon: Building, editable: true, type: "text", placeholder: "Company Name" },
    { key: "role", label: "Account Type", icon: Award, editable: false, type: "text", placeholder: "" },
  ];

  const academicFields = [
    { key: "collegeName", label: "College Name", icon: GraduationCap, editable: true, type: "text", placeholder: "University Name" },
    { key: "batch", label: "Batch", icon: BookOpen, editable: true, type: "text", placeholder: "CSE-2020" },
    { key: "graduateYear", label: "Graduation Year", icon: Calendar, editable: true, type: "text", placeholder: "2024" },
    { key: "registrationNo", label: "Registration No", icon: Shield, editable: true, type: "text", placeholder: "REG123456" },
  ];

  const socialFields = [
    { key: "linkedin", label: "LinkedIn", icon: Linkedin, editable: true, type: "url", placeholder: "https://linkedin.com/in/username" },
    { key: "github", label: "GitHub", icon: Github, editable: true, type: "url", placeholder: "https://github.com/username" },
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
        <div className="card bg-base-100 shadow-sm border border-base-300 max-w-md w-full">
          <div className="card-body items-center text-center">
            <div className="w-20 h-20 rounded-full bg-base-200 flex items-center justify-center mb-4">
              <User className="w-10 h-10 text-base-content/30" />
            </div>
            <h2 className="card-title text-xl text-base-content">Authentication Required</h2>
            <p className="text-base-content/60 text-sm">Please log in to view your profile.</p>
            <div className="card-actions mt-4">
              <a href="/" className="btn btn-neutral">Sign In</a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex flex-col items-center justify-center">
        <span className="loading loading-spinner loading-lg text-base-content/30"></span>
        <p className="mt-4 text-base-content/50">Loading your profile...</p>
      </div>
    );
  }

  const renderField = (field) => {
    const Icon = field.icon;
    const value = formData[field.key];
    const displayValue = value && value !== "-" ? value : "";
    
    return (
      <div key={field.key} className="form-control">
        <label className="label py-1">
          <span className="label-text text-sm flex items-center gap-2 text-base-content/70">
            <Icon className="w-4 h-4" />
            {field.label}
            {!field.editable && <span className="badge badge-xs bg-base-200 text-base-content/50">Read only</span>}
          </span>
        </label>
        {editing && field.editable ? (
          <input
            type={field.type}
            name={field.key}
            value={displayValue}
            onChange={handleChange}
            placeholder={field.placeholder}
            className="input input-bordered input-sm bg-base-100 focus:border-base-content/30"
          />
        ) : (
          <div className="input input-bordered input-sm flex items-center bg-base-200/50 text-base-content">
            <span className={displayValue ? "" : "text-base-content/40"}>
              {displayValue || "Not provided"}
            </span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-base-200">
      {/* Toast Notification */}
      <AnimatePresence>
        {notification.show && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="toast toast-top toast-end z-50"
          >
            <div className={`alert ${notification.type === "error" ? "alert-error" : "alert-success"} shadow-lg`}>
              {notification.type === "success" ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
              <span>{notification.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-base-content">Profile Settings</h1>
            <p className="text-base-content/60 mt-1">Manage your personal information and account settings</p>
          </div>
          
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="btn btn-neutral gap-2"
            >
              <Edit2 className="w-4 h-4" />
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                className="btn btn-ghost gap-2"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="btn btn-neutral gap-2"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                Save Changes
              </button>
            </div>
          )}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 space-y-6"
          >
            {/* Profile Picture Card */}
            <div className="card bg-base-100 shadow-sm border border-base-300">
              <div className="card-body items-center text-center p-6">
                <div className="relative mb-4">
                  <div className="w-24 h-24 rounded-full bg-base-200 flex items-center justify-center text-4xl font-bold text-base-content/70 ring-4 ring-base-200">
                    {formData.name ? formData.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <button className="btn btn-circle btn-sm btn-neutral absolute -bottom-1 -right-1">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                <h2 className="text-xl font-bold text-base-content">{formData.name || "User"}</h2>
                <span className="badge bg-base-200 text-base-content/70 border-0 capitalize">
                  {formData.role || "Member"}
                </span>
                <p className="text-sm text-base-content/50 mt-1">{formData.email || user.email}</p>
              </div>
            </div>

            {/* Profile Completion Card */}
            <div className="card bg-base-100 shadow-sm border border-base-300">
              <div className="card-body p-5">
                <h3 className="font-semibold text-base-content mb-3">Profile Completion</h3>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-base-content/60">
                    {completedFields} of {profileFields.length} fields
                  </span>
                  <span className="text-sm font-bold text-base-content">{completionPercentage}%</span>
                </div>
                <div className="w-full bg-base-200 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${completionPercentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="bg-base-content/70 h-2 rounded-full"
                  />
                </div>
                {completionPercentage < 100 && (
                  <p className="text-xs text-base-content/50 mt-3">
                    Complete your profile to unlock all features
                  </p>
                )}
                {completionPercentage === 100 && (
                  <div className="flex items-center gap-2 mt-3 text-success text-sm">
                    <CheckCircle className="w-4 h-4" />
                    Profile complete!
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats Card */}
            <div className="card bg-base-100 shadow-sm border border-base-300">
              <div className="card-body p-5">
                <h3 className="font-semibold text-base-content mb-4">Account Info</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-base-content/60">Account Type</span>
                    <span className="text-sm font-medium text-base-content capitalize">{formData.role || "Standard"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-base-content/60">Batch</span>
                    <span className="text-sm font-medium text-base-content">{formData.batch && formData.batch !== "-" ? formData.batch : "N/A"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-base-content/60">Status</span>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-success"></span>
                      <span className="text-sm font-medium text-base-content">Active</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Form Fields */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Personal Information */}
            <div className="card bg-base-100 shadow-sm border border-base-300">
              <div className="card-body p-6">
                <div className="flex items-center gap-2 mb-4">
                  <User className="w-5 h-5 text-base-content/60" />
                  <h2 className="text-lg font-semibold text-base-content">Personal Information</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {personalFields.map(renderField)}
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="card bg-base-100 shadow-sm border border-base-300">
              <div className="card-body p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Briefcase className="w-5 h-5 text-base-content/60" />
                  <h2 className="text-lg font-semibold text-base-content">Professional Information</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {professionalFields.map(renderField)}
                </div>
              </div>
            </div>

            {/* Academic Information */}
            <div className="card bg-base-100 shadow-sm border border-base-300">
              <div className="card-body p-6">
                <div className="flex items-center gap-2 mb-4">
                  <GraduationCap className="w-5 h-5 text-base-content/60" />
                  <h2 className="text-lg font-semibold text-base-content">Academic Information</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {academicFields.map(renderField)}
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="card bg-base-100 shadow-sm border border-base-300">
              <div className="card-body p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Globe className="w-5 h-5 text-base-content/60" />
                  <h2 className="text-lg font-semibold text-base-content">Social Links</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {socialFields.map(renderField)}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
