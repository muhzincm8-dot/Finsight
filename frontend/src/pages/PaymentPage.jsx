import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import {
    Crown, Check, ArrowLeft, Zap, Shield, TrendingUp,
    BarChart2, Download, Clock, Sparkles, AlertCircle
} from "lucide-react";

const FEATURES = [
    { icon: TrendingUp, text: "Unlimited transaction history" },
    { icon: BarChart2, text: "Advanced financial insights & charts" },
    { icon: Download, text: "Export data to CSV anytime" },
    { icon: Shield, text: "Priority support & account protection" },
    { icon: Clock, text: "Lifetime access — one-time payment" },
    { icon: Sparkles, text: "All future premium features included" },
];

export default function PaymentPage() {
    const { currentUser, refreshUser } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_placeholder";

    const handlePayment = async () => {
        if (currentUser?.hasPaid) return;
        setError("");
        setLoading(true);

        try {
            const orderRes = await api.post('/payment/create-order');
            const { orderId, amount, currency, keyId, mock } = orderRes.data;

            // If in mock mode (no real Razorpay keys), simulate success
            if (mock || keyId === 'rzp_test_placeholder') {
                const verifyRes = await api.post('/payment/verify', {
                    razorpay_order_id: orderId,
                    razorpay_payment_id: 'pay_mock_' + Date.now(),
                    razorpay_signature: 'mock_signature',
                    mock: true,
                });
                if (verifyRes.data.hasPaid) {
                    await refreshUser();
                    setSuccess(true);
                }
                setLoading(false);
                return;
            }

            // Real Razorpay flow
            const options = {
                key: keyId || RAZORPAY_KEY_ID,
                amount,
                currency,
                name: "Finsight",
                description: "Lifetime Premium Access",
                order_id: orderId,
                handler: async (response) => {
                    try {
                        const verifyRes = await api.post('/payment/verify', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        });
                        if (verifyRes.data.hasPaid) {
                            await refreshUser();
                            setSuccess(true);
                        }
                    } catch (err) {
                        setError("Payment verification failed. Contact support.");
                    }
                    setLoading(false);
                },
                prefill: {
                    name: currentUser?.name,
                    email: currentUser?.email,
                    contact: currentUser?.mobileNumber,
                },
                theme: { color: "#00f3ff" },
                modal: {
                    ondismiss: () => setLoading(false),
                },
            };

            if (!window.Razorpay) {
                // Load Razorpay script dynamically
                const script = document.createElement("script");
                script.src = "https://checkout.razorpay.com/v1/checkout.js";
                script.onload = () => {
                    const rzp = new window.Razorpay(options);
                    rzp.open();
                };
                script.onerror = () => {
                    setError("Failed to load payment gateway. Check your internet connection.");
                    setLoading(false);
                };
                document.body.appendChild(script);
            } else {
                const rzp = new window.Razorpay(options);
                rzp.open();
            }
        } catch (err) {
            setError(err?.response?.data?.msg || "Failed to initiate payment. Please try again.");
            setLoading(false);
        }
    };

    if (currentUser?.hasPaid || success) {
        return (
            <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4">
                <div className="text-center space-y-6 max-w-md">
                    <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-yellow-400/20 to-amber-500/20 border-2 border-yellow-400/40 flex items-center justify-center shadow-[0_0_40px_rgba(234,179,8,0.2)]">
                        <Crown size={40} className="text-yellow-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">You're Premium!</h1>
                        <p className="text-gray-400">
                            {success
                                ? "Payment successful! You now have lifetime access to all Finsight features."
                                : "You already have lifetime premium access. Enjoy all features!"}
                        </p>
                    </div>
                    <button
                        onClick={() => navigate("/")}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 text-yellow-300 rounded-xl font-medium hover:from-yellow-500/30 hover:to-amber-500/30 transition-all"
                    >
                        Go to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-dark-bg text-white">
            {/* Header */}
            <div className="border-b border-white/5 bg-surface-dark/50 backdrop-blur-sm">
                <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <span className="text-gray-400 text-sm">Upgrade to Premium</span>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 py-16">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left — Features */}
                    <div className="space-y-8">
                        <div>
                            <div className="inline-flex items-center gap-2 text-xs font-medium text-neon-blue bg-neon-blue/10 border border-neon-blue/20 px-3 py-1.5 rounded-full mb-4">
                                <Sparkles size={12} />
                                One-time payment
                            </div>
                            <h1 className="text-4xl font-bold leading-tight mb-4">
                                Unlock{" "}
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-amber-500">
                                    Lifetime Premium
                                </span>
                            </h1>
                            <p className="text-gray-400 text-lg leading-relaxed">
                                Pay once, get lifetime access to every feature in Finsight — now and in the future.
                            </p>
                        </div>

                        <ul className="space-y-3">
                            {FEATURES.map(({ icon: Icon, text }, i) => (
                                <li key={i} className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-neon-blue/10 border border-neon-blue/20 flex items-center justify-center flex-shrink-0">
                                        <Icon size={14} className="text-neon-blue" />
                                    </div>
                                    <span className="text-gray-300 text-sm">{text}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Right — Pricing Card */}
                    <div>
                        <div className="relative rounded-2xl bg-gradient-to-br from-surface-dark to-dark-bg border border-white/10 p-8 shadow-[0_0_60px_rgba(0,243,255,0.05)] overflow-hidden">
                            {/* Glow effect */}
                            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-blue/40 to-transparent"></div>
                            <div className="absolute -top-20 -right-20 w-40 h-40 bg-neon-blue/5 rounded-full blur-3xl"></div>

                            <div className="relative">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400/20 to-amber-500/20 border border-yellow-400/30 flex items-center justify-center">
                                        <Crown size={22} className="text-yellow-400" />
                                    </div>
                                    <span className="text-xs font-medium text-neon-blue bg-neon-blue/10 border border-neon-blue/20 px-2.5 py-1 rounded-full">
                                        Most Popular
                                    </span>
                                </div>

                                <h2 className="text-2xl font-bold text-white mb-1">Finsight Premium</h2>
                                <p className="text-gray-500 text-sm mb-6">Everything you need, forever.</p>

                                <div className="flex items-end gap-2 mb-6">
                                    <span className="text-5xl font-black text-white">₹499</span>
                                    <span className="text-gray-500 text-sm mb-2">one-time</span>
                                </div>

                                <div className="space-y-2.5 mb-8">
                                    {[
                                        "No monthly fees, ever",
                                        "Instant access after payment",
                                        "All future updates included",
                                        "Cancel anytime (no subscription)",
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
                                            <Check size={14} className="text-neon-blue flex-shrink-0" />
                                            {item}
                                        </div>
                                    ))}
                                </div>

                                {error && (
                                    <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-2 text-red-400 text-sm">
                                        <AlertCircle size={14} />
                                        {error}
                                    </div>
                                )}

                                <button
                                    onClick={handlePayment}
                                    disabled={loading}
                                    id="upgrade-pay-button"
                                    className="w-full py-4 px-6 rounded-xl font-semibold text-black bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 transition-all shadow-[0_0_30px_rgba(234,179,8,0.3)] hover:shadow-[0_0_40px_rgba(234,179,8,0.4)] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <Zap size={18} />
                                            Upgrade Now — ₹499
                                        </>
                                    )}
                                </button>

                                <p className="text-center text-xs text-gray-600 mt-4">
                                    Secured by Razorpay · 256-bit SSL encryption
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
