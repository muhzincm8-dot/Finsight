import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import {
    Users, Shield, ShieldOff, Crown, UserCheck, UserX,
    ArrowLeft, RefreshCw, Search, ChevronDown, AlertCircle
} from "lucide-react";

function StatCard({ icon: Icon, label, value, color }) {
    return (
        <div className="bg-surface-dark rounded-xl p-5 border border-white/5 flex items-center gap-4">
            <div className={`w-11 h-11 rounded-lg flex items-center justify-center ${color}`}>
                <Icon size={20} className="text-white" />
            </div>
            <div>
                <p className="text-gray-500 text-xs">{label}</p>
                <p className="text-white text-2xl font-bold">{value}</p>
            </div>
        </div>
    );
}

function UserRow({ user, onToggleStatus, onToggleRole, currentUserId }) {
    const [loadingStatus, setLoadingStatus] = useState(false);
    const [loadingRole, setLoadingRole] = useState(false);

    const handleToggleStatus = async () => {
        setLoadingStatus(true);
        await onToggleStatus(user._id);
        setLoadingStatus(false);
    };

    const handleToggleRole = async () => {
        setLoadingRole(true);
        await onToggleRole(user._id);
        setLoadingRole(false);
    };

    const isSelf = user._id === currentUserId;

    return (
        <tr className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
            <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-neon-blue/20 to-purple-500/20 border border-white/10 flex items-center justify-center text-neon-blue font-bold text-sm flex-shrink-0">
                        {user.name?.[0]?.toUpperCase() || "?"}
                    </div>
                    <div>
                        <p className="text-white text-sm font-medium flex items-center gap-2">
                            {user.name}
                            {isSelf && <span className="text-xs text-gray-500 font-normal">(you)</span>}
                        </p>
                        <p className="text-gray-500 text-xs">{user.email}</p>
                    </div>
                </div>
            </td>
            <td className="px-5 py-4 hidden md:table-cell">
                <span className="text-gray-400 text-xs font-mono">
                    {user.mobileNumber || "—"}
                </span>
            </td>
            <td className="px-5 py-4">
                <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${
                    user.isActive
                        ? "bg-green-500/10 text-green-400 border border-green-500/20"
                        : "bg-red-500/10 text-red-400 border border-red-500/20"
                }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${user.isActive ? "bg-green-400" : "bg-red-400"}`}></span>
                    {user.isActive ? "Active" : "Suspended"}
                </span>
            </td>
            <td className="px-5 py-4 hidden lg:table-cell">
                <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium ${
                    user.role === 'admin'
                        ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                        : "bg-white/5 text-gray-400 border border-white/10"
                }`}>
                    {user.role === 'admin' ? <Crown size={10} /> : <Users size={10} />}
                    {user.role === 'admin' ? "Admin" : "User"}
                </span>
            </td>
            <td className="px-5 py-4 hidden lg:table-cell">
                <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium ${
                    user.hasPaid
                        ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                        : "bg-white/5 text-gray-500 border border-white/10"
                }`}>
                    {user.hasPaid ? "Premium" : "Free"}
                </span>
            </td>
            <td className="px-5 py-4 hidden xl:table-cell">
                <span className="text-gray-500 text-xs">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}
                </span>
            </td>
            <td className="px-5 py-4">
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleToggleStatus}
                        disabled={loadingStatus || isSelf}
                        title={isSelf ? "Cannot change own status" : user.isActive ? "Suspend user" : "Activate user"}
                        className={`p-1.5 rounded-lg transition-all ${
                            isSelf
                                ? "opacity-30 cursor-not-allowed"
                                : user.isActive
                                    ? "text-red-400 hover:bg-red-500/10 hover:text-red-300"
                                    : "text-green-400 hover:bg-green-500/10 hover:text-green-300"
                        } ${loadingStatus ? "animate-pulse" : ""}`}
                    >
                        {user.isActive ? <UserX size={15} /> : <UserCheck size={15} />}
                    </button>
                    <button
                        onClick={handleToggleRole}
                        disabled={loadingRole || isSelf}
                        title={isSelf ? "Cannot change own role" : user.role === 'admin' ? "Remove admin" : "Make admin"}
                        className={`p-1.5 rounded-lg transition-all ${
                            isSelf
                                ? "opacity-30 cursor-not-allowed"
                                : user.role === 'admin'
                                    ? "text-purple-400 hover:bg-purple-500/10"
                                    : "text-gray-500 hover:bg-white/5 hover:text-purple-300"
                        } ${loadingRole ? "animate-pulse" : ""}`}
                    >
                        <Shield size={15} />
                    </button>
                </div>
            </td>
        </tr>
    );
}

export default function AdminDashboard() {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all"); // all | active | suspended | premium | admin

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            setError("");
            const res = await api.get('/admin/users');
            setUsers(res.data);
        } catch (err) {
            setError(err?.response?.data?.msg || "Failed to load users.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleToggleStatus = async (userId) => {
        try {
            const res = await api.patch(`/admin/users/${userId}/toggle-status`);
            setUsers(prev => prev.map(u =>
                u._id === userId ? { ...u, isActive: res.data.isActive } : u
            ));
        } catch (err) {
            alert(err?.response?.data?.msg || "Failed to update status.");
        }
    };

    const handleToggleRole = async (userId) => {
        try {
            const res = await api.patch(`/admin/users/${userId}/make-admin`);
            setUsers(prev => prev.map(u =>
                u._id === userId ? { ...u, role: res.data.role } : u
            ));
        } catch (err) {
            alert(err?.response?.data?.msg || "Failed to update role.");
        }
    };

    const filteredUsers = users.filter(u => {
        const matchesSearch =
            u.name?.toLowerCase().includes(search.toLowerCase()) ||
            u.email?.toLowerCase().includes(search.toLowerCase());
        const matchesFilter =
            filter === "all" ? true :
            filter === "active" ? u.isActive :
            filter === "suspended" ? !u.isActive :
            filter === "premium" ? u.hasPaid :
            filter === "admin" ? u.role === 'admin' : true;
        return matchesSearch && matchesFilter;
    });

    const stats = {
        total: users.length,
        active: users.filter(u => u.isActive).length,
        suspended: users.filter(u => !u.isActive).length,
        premium: users.filter(u => u.hasPaid).length,
    };

    return (
        <div className="min-h-screen bg-dark-bg text-white">
            {/* Header */}
            <div className="border-b border-white/5 bg-surface-dark/50 backdrop-blur-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate("/")}
                            className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
                        >
                            <ArrowLeft size={18} />
                        </button>
                        <div>
                            <h1 className="text-xl font-bold flex items-center gap-2">
                                <Shield size={20} className="text-purple-400" />
                                Admin Panel
                            </h1>
                            <p className="text-gray-500 text-xs">Manage users and access</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-500 hidden sm:block">
                            Logged in as <span className="text-purple-400 font-medium">{currentUser?.name}</span>
                        </span>
                        <button
                            onClick={fetchUsers}
                            disabled={loading}
                            className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
                            title="Refresh"
                        >
                            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard icon={Users} label="Total Users" value={stats.total} color="bg-neon-blue/20" />
                    <StatCard icon={UserCheck} label="Active" value={stats.active} color="bg-green-500/20" />
                    <StatCard icon={UserX} label="Suspended" value={stats.suspended} color="bg-red-500/20" />
                    <StatCard icon={Crown} label="Premium" value={stats.premium} color="bg-yellow-500/20" />
                </div>

                {/* Table Card */}
                <div className="bg-surface-dark rounded-xl border border-white/5 overflow-hidden">
                    {/* Table Toolbar */}
                    <div className="p-4 border-b border-white/5 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                        <div className="relative flex-1 max-w-xs">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-full pl-8 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:border-neon-blue/50 transition-colors"
                            />
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                            {["all", "active", "suspended", "premium", "admin"].map(f => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`text-xs px-3 py-1.5 rounded-lg capitalize transition-colors ${
                                        filter === f
                                            ? "bg-neon-blue/20 text-neon-blue border border-neon-blue/30"
                                            : "text-gray-500 hover:text-white hover:bg-white/5"
                                    }`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="p-4 flex items-center gap-2 text-red-400 text-sm">
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    )}

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/5">
                                    <th className="px-5 py-3 text-left text-xs text-gray-500 font-medium">User</th>
                                    <th className="px-5 py-3 text-left text-xs text-gray-500 font-medium hidden md:table-cell">Phone</th>
                                    <th className="px-5 py-3 text-left text-xs text-gray-500 font-medium">Status</th>
                                    <th className="px-5 py-3 text-left text-xs text-gray-500 font-medium hidden lg:table-cell">Role</th>
                                    <th className="px-5 py-3 text-left text-xs text-gray-500 font-medium hidden lg:table-cell">Plan</th>
                                    <th className="px-5 py-3 text-left text-xs text-gray-500 font-medium hidden xl:table-cell">Joined</th>
                                    <th className="px-5 py-3 text-left text-xs text-gray-500 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <tr key={i} className="border-b border-white/5">
                                            <td colSpan={7} className="px-5 py-4">
                                                <div className="h-8 bg-white/5 rounded animate-pulse"></div>
                                            </td>
                                        </tr>
                                    ))
                                ) : filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-5 py-12 text-center text-gray-600 text-sm">
                                            {search ? "No users match your search." : "No users found."}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredUsers.map(user => (
                                        <UserRow
                                            key={user._id}
                                            user={user}
                                            onToggleStatus={handleToggleStatus}
                                            onToggleRole={handleToggleRole}
                                            currentUserId={currentUser?.id}
                                        />
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer */}
                    {!loading && (
                        <div className="px-5 py-3 border-t border-white/5 text-xs text-gray-600">
                            Showing {filteredUsers.length} of {users.length} users
                        </div>
                    )}
                </div>

                {/* Admin Note */}
                <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/10 text-xs text-gray-500 flex items-start gap-2">
                    <Shield size={14} className="text-purple-400 mt-0.5 flex-shrink-0" />
                    <span>
                        <strong className="text-purple-400">Admin tip:</strong> Suspending a user immediately blocks their access. Their existing token will be invalidated on the next API call. You cannot suspend or change your own account.
                    </span>
                </div>
            </div>
        </div>
    );
}
