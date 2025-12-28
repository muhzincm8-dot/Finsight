import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, WalletCards, PieChart, Plus, Menu, X, TrendingUp, User } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/Button";
import { cn } from "../../utils/cn";

export function Layout({ children, onAddTransaction }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();

    const navItems = [
        { label: "Dashboard", icon: LayoutDashboard },
        { label: "Transactions", icon: WalletCards },
        { label: "Insights",  icon: PieChart },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-dark-bg text-white font-sans overflow-x-hidden">
            {/* Top Horizontal Navbar */}
            <nav className="sticky top-0 z-50 w-full bg-surface-dark/80 backdrop-blur-lg border-b border-white/5">
                <div className="max-w-[1920px] mx-auto px-6 h-20 flex items-center justify-between">

                    {/* Left: Logo & Brand */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-blue to-blue-600 flex items-center justify-center shadow-lg shadow-neon-blue/20">
                            <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neon-blue to-white tracking-wide">
                            FinSight
                        </span>
                    </div>

                    {/* Center: Navigation Links (Desktop) */}
                    <div className="hidden md:flex items-center gap-12 absolute left-1/2 -translate-x-1/2">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={cn(
                                    "text-sm font-medium transition-all duration-200 hover:text-white flex items-center gap-2",
                                    location.pathname === item.path
                                        ? "text-neon-blue"
                                        : "text-gray-400"
                                )}
                            >
                                {/* Optional: Show icon on desktop or just text? Image suggests text primarily, but we can keep standard links */}
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    {/* Right: Actions & Status */}
                    <div className="hidden md:flex items-center gap-6">
                        <div className="text-right hidden lg:block">
                            <p className="text-[10px] text-gray-500 uppercase tracking-wider font-mono">Vault: 05940879</p>
                            <div className="flex items-center justify-end gap-1.5 text-neon-blue text-xs font-mono">
                                <span className="relative flex h-1.5 w-1.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-blue opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-neon-blue"></span>
                                </span>
                                Cloud Sync Active
                            </div>
                        </div>

                        {/* <Link to="/profile" className="w-10 h-10 rounded-full bg-surface-dark border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-neon-blue/50 hover:shadow-[0_0_15px_rgba(0,243,255,0.2)] transition-all"> */}
                            {/* <User size={20} /> */}
                        {/* </Link> */}
                        {/* {location.pathname === "/" && ( */}
                            {/* <Button
                                onClick={onAddTransaction}
                                size="sm"
                                className="shadow-none border border-neon-blue/30 bg-neon-blue/10 text-neon-blue hover:bg-neon-blue hover:text-dark-bg transition-all"
                            >
                                <Plus size={18} />
                                Add New
                            </Button>
                        )} */}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <div className="flex md:hidden items-center gap-4">
                        {location.pathname === "/" && (
                            <Button onClick={onAddTransaction} size="icon" variant="ghost" className="text-neon-blue">
                                <Plus size={20} />
                            </Button>
                        )}
                        <button
                            className="text-gray-400 hover:text-white"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation Dropdown */}
                <div className={cn(
                    "md:hidden overflow-hidden transition-all duration-300 ease-in-out border-b border-white/5 bg-surface-dark",
                    isMobileMenuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
                )}>
                    <div className="p-4 space-y-2">
                        {navItems.map((item) => (
                            <div
                                key={item.path}
                                to={item.path}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                                    location.pathname === item.path
                                        ? "bg-neon-blue/10 text-neon-blue"
                                        : "text-gray-400 hover:bg-white/5 hover:text-white"
                                )}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <item.icon size={18} />
                                <span className="font-medium">{item.label}</span>
                            </div>
                        ))}
                        <div className="pt-4 mt-4 border-t border-white/5 flex justify-between items-center px-4">
                            <span className="text-xs text-gray-500">Vault: 05940879</span>
                            <span className="text-xs text-neon-blue flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-neon-blue rounded-full"></span>
                                Sync Active
                            </span>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content Area */}
            <main className="flex-1 p-4 md:p-8 lg:p-12 overflow-y-auto">
                <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {children}
                </div>
            </main>
        </div>
    );
}
