import { useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useBudget } from "../context/BudgetContext";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Modal } from "../components/ui/Modal";
import { User, LogOut, Shield, Mail, Phone, Camera, Edit2, Check, Download, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
    const { currentUser, logout } = useAuth();
    const { transactions } = useBudget();
    const navigate = useNavigate();

    const [isEditing, setIsEditing] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState(currentUser?.mobileNumber || "+91 (10) 00000000");
    const [profileImage, setProfileImage] = useState(null);
    const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);

    // 2FA State
    const [is2FAEnabled, setIs2FAEnabled] = useState(false);
    const [isOTPModalOpen, setIsOTPModalOpen] = useState(false);
    const [otp, setOtp] = useState("");
    const [otpError, setOtpError] = useState("");

    const fileInputRef = useRef(null);

    const handle2FAToggle = () => {
        if (is2FAEnabled) {
            // If already enabled, just turn it off
            setIs2FAEnabled(false);
        } else {
            // If disabled, open OTP modal to verify
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
            const Reader = new FileReader();
            Reader.onload = (e) => {
                setProfileImage(e.target.result);
            };
            Reader.readAsDataURL(file);
        }
    };

    const handleDataExport = () => {
        const headers = ["Date", "Description", "Category", "Type", "Amount"];
        const csvContent = [
            headers.join(","),
            ...transactions.map(t => [
                t.date,
                `"${t.description.replace(/"/g, '""')}"`,
                t.category,
                t.type,
                t.amount
            ].join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `vault_export_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">User Profile</h1>
                <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 text-neon-blue hover:bg-neon-blue/10"
                    onClick={() => setIsEditing(!isEditing)}
                >
                    {isEditing ? <Check size={18} /> : <Edit2 size={18} />}
                    {isEditing ? "Save Changes" : "Edit Profile"}
                </Button>
            </div>

            <Card className="relative overflow-hidden">
                <div className="absolute top-0 right-0 p-32 bg-neon-blue/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                <div className="flex flex-col md:flex-row items-center gap-6 mb-8 relative z-10">
                    <div className="relative group">
                        <div className="w-24 h-24 rounded-full bg-surface-dark border-2 border-neon-blue/30 flex items-center justify-center text-neon-blue shadow-[0_0_20px_rgba(0,243,255,0.2)] overflow-hidden">
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
                        <h2 className="text-2xl font-bold text-white mb-1">
                            {currentUser?.name || currentUser?.displayName || "User"}
                        </h2>
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
                                        className="bg-transparent border-b border-white/20 outline-none text-white w-[140px] px-1 focus:border-neon-blue"
                                    />
                                ) : (
                                    <span>{currentUser?.mobileNumber || phoneNumber}</span>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-neon-green text-xs mt-3 justify-center md:justify-start font-mono">
                            <Shield size={12} />
                            <span>Verified Citizen</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-6 border-t border-white/5 pt-6 relative z-10">
                    <div className="grid gap-4">
                        <div className="p-4 rounded-lg bg-surface-dark border border-white/5 flex justify-between items-center group hover:border-neon-blue/30 transition-colors">
                            <div>
                                <p className="font-medium text-white flex items-center gap-2">
                                    <Lock size={16} className="text-neon-blue" /> Security Level
                                </p>
                                <p className="text-sm text-gray-500">Standard Encryption</p>
                            </div>
                            <Button variant="outline" size="sm" onClick={() => setIsSecurityModalOpen(true)}>Manage</Button>
                        </div>

                        <div className="p-4 rounded-lg bg-surface-dark border border-white/5 flex justify-between items-center group hover:border-neon-blue/30 transition-colors">
                            <div>
                                <p className="font-medium text-white flex items-center gap-2">
                                    <Download size={16} className="text-neon-pink" /> Data Export
                                </p>
                                <p className="text-sm text-gray-500">Download your vault data</p>
                            </div>
                            <Button variant="outline" size="sm" onClick={handleDataExport}>Download</Button>
                        </div>
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
                    <div className="p-4 bg-surface-dark rounded-lg border border-neon-blue/20">
                        <h4 className="font-bold text-white mb-1">Encryption Strength</h4>
                        <p className="text-sm text-gray-400">Current Level: <span className="text-neon-blue">AES-256 (Standard)</span></p>
                    </div>
                    <div className="space-y-2">
                        <label className="flex items-center justify-between p-3 rounded hover:bg-white/5 cursor-pointer">
                            <span className="text-gray-300">Two-Factor Authentication</span>
                            <input
                                type="checkbox"
                                className="accent-neon-blue w-4 h-4"
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
