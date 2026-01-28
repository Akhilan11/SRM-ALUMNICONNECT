// Payments.jsx - Clean Minimal Donation Page
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Heart, 
  CreditCard, 
  User, 
  Mail, 
  Phone, 
  MapPin,
  Shield,
  CheckCircle,
  Zap,
  Repeat,
  ArrowLeft,
  ArrowRight,
  Lock,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function Payments() {
  const { user } = useAuth();
  const [donationAmount, setDonationAmount] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const [donationType, setDonationType] = useState("one-time");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [donorInfo, setDonorInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    anonymous: false
  });
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isValidAmount, setIsValidAmount] = useState(true);

  const presetAmounts = [500, 1000, 2500, 5000, 7500, 10000];

  useEffect(() => {
    if (user) {
      setDonorInfo(prev => ({
        ...prev,
        name: user.displayName || "",
        email: user.email || ""
      }));
    }
  }, [user]);

  const handleAmountSelect = (amount) => {
    setDonationAmount(amount.toString());
    setCustomAmount("");
    setIsValidAmount(true);
  };

  const handleCustomAmountChange = (value) => {
    setCustomAmount(value);
    setDonationAmount("");
    const amount = parseFloat(value);
    setIsValidAmount(value === "" || (amount > 0 && amount <= 100000));
  };

  const handleDonorInfoChange = (field, value) => {
    setDonorInfo(prev => ({ ...prev, [field]: value }));
  };

  const validateStep1 = () => {
    const amount = customAmount || donationAmount;
    if (!amount || parseFloat(amount) <= 0) {
      setError("Please select or enter a donation amount");
      setIsValidAmount(false);
      return false;
    }
    setError("");
    setIsValidAmount(true);
    return true;
  };

  const validateStep2 = () => {
    if (!donorInfo.anonymous) {
      if (!donorInfo.name.trim()) {
        setError("Please enter your name");
        return false;
      }
      if (!donorInfo.email.trim()) {
        setError("Please enter your email");
        return false;
      }
    }
    setError("");
    return true;
  };

  const handleNext = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
    setError("");
  };

  const processDonation = async () => {
    setLoading(true);
    setError("");
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const isSuccess = Math.random() > 0.1;
      if (!isSuccess) throw new Error("Payment failed. Please try again.");

      await addDoc(collection(db, "donations"), {
        amount: parseFloat(customAmount || donationAmount),
        type: donationType,
        paymentMethod,
        donorInfo: { ...donorInfo, userId: user?.uid || null },
        status: "completed",
        createdAt: serverTimestamp(),
        anonymous: donorInfo.anonymous,
        isDemo: true
      });
      setStep(4);
    } catch (err) {
      setError(err.message || "Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setDonationAmount("");
    setCustomAmount("");
    setDonationType("one-time");
    setPaymentMethod("card");
    setDonorInfo({ name: "", email: "", phone: "", address: "", anonymous: false });
    setStep(1);
    setError("");
    setIsValidAmount(true);
  };

  const getCurrentAmount = () => parseFloat(customAmount || donationAmount || 0);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const steps = [
    { num: 1, label: "Amount" },
    { num: 2, label: "Details" },
    { num: 3, label: "Payment" },
    { num: 4, label: "Done" },
  ];

  return (
    <div className="min-h-screen bg-base-200">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-base-content/10 mb-4">
            <Heart className="w-8 h-8 text-base-content" />
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-base-content mb-2">
            Support Our Community
          </h1>
          <p className="text-base-content/50 max-w-lg mx-auto">
            Your contribution helps us continue our mission and make a difference.
          </p>
        </motion.div>

        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-center gap-2">
            {steps.map((s, index) => (
              <React.Fragment key={s.num}>
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                    step >= s.num 
                      ? "bg-base-content text-base-100" 
                      : "bg-base-300 text-base-content/50"
                  }`}>
                    {step > s.num ? <CheckCircle className="w-5 h-5" /> : s.num}
                  </div>
                  <span className={`text-xs mt-1 ${step >= s.num ? "text-base-content" : "text-base-content/40"}`}>
                    {s.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-12 lg:w-20 h-0.5 mb-5 ${step > s.num ? "bg-base-content" : "bg-base-300"}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="bg-base-100 rounded-2xl border border-base-300 overflow-hidden">
              <div className="p-6 lg:p-8">
                <AnimatePresence mode="wait">
                  {/* Step 1: Amount */}
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div>
                        <h2 className="text-xl font-bold text-base-content mb-1">Choose Amount</h2>
                        <p className="text-sm text-base-content/50">Select a preset or enter custom amount</p>
                      </div>

                      {/* Donation Type Toggle */}
                      <div className="flex gap-2 p-1 bg-base-200 rounded-xl">
                        <button
                          onClick={() => setDonationType("one-time")}
                          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition-all ${
                            donationType === "one-time" 
                              ? "bg-base-100 text-base-content shadow-sm" 
                              : "text-base-content/60 hover:text-base-content"
                          }`}
                        >
                          <Zap className="w-4 h-4" />
                          One-Time
                        </button>
                        <button
                          onClick={() => setDonationType("monthly")}
                          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition-all ${
                            donationType === "monthly" 
                              ? "bg-base-100 text-base-content shadow-sm" 
                              : "text-base-content/60 hover:text-base-content"
                          }`}
                        >
                          <Repeat className="w-4 h-4" />
                          Monthly
                        </button>
                      </div>

                      {/* Preset Amounts */}
                      <div className="grid grid-cols-3 gap-3">
                        {presetAmounts.map((amount) => (
                          <button
                            key={amount}
                            onClick={() => handleAmountSelect(amount)}
                            className={`py-4 rounded-xl text-center font-semibold transition-all ${
                              donationAmount === amount.toString()
                                ? "bg-base-content text-base-100"
                                : "bg-base-200 text-base-content hover:bg-base-300"
                            }`}
                          >
                            {formatCurrency(amount)}
                          </button>
                        ))}
                      </div>

                      {/* Custom Amount */}
                      <div>
                        <label className="text-sm text-base-content/60 mb-2 block">Or enter custom amount</label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40 font-medium">₹</span>
                          <input
                            type="number"
                            placeholder="Enter amount"
                            value={customAmount}
                            onChange={(e) => handleCustomAmountChange(e.target.value)}
                            className={`input input-bordered w-full pl-10 h-14 text-lg ${!isValidAmount ? 'input-error' : ''}`}
                          />
                        </div>
                      </div>

                      {error && (
                        <div className="text-sm text-error bg-error/10 rounded-lg p-3">{error}</div>
                      )}
                    </motion.div>
                  )}

                  {/* Step 2: Donor Info */}
                  {step === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div>
                        <h2 className="text-xl font-bold text-base-content mb-1">Your Details</h2>
                        <p className="text-sm text-base-content/50">We'll send a receipt to your email</p>
                      </div>

                      <label className="flex items-center gap-3 p-4 bg-base-200 rounded-xl cursor-pointer">
                        <input
                          type="checkbox"
                          checked={donorInfo.anonymous}
                          onChange={(e) => handleDonorInfoChange("anonymous", e.target.checked)}
                          className="checkbox checkbox-sm"
                        />
                        <span className="text-sm text-base-content">Make this donation anonymous</span>
                      </label>

                      {!donorInfo.anonymous && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm text-base-content/60 mb-2 block">Full Name *</label>
                              <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
                                <input
                                  type="text"
                                  placeholder="John Doe"
                                  value={donorInfo.name}
                                  onChange={(e) => handleDonorInfoChange("name", e.target.value)}
                                  className="input input-bordered w-full pl-11"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="text-sm text-base-content/60 mb-2 block">Email *</label>
                              <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
                                <input
                                  type="email"
                                  placeholder="john@example.com"
                                  value={donorInfo.email}
                                  onChange={(e) => handleDonorInfoChange("email", e.target.value)}
                                  className="input input-bordered w-full pl-11"
                                />
                              </div>
                            </div>
                          </div>

                          <div>
                            <label className="text-sm text-base-content/60 mb-2 block">Phone (Optional)</label>
                            <div className="relative">
                              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
                              <input
                                type="tel"
                                placeholder="+91 98765 43210"
                                value={donorInfo.phone}
                                onChange={(e) => handleDonorInfoChange("phone", e.target.value)}
                                className="input input-bordered w-full pl-11"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {error && (
                        <div className="text-sm text-error bg-error/10 rounded-lg p-3">{error}</div>
                      )}
                    </motion.div>
                  )}

                  {/* Step 3: Payment */}
                  {step === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div>
                        <h2 className="text-xl font-bold text-base-content mb-1">Payment Method</h2>
                        <p className="text-sm text-base-content/50">Demo mode - no real payment processed</p>
                      </div>

                      <div className="p-4 bg-base-200 rounded-xl text-sm text-base-content/70">
                        <strong>Demo:</strong> This is a simulated payment. Click "Complete" to test the flow.
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => setPaymentMethod("card")}
                          className={`p-4 rounded-xl flex flex-col items-center gap-2 transition-all ${
                            paymentMethod === "card"
                              ? "bg-base-content text-base-100"
                              : "bg-base-200 text-base-content hover:bg-base-300"
                          }`}
                        >
                          <CreditCard className="w-6 h-6" />
                          <span className="text-sm font-medium">Card</span>
                        </button>
                        <button
                          onClick={() => setPaymentMethod("upi")}
                          className={`p-4 rounded-xl flex flex-col items-center gap-2 transition-all ${
                            paymentMethod === "upi"
                              ? "bg-base-content text-base-100"
                              : "bg-base-200 text-base-content hover:bg-base-300"
                          }`}
                        >
                          <Sparkles className="w-6 h-6" />
                          <span className="text-sm font-medium">UPI</span>
                        </button>
                      </div>

                      {paymentMethod === "card" && (
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm text-base-content/60 mb-2 block">Card Number</label>
                            <input
                              type="text"
                              defaultValue="4242 4242 4242 4242"
                              className="input input-bordered w-full"
                              readOnly
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm text-base-content/60 mb-2 block">Expiry</label>
                              <input
                                type="text"
                                defaultValue="12/25"
                                className="input input-bordered w-full"
                                readOnly
                              />
                            </div>
                            <div>
                              <label className="text-sm text-base-content/60 mb-2 block">CVC</label>
                              <input
                                type="text"
                                defaultValue="123"
                                className="input input-bordered w-full"
                                readOnly
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {paymentMethod === "upi" && (
                        <div>
                          <label className="text-sm text-base-content/60 mb-2 block">UPI ID</label>
                          <input
                            type="text"
                            placeholder="yourname@upi"
                            className="input input-bordered w-full"
                          />
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-sm text-base-content/50">
                        <Lock className="w-4 h-4" />
                        Demo mode - no real payment will be processed
                      </div>

                      {error && (
                        <div className="text-sm text-error bg-error/10 rounded-lg p-3">{error}</div>
                      )}
                    </motion.div>
                  )}

                  {/* Step 4: Success */}
                  {step === 4 && (
                    <motion.div
                      key="step4"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-8"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="w-20 h-20 rounded-full bg-base-content/10 flex items-center justify-center mx-auto mb-6"
                      >
                        <CheckCircle className="w-10 h-10 text-base-content" />
                      </motion.div>
                      <h2 className="text-2xl font-bold text-base-content mb-2">Thank You!</h2>
                      <p className="text-base-content/60 mb-2">
                        Your donation of <span className="font-bold">{formatCurrency(getCurrentAmount())}</span> was successful.
                      </p>
                      <p className="text-xs text-base-content/40 mb-6">
                        This was a demo transaction. No real payment was processed.
                      </p>
                      <div className="flex gap-3 justify-center">
                        <button onClick={resetForm} className="btn btn-neutral">
                          Donate Again
                        </button>
                        <button className="btn btn-ghost">
                          View Receipt
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Navigation */}
                {step < 4 && (
                  <div className="flex justify-between pt-6 mt-6 border-t border-base-200">
                    <button
                      onClick={handleBack}
                      disabled={step === 1}
                      className="btn btn-ghost gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back
                    </button>
                    <button
                      onClick={step === 3 ? processDonation : handleNext}
                      disabled={loading}
                      className="btn btn-neutral gap-2"
                    >
                      {loading ? (
                        <span className="loading loading-spinner loading-sm"></span>
                      ) : step === 3 ? (
                        <>Complete</>
                      ) : (
                        <>
                          Continue
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Summary Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="bg-base-100 rounded-2xl border border-base-300 p-6 sticky top-6">
              <h3 className="font-bold text-base-content mb-4">Summary</h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-base-content/60">Amount</span>
                  <span className="text-2xl font-bold text-base-content">{formatCurrency(getCurrentAmount())}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-base-content/60">Frequency</span>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-base-200 text-base-content/70 capitalize">
                    {donationType}
                  </span>
                </div>

                {donationType === "monthly" && getCurrentAmount() > 0 && (
                  <div className="p-3 bg-base-200 rounded-xl">
                    <p className="text-sm text-base-content/60">Annual Impact</p>
                    <p className="text-lg font-bold text-base-content">{formatCurrency(getCurrentAmount() * 12)}</p>
                  </div>
                )}

                <div className="pt-4 border-t border-base-200">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-base-content">Total</span>
                    <span className="text-xl font-bold text-base-content">{formatCurrency(getCurrentAmount())}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-base-200 rounded-xl">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-base-content/50 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-base-content">Demo Mode</p>
                    <p className="text-xs text-base-content/50">No real payment will be processed</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
