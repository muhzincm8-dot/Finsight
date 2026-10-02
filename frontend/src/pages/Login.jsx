import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card } from "../components/ui/Card";
import { TrendingUp, Lock, Mail, AlertCircle, ShieldOff } from "lucide-react";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Check if redirected here due to account suspension
    const isSuspended = location.state?.suspended;

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            setError("");
            setLoading(true);
            await login(email, password);
            navigate("/");
        } catch (err) {
            const status = err?.response?.status;
            const serverMsg = err?.response?.data?.msg;
            if (status === 403) {
                setError(serverMsg || "Your account has been suspended. Please contact support.");
            } else {
                setError("Failed to sign in. Please check your credentials.");
            }
            console.error(err);
        }
        setLoading(false);
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg p-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50/50 via-gray-50 to-gray-50 dark:from-indigo-900/20 dark:via-dark-bg dark:to-dark-bg">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-[0_0_30px_rgba(16,185,129,0.3)] mb-4">
                        <TrendingUp className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Welcome Back
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400">Access your financial dashboard</p>
                </div>

                <Card className="border-t-2 border-t-accent w-full border-gray-200 dark:border-white/5 dark:border-t-accent">
                    {isSuspended && !error && (
                        <div className="mb-6 p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg flex items-center gap-3 text-orange-400 text-sm">
                            <ShieldOff size={18} />
                            Your session was ended because your account was suspended.
                        </div>
                    )}

                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-400 text-sm">
                            <AlertCircle size={18} />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            label="Email"
                            type="email"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            icon={Mail}
                            required
                        />

                        <div className="space-y-1">
                            <Input
                                label="Password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                icon={Lock}
                                required
                            />
                            <div className="flex justify-end">
                                <Link to="#" className="text-xs text-accent hover:text-emerald-700 dark:hover:text-white transition-colors">
                                    Forgot password?
                                </Link>
                            </div>
                        </div>

                        <Button className="w-full shadow-lg shadow-accent/20" disabled={loading}>
                            {loading ? "Signing In..." : "Sign In"}
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-500">
                        Don't have an account?{" "}
                        <Link to="/signup" className="text-accent hover:text-emerald-700 dark:hover:text-white font-medium transition-colors">
                            create one
                        </Link>
                    </div>
                </Card>
            </div>
        </div>
    );
}
