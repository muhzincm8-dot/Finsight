import { cn } from "../../utils/cn";

export function Card({ className, children, ...props }) {
    return (
        <div
            className={cn(
                "rounded-xl bg-white dark:bg-surface-dark p-6 border border-gray-200 dark:border-white/5 hover:border-gray-300 dark:hover:border-accent/10 transition-all duration-300",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}
