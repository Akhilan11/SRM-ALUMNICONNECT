import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Lock, CheckCircle, AlertCircle, ArrowLeft, Loader2, Send } from "lucide-react";
import { motion } from "framer-motion";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const auth = getAuth();

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent! Check your inbox.");
      setEmail("");
    } catch (err) {
      if (err.code === "auth/user-not-found") {
        setError("No account found with this email address.");
      } else if (err.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else {
        setError("Failed to send reset email. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="card bg-base-100 shadow-sm border border-base-300"
        >
          <div className="card-body p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-14 h-14 bg-base-200 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <Lock className="w-7 h-7 text-base-content" />
              </div>
              <h1 className="text-2xl font-bold text-base-content">Reset Password</h1>
              <p className="text-base-content/60 text-sm mt-2 max-w-xs mx-auto">
                Enter your email address and we'll send you a link to reset your password.
              </p>
            </div>

            {/* Success Message */}
            {message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="alert alert-success mb-6 py-3"
              >
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm">{message}</span>
              </motion.div>
            )}
            
            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="alert alert-error mb-6 py-3"
              >
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">{error}</span>
              </motion.div>
            )}

            <form onSubmit={handlePasswordReset} className="space-y-5">
              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text text-sm text-base-content/70">Email Address</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="input input-bordered w-full pl-11 bg-base-100"
                  />
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/40" />
                </div>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="btn btn-neutral w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Reset Link
                  </>
                )}
              </button>
            </form>

            <div className="divider text-base-content/30 text-xs my-6">OR</div>

            <div className="text-center">
              <Link to="/" className="inline-flex items-center gap-2 text-sm text-base-content/60 hover:text-base-content transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Back to Sign In
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default ForgotPassword;
