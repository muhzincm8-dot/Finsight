import { Loader2 } from "lucide-react";
import { cn } from "../../utils/cn";

const variants = {
    primary: "bg-accent text-white hover:bg-accent-light shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.4)]",
    outline: "border border-accent/50 text-accent hover:bg-accent/10",
    ghost: "text-gray-400 hover:text-white hover:bg-white/5",
    danger: "bg-red-500/10 text-red-400 border border-red-500/50 hover:bg-red-500/20 hover:text-red-300",
};

export function Button({ className, variant = "primary", size = "md", isLoading, children, ...props }) {
    const sizeClasses = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-5 py-2.5",
        lg: "px-6 py-3 text-lg",
        icon: "p-2",
    };

    return (
        <button
            className={cn(
                "rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:pointer-events-none",
                variants[variant],
                sizeClasses[size],
                className
            )}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {children}
        </button>
    );
}
