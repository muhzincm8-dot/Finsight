import { AlertTriangle, Home } from "lucide-react";
import { Button } from "./Button";
import { Link } from "react-router-dom";

export function ErrorPage({ title = "System Malfunction", message = "An encrypted error occurred.", showHomeButton = true }) {
    return (
        <div className="min-h-screen bg-[#0a0a16] flex items-center justify-center p-4">
            <div className="max-w-md w-full text-center space-y-6">
                <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto border border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                    <AlertTriangle className="w-10 h-10 text-red-500" />
                </div>

                <div className="space-y-2">
                    <h1 className="text-2xl font-bold text-white">{title}</h1>
                    <p className="text-gray-400">{message}</p>
                </div>

                {showHomeButton && (
                    <Link to="/" className="inline-block">
                        <Button className="gap-2">
                            <Home size={18} />
                            Return to Dashboard
                        </Button>
                    </Link>
                )}
            </div>
        </div>
    );
}
