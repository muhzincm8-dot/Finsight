import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useBudget } from "../context/BudgetContext";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Modal } from "../components/ui/Modal";
import { User, LogOut, Shield, Mail, Phone, Camera, Edit2, Check, Download, Lock, Crown, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { downloadTransactionsCSV } from "../services/exportService";

export default function Profile() {
    const { currentUser, logout, updateProfile } = useAuth();
    const { transactions } = useBudget();
    const navigate = useNavigate();

    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(currentUser?.name || "");
    const [phoneNumber, setPhoneNumber] = useState(currentUser?.mobileNumber || "");
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState("");
    const [profileImage, setProfileImage] = useState(null);
    const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);

    // 2FA State
    const [is2FAEnabled, setIs2FAEnabled] = useState(false);
    const [isOTPModalOpen, setIsOTPModalOpen] = useState(false);
    const [otp, setOtp] = useState("");
    const [otpError, setOtpError] = useState("");

    const fileInputRef = useRef(null);

    // Sync local state when currentUser changes (fixes profile bug)
    useEffect(() => {
        if (currentUser) {
            setName(currentUser.name || "");
            setPhoneNumber(currentUser.mobileNumber || "");
        }
    }, [currentUser]);

    const handle2FAToggle = () => {
        if (is2FAEnabled) {
            setIs2FAEnabled(false);
        } else {
            setOtp("");
            setOtpError("");
            setIsOTPModalOpen(true);
        }
    };

    const handleVerifyOTP = () => {
        if (otp.length === 6 && /^\d+$/.test(otp)) {
            setIs2FAEnabled(true);
            setIsOTPModalOpen(false);
        } else {
            setOtpError("Please enter a valid 6-digit code.");
        }
    };

    async function handleLogout() {
        try {
            await logout();
            navigate("/login");
        } catch {
            console.error("Failed to log out");
        }
    }

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setProfileImage(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleEditToggle = async () => {
        if (isEditing) {
            try {
                setSaveError("");
                setIsSaving(true);
                await updateProfile({ name, mobileNumber: phoneNumber });
            } catch (err) {
                console.error("Failed to update profile", err);
                setSaveError("Failed to save changes. Please try again.");
                setIsSaving(false);
                return;
            }
            setIsSaving(false);
        }
        setIsEditing(!isEditing);
    };

    const handleDataExport = () => {
        downloadTransactionsCSV(transactions, "finsight_export");
    };

    const isPremium = currentUser?.hasPaid;

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">User Profile</h1>
                <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 text-accent hover:bg-accent/10"
                    onClick={handleEditToggle}
                    disabled={isSaving}
                >
                    {isEditing ? <Check size={18} /> : <Edit2 size={18} />}
                    {isSaving ? "Saving..." : isEditing ? "Save Changes" : "Edit Profile"}
                </Button>
            </div>

            {saveError && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    {saveError}
                </div>
            )}

            {/* Premium Banner */}
            {isPremium ? (
                <div className="p-4 rounded-xl bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-500/10 dark:to-amber-500/10 border border-yellow-200 dark:border-yellow-500/30 flex items-center gap-3">
                    <Crown size={20} className="text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
                    <div>
                        <p className="text-yellow-800 dark:text-yellow-300 font-semibold text-sm">Premium Member — Lifetime Access</p>
                        <p className="text-yellow-600 dark:text-yellow-500/70 text-xs">
                            Unlocked on {currentUser?.paymentDate ? new Date(currentUser.paymentDate).toLocaleDateString() : "—"}
                        </p>
                    </div>
                </div>
            ) : (
                <div
                    className="p-4 rounded-xl bg-gradient-to-r from-accent/5 to-purple-500/5 border border-accent/20 flex items-center justify-between gap-3 cursor-pointer hover:border-accent/40 transition-colors"
                    onClick={() => navigate("/upgrade")}
                >
                    <div className="flex items-center gap-3">
                        <Zap size={20} className="text-accent flex-shrink-0" />
                        <div>
                            <p className="text-gray-900 dark:text-white font-semibold text-sm">Upgrade to Premium</p>
                            <p className="text-gray-500 text-xs">One-time payment for lifetime access</p>
                        </div>
                    </div>
                    <Button size="sm" className="flex-shrink-0">Upgrade — ₹499</Button>
                </div>
            )}

            <Card className="relative overflow-hidden">
                <div className="absolute top-0 right-0 p-32 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                <div className="flex flex-col md:flex-row items-center gap-6 mb-8 relative z-10">
                    <div className="relative group">
                        <div className="w-24 h-24 rounded-full bg-white dark:bg-surface-dark border-2 border-accent/30 flex items-center justify-center text-accent shadow-[0_0_20px_rgba(0,243,255,0.2)] overflow-hidden">
                            {profileImage ? (
                                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <User size={40} />
                            )}
                        </div>
                        {isEditing && (
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            >
                                <Camera size={24} className="text-white" />
                            </button>
                        )}
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageUpload}
                        />
                    </div>
                    <div className="text-center md:text-left flex-1">
                        {isEditing ? (
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="bg-transparent border-b border-gray-300 dark:border-white/20 outline-none text-gray-900 dark:text-white text-2xl font-bold w-full px-1 focus:border-accent mb-1"
                                placeholder="Your name"
                            />
                        ) : (
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                                {currentUser?.name || "User"}
                            </h2>
                        )}
                        <div className="flex flex-col gap-2 mt-2">
                            <div className="flex items-center gap-2 text-gray-400 justify-center md:justify-start">
                                <Mail size={14} />
                                <span>{currentUser?.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-400 justify-center md:justify-start">
                                <Phone size={14} />
                                {isEditing ? (
                                    <input
                                        type="tel"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        className="bg-transparent border-b border-gray-300 dark:border-white/20 outline-none text-gray-900 dark:text-white w-[160px] px-1 focus:border-accent"
                                        placeholder="Phone number"
                                    />
                                ) : (
                                    <span>{currentUser?.mobileNumber || "Not set"}</span>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-2 mt-3 justify-center md:justify-start flex-wrap">
                            <div className="flex items-center gap-1.5 text-neon-green text-xs font-mono">
                                <Shield size={12} />
                                <span>Verified Citizen</span>
                            </div>
                            {isPremium && (
                                <div className="flex items-center gap-1.5 text-yellow-400 text-xs font-mono">
                                    <Crown size={12} />
                                    <span>Premium</span>
                                </div>
                            )}
                            {currentUser?.role === 'admin' && (
                                <div className="flex items-center gap-1.5 text-purple-400 text-xs font-mono">
                                    <Shield size={12} />
                                    <span>Admin</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-6 border-t border-gray-200 dark:border-white/5 pt-6 relative z-10">
                    <div className="grid gap-4">
                        <div className="p-4 rounded-lg bg-gray-50 dark:bg-surface-dark border border-gray-200 dark:border-white/5 flex justify-between items-center group hover:border-accent/30 transition-colors">
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                                    <Lock size={16} className="text-accent" /> Security Level
                                </p>
                                <p className="text-sm text-gray-500">Standard Encryption</p>
                            </div>
                            <Button variant="outline" size="sm" onClick={() => setIsSecurityModalOpen(true)}>Manage</Button>
                        </div>

                        <div className="p-4 rounded-lg bg-gray-50 dark:bg-surface-dark border border-gray-200 dark:border-white/5 flex justify-between items-center group hover:border-accent/30 transition-colors">
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                                    <Download size={16} className="text-neon-pink" /> Data Export
                                </p>
                                <p className="text-sm text-gray-500">Download your vault data</p>
                            </div>
                            <Button variant="outline" size="sm" onClick={handleDataExport}>Download</Button>
                        </div>

                        {currentUser?.role === 'admin' && (
                            <div
                                className="p-4 rounded-lg bg-purple-50 dark:bg-purple-500/5 border border-purple-200 dark:border-purple-500/20 flex justify-between items-center group hover:border-purple-500/40 transition-colors cursor-pointer"
                                onClick={() => navigate("/admin")}
                            >
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                                        <Shield size={16} className="text-purple-400" /> Admin Panel
                                    </p>
                                    <p className="text-sm text-gray-500">Manage users and settings</p>
                                </div>
                                <Button variant="outline" size="sm" className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10">Open</Button>
                            </div>
                        )}
                    </div>

                    <div className="pt-4 flex justify-end">
                        <Button onClick={handleLogout} variant="danger" className="gap-2">
                            <LogOut size={18} />
                            Sign Out
                        </Button>
                    </div>
                </div>
            </Card>

            <Modal isOpen={isSecurityModalOpen} onClose={() => setIsSecurityModalOpen(false)} title="Security Settings">
                <div className="space-y-4">
                    <div className="p-4 bg-gray-50 dark:bg-surface-dark rounded-lg border border-gray-200 dark:border-accent/20">
                        <h4 className="font-bold text-gray-900 dark:text-white mb-1">Encryption Strength</h4>
                        <p className="text-sm text-gray-400">Current Level: <span className="text-accent">AES-256 (Standard)</span></p>
                    </div>
                    <div className="space-y-2">
                        <label className="flex items-center justify-between p-3 rounded hover:bg-white/5 cursor-pointer">
                            <span className="text-gray-300">Two-Factor Authentication</span>
                            <input
                                type="checkbox"
                                className="accent-accent w-4 h-4"
                                checked={is2FAEnabled}
                                onChange={handle2FAToggle}
                            />
                        </label>
                    </div>
                    <div className="pt-4">
                        <Button className="w-full" onClick={() => setIsSecurityModalOpen(false)}>Update Security Protocols</Button>
                    </div>
                </div>
            </Modal>

            {/* OTP Verification Modal */}
            <Modal isOpen={isOTPModalOpen} onClose={() => setIsOTPModalOpen(false)} title="Verify Identity">
                <div className="space-y-4">
                    <p className="text-gray-400 text-sm">
                        Please enter the 6-digit verification code sent to your device to enable Two-Factor Authentication.
                    </p>

                    <div className="space-y-2">
                        <Input
                            placeholder="000000"
                            value={otp}
                            onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                                setOtp(val);
                                setOtpError("");
                            }}
                            className="text-center text-2xl tracking-[0.5em] font-mono h-14"
                            maxLength={6}
                        />
                        {otpError && (
                            <p className="text-red-500 text-xs text-center">{otpError}</p>
                        )}
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => setIsOTPModalOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="flex-1"
                            onClick={handleVerifyOTP}
                        >
                            Verify & Enable
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
