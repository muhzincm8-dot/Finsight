import { Link, useLocation } from "react-router-dom";
import {
    LayoutDashboard, ArrowLeftRight, PieChart, Settings,
    Plus, Menu, X, TrendingUp, User, Bell, Moon, Sun,
    Twitter, Linkedin, Instagram, MessageSquare, Cloud
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "../ui/Button";
import { cn } from "../../utils/cn";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { NAV_ITEMS, SIDEBAR_BOTTOM_ITEMS } from "../../constants";

const ICON_MAP = { LayoutDashboard, ArrowLeftRight, PieChart, Settings };

export function Layout({ children, onAddTransaction }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [syncMinutes, setSyncMinutes] = useState(2);
    const location = useLocation();
    const { currentUser } = useAuth();
    const { theme, toggleTheme } = useTheme();

    useEffect(() => {
        const interval = setInterval(() => {
            setSyncMinutes(prev => prev < 59 ? prev + 1 : 1);
        }, 60000);
        return () => clearInterval(interval);
    }, []);

    const navItems = NAV_ITEMS.map(item => ({
        ...item,
        icon: ICON_MAP[item.icon],
    }));

    const bottomItems = SIDEBAR_BOTTOM_ITEMS.map(item => ({
        ...item,
        icon: ICON_MAP[item.icon],
    }));

    const currentPageTitle = navItems.find(i => i.path === location.pathname)?.label
        || bottomItems.find(i => i.path === location.pathname)?.label
        || "Dashboard";

    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="px-6 py-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent dark:bg-[#0d2a1b] flex items-center justify-center border border-gray-100 dark:border-white/5">
                    <TrendingUp className="w-6 h-6 text-white" strokeWidth={3} />
                </div>
                <span className="text-xl font-bold text-gray-900 dark:text-white tracking-wide">
                    FinSight
                </span>
            </div>

            {/* Main Nav */}
            <nav className="flex-1 px-4 mt-4 space-y-1">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsSidebarOpen(false)}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative",
                                isActive
                                    ? "bg-emerald-50 text-emerald-600 dark:bg-[#0d2217] dark:text-white"
                                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-sidebar-hover dark:hover:text-white"
                            )}
                        >
                            {isActive && (
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-accent rounded-l-full" />
                            )}
                            <item.icon size={20} className={isActive ? "text-accent" : ""} />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Nav */}
            <div className="px-4 pb-4 space-y-1">
                {bottomItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsSidebarOpen(false)}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 relative",
                                isActive
                                    ? "bg-emerald-50 text-emerald-600 dark:bg-[#0d2217] dark:text-white"
                                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-sidebar-hover dark:hover:text-white"
                            )}
                        >
                            {isActive && (
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-accent rounded-l-full" />
                            )}
                            <item.icon size={20} className={isActive ? "text-accent" : ""} />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}

                {/* Send Feedback */}
                <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-500 hover:text-gray-300 hover:bg-sidebar-hover transition-all duration-200 w-full mb-4">
                    <MessageSquare size={18} />
                    <span>Send Feedback</span>
                </button>

                {/* Cloud Sync Widget */}
                <div className="bg-gray-50 dark:bg-[#0b0c10] border border-gray-200 dark:border-white/5 rounded-xl p-4 mt-2">
                    <div className="flex items-center gap-2 mb-1.5">
                        <Cloud size={16} className="text-blue-500" fill="currentColor" />
                        <span className="text-[13px] font-semibold text-gray-700 dark:text-gray-200">
                            Cloud Sync <span className="text-accent">Active</span>
                        </span>
                    </div>
                    <p className="text-[12px] text-gray-500 dark:text-gray-400">Last synced {syncMinutes} min ago</p>
                    <div className="h-px bg-gray-200 dark:bg-white/5 my-3" />
                    <p className="text-[11px] text-gray-500 tracking-wide">VAULT: 65940879</p>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen flex bg-gray-50 dark:bg-dark-bg text-gray-900 dark:text-white font-sans transition-colors duration-200">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex w-64 flex-col fixed inset-y-0 left-0 bg-white dark:bg-sidebar-bg border-r border-gray-200 dark:border-white/5 z-40 transition-colors duration-200">
                <SidebarContent />
            </aside>

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div className="md:hidden fixed inset-0 z-50">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                    <aside className="relative w-64 h-full bg-sidebar-bg border-r border-white/5 animate-in slide-in-from-left duration-300">
                        <SidebarContent />
                    </aside>
                </div>
            )}

            {/* Main Content */}
            <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
                {/* Top Header Bar */}
                <header className="sticky top-0 z-30 bg-gray-50/80 dark:bg-dark-bg/80 backdrop-blur-lg">
                    <div className="px-6 lg:px-8 h-16 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            {/* Mobile hamburger */}
                            <button
                                className="md:hidden text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white p-1"
                                onClick={() => setIsSidebarOpen(true)}
                            >
                                <Menu size={22} />
                            </button>
                        </div>

                        <div className="flex items-center gap-3">
                            {(location.pathname === "/" || location.pathname === "/transactions") && (
                                <Button
                                    onClick={onAddTransaction}
                                    size="sm"
                                    className="hidden sm:flex"
                                >
                                    <Plus size={16} />
                                    Add New
                                </Button>
                            )}
                            <button className="relative p-2 text-gray-500 hover:text-gray-900 bg-white border-gray-200 dark:text-gray-400 dark:hover:text-white dark:bg-surface-dark border dark:border-white/5 rounded-full hover:border-gray-300 dark:hover:border-white/10 transition-colors w-9 h-9 flex items-center justify-center">
                                <Bell size={16} />
                                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-accent border-2 border-white dark:border-dark-bg rounded-full" />
                            </button>
                            <button onClick={toggleTheme} className="p-2 text-gray-500 hover:text-gray-900 bg-white border-gray-200 dark:text-gray-400 dark:hover:text-white dark:bg-surface-dark border dark:border-white/5 rounded-full hover:border-gray-300 dark:hover:border-white/10 transition-colors w-9 h-9 flex items-center justify-center">
                                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                            </button>
                            <Link
                                to="/profile"
                                className="flex items-center gap-2 pl-3 pr-1 py-1 rounded-full bg-white border-gray-200 dark:bg-surface-dark border dark:border-white/5 hover:border-gray-300 dark:hover:border-white/10 transition-all"
                            >
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden lg:block">{currentUser?.name || "User"}</span>
                                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-accent/30 to-emerald-800 flex items-center justify-center text-accent text-xs font-bold overflow-hidden">
                                    <img src="https://ui-avatars.com/api/?name=User&background=10b981&color=fff" alt="Avatar" className="w-full h-full object-cover" />
                                </div>
                            </Link>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto overflow-x-hidden relative">
                    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {children}
                    </div>
                </main>

                {/* Footer */}
                <footer className="w-full border-t border-gray-200 dark:border-white/5 py-6 mt-auto bg-white/30 dark:bg-surface-dark/30 transition-colors duration-200">
                    <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex flex-col items-center md:items-start gap-1">
                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                                Created by <span className="text-accent font-semibold">Muhzin CM</span>
                            </p>
                            <p className="text-gray-400 dark:text-gray-600 text-xs">
                                © {new Date().getFullYear()} FinSight. All rights reserved.
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <a href="#" className="p-2 text-gray-500 hover:text-accent hover:bg-accent/10 rounded-lg transition-all" title="X (Twitter)">
                                <Twitter size={18} />
                            </a>
                            <a href="#" className="p-2 text-gray-500 hover:text-accent hover:bg-accent/10 rounded-lg transition-all" title="LinkedIn">
                                <Linkedin size={18} />
                            </a>
                            <a href="#" className="p-2 text-gray-500 hover:text-accent hover:bg-accent/10 rounded-lg transition-all" title="Instagram">
                                <Instagram size={18} />
                            </a>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}
