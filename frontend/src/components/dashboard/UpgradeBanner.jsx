import { Sparkles, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export function UpgradeBanner() {
    const { currentUser } = useAuth();

    if (currentUser?.hasPaid) return null;

    return (
        <div className="relative overflow-hidden rounded-2xl bg-emerald-50/50 dark:bg-[#090b0a] border border-emerald-100 dark:border-white/5 flex flex-col md:flex-row items-center px-6 md:px-8 py-6 md:py-0 md:h-[140px] mt-6 text-center md:text-left transition-colors duration-200">
            {/* Intensive Green Glow on the left */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-accent/10 dark:bg-accent/30 rounded-full blur-[80px] pointer-events-none transition-colors duration-200" />
            
            {/* Background pattern (cubes/grid subtle) */}
            <div className="absolute left-10 top-0 bottom-0 w-64 opacity-20 pointer-events-none" style={{
                backgroundImage: 'radial-gradient(circle at center, rgba(16, 185, 129, 0.4) 0%, transparent 70%)'
            }}></div>

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between w-full h-full gap-6 md:gap-0">
                <div className="flex flex-col md:flex-row items-center gap-4 md:gap-10 h-full">
                    {/* CSS Art: Credit Card Graphic */}
                    <div className="relative w-32 h-20 perspective-[1000px] transform -rotate-12 md:translate-y-2 ml-0 md:ml-4 hidden sm:block">
                        {/* Shadow */}
                        <div className="absolute -bottom-6 -right-2 w-32 h-10 bg-black/50 blur-xl rounded-full"></div>
                        
                        {/* The Card */}
                        <div className="w-full h-full rounded-xl bg-gradient-to-br from-[#1b2b24] to-[#0a120e] border border-white/10 shadow-2xl p-2.5 flex flex-col justify-between relative overflow-hidden backdrop-blur-md">
                            {/* Card Chip */}
                            <div className="w-6 h-4 rounded-[4px] border border-white/20 bg-white/5 flex gap-[1px] p-[2px]">
                                <div className="w-1/2 h-full border-r border-white/20"></div>
                                <div className="w-1/2 h-full"></div>
                            </div>
                            
                            {/* Card Details lines */}
                            <div className="space-y-1.5 opacity-40">
                                <div className="w-3/4 h-1.5 rounded-full bg-white/40"></div>
                                <div className="w-1/2 h-1.5 rounded-full bg-white/20"></div>
                            </div>
                            
                            {/* Card accent glow */}
                            <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-accent/40 blur-xl rounded-full"></div>
                            
                            {/* Green floating cube 1 */}
                            <div className="absolute -right-6 top-2 w-4 h-4 bg-accent rounded-sm shadow-[0_0_10px_rgba(16,185,129,0.5)] transform rotate-12"></div>
                        </div>
                        
                        {/* Green floating cube 2 */}
                        <div className="absolute -left-4 bottom-2 w-6 h-6 bg-emerald-700/80 rounded-sm shadow-[0_0_15px_rgba(16,185,129,0.3)] backdrop-blur-md border border-white/10 transform -rotate-12"></div>
                    </div>

                    <div className="flex flex-col justify-center">
                        <h3 className="text-[17px] font-bold text-gray-900 dark:text-white mb-1.5 tracking-wide">Upgrade to FinSight Premium</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-[13px] leading-relaxed max-w-md mx-auto md:mx-0">
                            Get advanced insights, custom reports and more to manage your finances like a pro.
                        </p>
                    </div>
                </div>

                <Link
                    to="/upgrade"
                    className="flex items-center justify-center gap-2.5 px-6 py-2.5 bg-white dark:bg-transparent border border-accent text-accent hover:bg-accent hover:text-white dark:hover:bg-accent/10 rounded-full transition-all duration-300 font-medium text-sm flex-shrink-0 group w-full md:w-auto shadow-sm dark:shadow-none"
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                        <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"></path>
                    </svg>
                    Upgrade Now
                    <ChevronRight size={16} className="text-accent dark:text-gray-400 group-hover:translate-x-0.5 transition-transform ml-2" />
                </Link>
            </div>
        </div>
    );
}
