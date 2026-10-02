import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card } from "../components/ui/Card";
import { TrendingUp, Lock, Mail, AlertCircle, User } from "lucide-react";

export default function Signup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [mobileNumber, setMobileNumber] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { signup } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        if (password !== confirmPassword) {
            return setError("Passwords do not match");
        }

        try {
            setError("");
            setLoading(true);
            await signup(email, password, name, mobileNumber);
            navigate("/");
        } catch (err) {
            setError("Failed to create an account. " + err.message);
            console.error(err);
        }
        setLoading(false);
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg p-4 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-emerald-50 via-gray-50 to-gray-50 dark:from-emerald-900/20 dark:via-dark-bg dark:to-dark-bg">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-[0_0_30px_rgba(16,185,129,0.3)] mb-4">
                        <TrendingUp className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Create Account
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400">Join the future of finance</p>
                </div>

                <Card className="border-t-2 border-t-accent w-full border-gray-200 dark:border-white/5 dark:border-t-accent">
                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-400 text-sm">
                            <AlertCircle size={18} />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            label="Full Name"
                            type="text"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            icon={User}
                            required
                        />

                        <Input
                            label="Email"
                            type="email"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            icon={Mail}
                            required
                        />

                        <Input
                            label="Mobile Number"
                            type="tel"
                            placeholder="+1 234 567 890"
                            value={mobileNumber}
                            onChange={(e) => setMobileNumber(e.target.value)}
                            icon={User}
                            required
                        />

                        <Input
                            label="Password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            icon={Lock}
                            required
                        />

                        <Input
                            label="Confirm Password"
                            type="password"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            icon={Lock}
                            required
                        />

                        <Button className="w-full shadow-lg shadow-accent/20" disabled={loading}>
                            {loading ? "Creating Account..." : "Create Account"}
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-500">
                        Already have an account?{" "}
                        <Link to="/login" className="text-accent hover:text-emerald-700 dark:hover:text-white font-medium transition-colors">
                            Sign in
                        </Link>
                    </div>
                </Card>
            </div>
        </div>
    );
}
