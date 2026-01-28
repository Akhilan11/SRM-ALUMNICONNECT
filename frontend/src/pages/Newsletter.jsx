import { useState } from 'react';
import { db } from "../firebase";
import { collection, addDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { Mail, Send, CheckCircle, AlertCircle, Loader2, Bell, Sparkles } from 'lucide-react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const subscribe = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      await addDoc(collection(db, 'subscribers'), { 
        email, 
        createdAt: Date.now(),
        source: 'newsletter-page'
      });
      setMessage('Successfully subscribed! We\'ll keep you updated.');
      setSuccess(true);
      setEmail('');
    } catch (err) {
      setMessage('Failed to subscribe. Please try again.');
      setSuccess(false);
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
                <Bell className="w-7 h-7 text-base-content" />
              </div>
              <h1 className="text-2xl font-bold text-base-content">Stay Updated</h1>
              <p className="text-base-content/60 text-sm mt-2 max-w-xs mx-auto">
                Subscribe to our newsletter for the latest news, events, and opportunities from our alumni community.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-3 mb-6">
              {[
                "Weekly updates on alumni events",
                "Job opportunities from the network",
                "Success stories and achievements"
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-base-content/70">
                  <Sparkles className="w-4 h-4 text-base-content/40 shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
            
            <form className="space-y-4" onSubmit={subscribe}>
              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text text-sm text-base-content/70">Email Address</span>
                </label>
                <div className="relative">
                  <input
                    className="input input-bordered w-full pl-11 bg-base-100"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/40" />
                </div>
              </div>
              
              <button 
                className="btn btn-neutral w-full"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Subscribing...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Subscribe
                  </>
                )}
              </button>
            </form>
            
            {/* Message */}
            {message && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`alert ${success ? 'alert-success' : 'alert-error'} mt-6 py-3`}
              >
                {success ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                <span className="text-sm">{message}</span>
              </motion.div>
            )}

            {/* Privacy Note */}
            <p className="text-xs text-base-content/40 text-center mt-6">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
