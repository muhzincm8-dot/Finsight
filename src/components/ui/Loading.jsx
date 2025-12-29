import { RotateCw } from "lucide-react";

export function Loading() {
    return (
        <div className="fixed inset-0 bg-[#0a0a16] flex items-center justify-center z-[1000]">
            <div className="flex flex-col items-center gap-4">
                <RotateCw className="w-12 h-12 text-neon-blue animate-spin" />
                <p className="text-gray-400 text-sm animate-pulse uppercase tracking-widest">Loading Vault...</p>
            </div>
        </div>
    );
}
