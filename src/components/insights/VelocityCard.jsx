import { AlertCircle } from "lucide-react";
import { Card } from "../ui/Card";
import { formatCurrency } from "../../utils/cn";

export function VelocityCard({ projectedBurn, netDelta }) {
    return (
        <Card className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border-neon-blue/20">
            <div className="flex items-start gap-4">
                <div className="p-3 bg-neon-blue/10 rounded-lg text-neon-blue">
                    <AlertCircle size={24} />
                </div>
                <div>
                    <h3 className="font-bold text-lg text-white mb-1">Current Velocity</h3>
                    <p className="text-gray-400 text-sm">Estimates for the current billing cycle:</p>
                </div>
            </div>

            <div className="mt-6 space-y-4">
                <div className="flex justify-between items-center p-3 bg-black/20 rounded-lg">
                    <span className="text-gray-400">Burn Rate (Projected)</span>
                    <span className="text-neon-pink font-mono font-bold">{formatCurrency(projectedBurn)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-black/20 rounded-lg">
                    <span className="text-gray-400">Net Delta</span>
                    <span className={`font-mono font-bold ${netDelta >= 0 ? "text-neon-green" : "text-neon-pink"}`}>
                        {formatCurrency(netDelta)}
                    </span>
                </div>
            </div>
        </Card>
    );
}
