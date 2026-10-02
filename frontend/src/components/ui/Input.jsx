import { cn } from "../../utils/cn";

export function Input({ className, label, error, icon: Icon, ...props }) {
    return (
        <div className="w-full space-y-1">
            {label && <label className="text-xs font-medium text-gray-500 dark:text-gray-400 ml-1 uppercase tracking-wider">{label}</label>}
            <div className="relative group">
                {Icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-accent transition-colors">
                        <Icon size={18} />
                    </div>
                )}
                <input
                    className={cn(
                        "w-full bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 outline-none transition-all duration-300 focus:border-accent/50 focus:shadow-[0_0_10px_rgba(16,185,129,0.1)]",
                        Icon && "pl-10",
                        error && "border-red-500/50 focus:border-red-500",
                        className
                    )}
                    {...props}
                />
            </div>
            {error && <p className="text-xs text-red-400 ml-1">{error}</p>}
        </div>
    );
}
