import { Wallet, TrendingUp, TrendingDown } from "lucide-react";
import { Card } from "../ui/Card";
import { formatCurrency } from "../../utils/cn";

export function StatsRow({ stats }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-gray-900 to-gray-900 relative overflow-hidden group">
                <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                    <Wallet size={100} className="text-neon-blue" />
                </div>
                <div className="relative z-10">
                    <h3 className="text-gray-400 text-sm font-medium mb-1">Total Balance</h3>
                    <p className="text-3xl font-bold text-white">{formatCurrency(stats.balance)}</p>
                    <div className="flex items-center gap-2 mt-4 text-emerald-400 text-sm">
                        <TrendingUp size={16} />
                        <span>Positive Net</span>
                    </div>
                </div>
            </Card>

            <Card className="border-l-4 border-l-neon-green">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-gray-400 text-sm font-medium mb-1">Income</h3>
                        <p className="text-3xl font-bold text-white">{formatCurrency(stats.income)}</p>
                    </div>
                    <div className="p-3 rounded-full bg-neon-green/10 text-neon-green">
                        <TrendingUp size={24} />
                    </div>
                </div>
            </Card>

            <Card className="border-l-4 border-l-neon-pink">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-gray-400 text-sm font-medium mb-1">Expenses</h3>
                        <p className="text-3xl font-bold text-white">{formatCurrency(stats.expenses)}</p>
                    </div>
                    <div className="p-3 rounded-full bg-neon-pink/10 text-neon-pink">
                        <TrendingDown size={24} />
                    </div>
                </div>
            </Card>
        </div>
    );
}
