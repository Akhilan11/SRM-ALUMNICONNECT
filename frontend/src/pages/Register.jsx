import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { 
  User, 
  Mail, 
  Lock, 
  Calendar,
  GraduationCap,
  Building,
  Briefcase,
  MapPin,
  IdCard,
  BookOpen,
  ChevronLeft,
  Shield,
  Users,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  CheckCircle
} from "lucide-react";

export default function Register() {
  const [role, setRole] = useState("");
  const [formData, setFormData] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { currentTheme } = useTheme();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      const { email, password, ...extra } = formData;
      
      if (role !== "alumni" && role !== "recruiter") {
        extra.company = "-";
        extra.batch = "-";
      }
      if (role !== "student") {
        extra.location = extra.location || "-";
        extra.profession = extra.profession || "Professional";
      }
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      await setDoc(doc(db, "users", user.uid), {
        role,
        email,
        ...extra,
        createdAt: new Date().toISOString(),
        themePreference: currentTheme
      });
      
      navigate("/home");
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("This email is already registered.");
      } else if (err.code === "auth/weak-password") {
        setError("Password should be at least 6 characters.");
      } else if (err.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const roleConfigs = {
    admin: {
      icon: Shield,
      description: "College administrators manage the platform and verify users.",
      benefits: [
        "Manage platform users",
        "Verify alumni and student identities",
        "Generate reports and analytics",
        "Moderate content and opportunities"
      ]
    },
    student: {
      icon: GraduationCap,
      description: "Students can connect with alumni, find mentors, and explore opportunities.",
      benefits: [
        "Find alumni mentors",
        "Explore career opportunities",
        "Access exclusive resources",
        "Join student-alumni events"
      ]
    },
    alumni: {
      icon: Users,
      description: "Alumni can network, mentor students, and share opportunities.",
      benefits: [
        "Connect with current students",
        "Post job opportunities",
        "Share professional experiences",
        "Access networking events"
      ]
    }
  };

  const roleButtons = [
    { id: "admin", label: "College Admin" },
    { id: "student", label: "Student" },
    { id: "alumni", label: "Alumni" }
  ];

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="w-14 h-14 bg-base-100 border border-base-300 rounded-xl mx-auto mb-4 flex items-center justify-center">
            <Users className="w-7 h-7 text-base-content" />
          </div>
          <h1 className="text-3xl font-bold text-base-content">
            Join Our Community
          </h1>
          <p className="text-base-content/60 text-sm max-w-md mx-auto mt-2">
            Connect with peers, mentors, and opportunities in our vibrant network
          </p>
        </motion.div>

        {/* Role Selection or Registration Form */}
        <AnimatePresence mode="wait">
          {!role ? (
            // Role Selection Screen
            <motion.div
              key="role-selection"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="card bg-base-100 shadow-sm border border-base-300 max-w-2xl mx-auto"
            >
              <div className="card-body p-8">
                <h2 className="text-xl font-semibold text-base-content text-center mb-6">
                  Choose Your Role
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  {roleButtons.map(({ id, label }) => {
                    const config = roleConfigs[id];
                    const Icon = config.icon;
                    return (
                      <motion.button
                        key={id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setRole(id)}
                        className="card bg-base-200 hover:bg-base-300 border border-base-300 hover:border-base-content/20 transition-all cursor-pointer p-6"
                      >
                        <div className="flex flex-col items-center text-center">
                          <div className="w-14 h-14 rounded-xl bg-base-100 border border-base-300 flex items-center justify-center mb-4">
                            <Icon className="w-7 h-7 text-base-content" />
                          </div>
                          <h3 className="font-semibold text-base-content mb-2">{label}</h3>
                          <p className="text-base-content/60 text-xs line-clamp-2">{config.description}</p>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                <div className="divider text-base-content/30 text-xs">OR</div>
                
                <div className="text-center">
                  <Link to="/" className="inline-flex items-center gap-2 text-sm text-base-content/60 hover:text-base-content transition-colors">
                    <ChevronLeft className="w-4 h-4" />
                    Back to Sign In
                  </Link>
                </div>
              </div>
            </motion.div>
          ) : (
            // Registration Form
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Form */}
              <motion.div
                key={`form-${role}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="lg:col-span-2"
              >
                <div className="card bg-base-100 shadow-sm border border-base-300">
                  <div className="card-body p-6 md:p-8">
                    {/* Form Header */}
                    <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-base-200 flex items-center justify-center">
                          {React.createElement(roleConfigs[role]?.icon, { className: "w-5 h-5 text-base-content" })}
                        </div>
                        <div>
                          <h2 className="font-semibold text-base-content">
                            {role.charAt(0).toUpperCase() + role.slice(1)} Registration
                          </h2>
                          <p className="text-base-content/60 text-xs">{roleConfigs[role]?.description}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setRole("")}
                        className="btn btn-ghost btn-sm gap-1 text-base-content/60"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Change
                      </button>
                    </div>

                    <form onSubmit={handleRegister} className="space-y-6">
                      {/* Basic Information */}
                      <div>
                        <h3 className="text-sm font-medium text-base-content/70 mb-4 flex items-center gap-2">
                          <User className="w-4 h-4" />
                          Basic Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="form-control">
                            <label className="label py-1">
                              <span className="label-text text-sm text-base-content/70">Full Name</span>
                            </label>
                            <div className="relative">
                              <input
                                type="text"
                                name="name"
                                placeholder="Enter your full name"
                                onChange={handleChange}
                                required
                                className="input input-bordered w-full pl-11 bg-base-100"
                              />
                              <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/40" />
                            </div>
                          </div>
                          
                          <div className="form-control">
                            <label className="label py-1">
                              <span className="label-text text-sm text-base-content/70">Date of Birth</span>
                            </label>
                            <div className="relative">
                              <input
                                type="date"
                                name="dob"
                                onChange={handleChange}
                                required
                                className="input input-bordered w-full pl-11 bg-base-100"
                              />
                              <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/40" />
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <div className="form-control">
                            <label className="label py-1">
                              <span className="label-text text-sm text-base-content/70">Email Address</span>
                            </label>
                            <div className="relative">
                              <input
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                onChange={handleChange}
                                required
                                className="input input-bordered w-full pl-11 bg-base-100"
                              />
                              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/40" />
                            </div>
                          </div>
                          
                          <div className="form-control">
                            <label className="label py-1">
                              <span className="label-text text-sm text-base-content/70">Password</span>
                            </label>
                            <div className="relative">
                              <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Create a password"
                                onChange={handleChange}
                                required
                                className="input input-bordered w-full pl-11 pr-11 bg-base-100"
                              />
                              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/40" />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-base-content/40 hover:text-base-content/70"
                              >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Role-specific Fields */}
                      <AnimatePresence>
                        {role && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                          >
                            <h3 className="text-sm font-medium text-base-content/70 mb-4 flex items-center gap-2">
                              {React.createElement(roleConfigs[role]?.icon, { className: "w-4 h-4" })}
                              {role.charAt(0).toUpperCase() + role.slice(1)} Details
                            </h3>
                            
                            {/* Alumni Fields */}
                            {role === "alumni" && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="form-control">
                                    <label className="label py-1">
                                      <span className="label-text text-sm text-base-content/70">Graduation Year</span>
                                    </label>
                                    <div className="relative">
                                      <input
                                        type="text"
                                        name="graduateYear"
                                        placeholder="e.g., 2020"
                                        onChange={handleChange}
                                        required
                                        className="input input-bordered w-full pl-11 bg-base-100"
                                      />
                                      <GraduationCap className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/40" />
                                    </div>
                                  </div>
                                  
                                  <div className="form-control">
                                    <label className="label py-1">
                                      <span className="label-text text-sm text-base-content/70">Batch</span>
                                    </label>
                                    <div className="relative">
                                      <input
                                        type="text"
                                        name="batch"
                                        placeholder="e.g., CSE-2018"
                                        onChange={handleChange}
                                        required
                                        className="input input-bordered w-full pl-11 bg-base-100"
                                      />
                                      <BookOpen className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/40" />
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="form-control">
                                    <label className="label py-1">
                                      <span className="label-text text-sm text-base-content/70">Profession</span>
                                    </label>
                                    <div className="relative">
                                      <input
                                        type="text"
                                        name="profession"
                                        placeholder="Your profession"
                                        onChange={handleChange}
                                        required
                                        className="input input-bordered w-full pl-11 bg-base-100"
                                      />
                                      <Briefcase className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/40" />
                                    </div>
                                  </div>
                                  
                                  <div className="form-control">
                                    <label className="label py-1">
                                      <span className="label-text text-sm text-base-content/70">Company</span>
                                    </label>
                                    <div className="relative">
                                      <input
                                        type="text"
                                        name="company"
                                        placeholder="Your company"
                                        onChange={handleChange}
                                        required
                                        className="input input-bordered w-full pl-11 bg-base-100"
                                      />
                                      <Building className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/40" />
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="form-control">
                                  <label className="label py-1">
                                    <span className="label-text text-sm text-base-content/70">Location</span>
                                  </label>
                                  <div className="relative">
                                    <input
                                      type="text"
                                      name="location"
                                      placeholder="Your location"
                                      onChange={handleChange}
                                      required
                                      className="input input-bordered w-full pl-11 bg-base-100"
                                    />
                                    <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/40" />
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Admin Fields */}
                            {role === "admin" && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="form-control">
                                  <label className="label py-1">
                                    <span className="label-text text-sm text-base-content/70">Employee ID</span>
                                  </label>
                                  <div className="relative">
                                    <input
                                      type="text"
                                      name="employeeId"
                                      placeholder="Your employee ID"
                                      onChange={handleChange}
                                      required
                                      className="input input-bordered w-full pl-11 bg-base-100"
                                    />
                                    <IdCard className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/40" />
                                  </div>
                                </div>
                                
                                <div className="form-control">
                                  <label className="label py-1">
                                    <span className="label-text text-sm text-base-content/70">Position/Role</span>
                                  </label>
                                  <div className="relative">
                                    <input
                                      type="text"
                                      name="profession"
                                      placeholder="Your position"
                                      onChange={handleChange}
                                      required
                                      className="input input-bordered w-full pl-11 bg-base-100"
                                    />
                                    <Briefcase className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/40" />
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Student Fields */}
                            {role === "student" && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="form-control">
                                    <label className="label py-1">
                                      <span className="label-text text-sm text-base-content/70">Registration No</span>
                                    </label>
                                    <div className="relative">
                                      <input
                                        type="text"
                                        name="registrationNo"
                                        placeholder="Your registration number"
                                        onChange={handleChange}
                                        required
                                        className="input input-bordered w-full pl-11 bg-base-100"
                                      />
                                      <IdCard className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/40" />
                                    </div>
                                  </div>
                                  
                                  <div className="form-control">
                                    <label className="label py-1">
                                      <span className="label-text text-sm text-base-content/70">Batch</span>
                                    </label>
                                    <div className="relative">
                                      <input
                                        type="text"
                                        name="batch"
                                        placeholder="e.g., CSE-2022"
                                        onChange={handleChange}
                                        required
                                        className="input input-bordered w-full pl-11 bg-base-100"
                                      />
                                      <BookOpen className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/40" />
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="form-control">
                                    <label className="label py-1">
                                      <span className="label-text text-sm text-base-content/70">Year to Graduate</span>
                                    </label>
                                    <div className="relative">
                                      <input
                                        type="text"
                                        name="yearToGraduate"
                                        placeholder="Expected graduation year"
                                        onChange={handleChange}
                                        required
                                        className="input input-bordered w-full pl-11 bg-base-100"
                                      />
                                      <GraduationCap className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/40" />
                                    </div>
                                  </div>
                                  
                                  <div className="form-control">
                                    <label className="label py-1">
                                      <span className="label-text text-sm text-base-content/70">College Name</span>
                                    </label>
                                    <div className="relative">
                                      <input
                                        type="text"
                                        name="collegeName"
                                        placeholder="Your college"
                                        onChange={handleChange}
                                        required
                                        className="input input-bordered w-full pl-11 bg-base-100"
                                      />
                                      <Building className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/40" />
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="form-control">
                                  <label className="label py-1">
                                    <span className="label-text text-sm text-base-content/70">Location</span>
                                  </label>
                                  <div className="relative">
                                    <input
                                      type="text"
                                      name="location"
                                      placeholder="Your location"
                                      onChange={handleChange}
                                      required
                                      className="input input-bordered w-full pl-11 bg-base-100"
                                    />
                                    <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/40" />
                                  </div>
                                </div>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Error Message */}
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="alert alert-error py-3"
                        >
                          <span className="text-sm">{error}</span>
                        </motion.div>
                      )}

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-neutral w-full"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Creating Account...
                          </>
                        ) : (
                          <>
                            Create Account
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>

                      <div className="divider text-base-content/30 text-xs">OR</div>
                      
                      <div className="text-center">
                        <p className="text-sm text-base-content/60">
                          Already have an account?{" "}
                          <Link to="/" className="font-medium text-base-content hover:underline">
                            Sign in
                          </Link>
                        </p>
                      </div>
                    </form>
                  </div>
                </div>
              </motion.div>

              {/* Side Panel - Role Info */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="lg:col-span-1"
              >
                <div className="card bg-base-100 shadow-sm border border-base-300 sticky top-6">
                  <div className="card-body p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-base-200 flex items-center justify-center">
                        {React.createElement(roleConfigs[role]?.icon, { className: "w-5 h-5 text-base-content" })}
                      </div>
                      <h3 className="font-semibold text-base-content">
                        {role.charAt(0).toUpperCase() + role.slice(1)} Benefits
                      </h3>
                    </div>
                    
                    <ul className="space-y-3">
                      {roleConfigs[role]?.benefits.map((item, idx) => (
                        <motion.li 
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="flex items-start gap-3"
                        >
                          <CheckCircle className="w-4 h-4 text-base-content/50 mt-0.5 shrink-0" />
                          <span className="text-sm text-base-content/70">{item}</span>
                        </motion.li>
                      ))}
                    </ul>
                    
                    <div className="mt-6 p-4 bg-base-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <Shield className="w-4 h-4 text-base-content/50 mt-0.5 shrink-0" />
                        <div>
                          <p className="font-medium text-sm text-base-content">Secure Registration</p>
                          <p className="text-xs text-base-content/60 mt-1">
                            Your information is encrypted and securely stored.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
