import { useNavigate } from "react-router-dom";
import {
    Users, Shield, Crown, UserCheck, UserX,
    ArrowLeft, RefreshCw, Search, AlertCircle
} from "lucide-react";
import { useAdminUsers } from "../hooks/useAdminUsers";
import { AdminStatCard } from "../components/admin/AdminStatCard";
import { UserRow } from "../components/admin/UserRow";

export default function AdminDashboard() {
    const navigate = useNavigate();
    const {
        currentUser,
        loading,
        error,
        search,
        setSearch,
        filter,
        setFilter,
        filterOptions,
        fetchUsers,
        handleToggleStatus,
        handleToggleRole,
        filteredUsers,
        stats,
        users,
    } = useAdminUsers();

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
                    <AdminStatCard icon={Users} label="Total Users" value={stats.total} color="bg-accent/20" />
                    <AdminStatCard icon={UserCheck} label="Active" value={stats.active} color="bg-green-500/20" />
                    <AdminStatCard icon={UserX} label="Suspended" value={stats.suspended} color="bg-red-500/20" />
                    <AdminStatCard icon={Crown} label="Premium" value={stats.premium} color="bg-yellow-500/20" />
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
                                className="w-full pl-8 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:border-accent/50 transition-colors"
                            />
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                            {filterOptions.map(f => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`text-xs px-3 py-1.5 rounded-lg capitalize transition-colors ${
                                        filter === f
                                            ? "bg-accent/20 text-accent border border-accent/30"
                                            : "text-gray-500 hover:text-white hover:bg-white/5"
                                    }`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>

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
