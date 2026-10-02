import { useState } from "react";
import { Shield, UserCheck, UserX, Crown, Users } from "lucide-react";

export function UserRow({ user, onToggleStatus, onToggleRole, currentUserId }) {
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
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent/20 to-purple-500/20 border border-white/10 flex items-center justify-center text-accent font-bold text-sm flex-shrink-0">
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
