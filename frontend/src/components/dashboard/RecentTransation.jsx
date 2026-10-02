import { Link } from "react-router-dom";
import { formatCurrency, formatDate } from "../../utils/cn";

export function RecentTransactions({ transactions }) {
    const getIconInfo = (category) => {
        const c = category?.toLowerCase() || "";
        if (c.includes("grocer") || c.includes("food") || c.includes("shop")) return { color: "text-accent", bg: "bg-emerald-50 dark:bg-[#1a1b23]" };
        if (c.includes("salary") || c.includes("income")) return { color: "text-purple-500", bg: "bg-purple-50 dark:bg-[#1a1b23]" };
        if (c.includes("transport") || c.includes("fuel")) return { color: "text-orange-500", bg: "bg-orange-50 dark:bg-[#1a1b23]" };
        if (c.includes("entertain") || c.includes("movie")) return { color: "text-pink-500", bg: "bg-pink-50 dark:bg-[#1a1b23]" };
        return { color: "text-gray-500 dark:text-gray-400", bg: "bg-gray-50 dark:bg-[#1a1b23]" };
    };

    return (
        <div className="rounded-xl bg-white dark:bg-[#0f1015] border border-gray-200 dark:border-white/5 overflow-hidden h-full flex flex-col">
            <div className="p-6 border-b border-gray-100 dark:border-white/5 flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Transactions</h3>
                <Link
                    to="/transactions"
                    className="text-xs font-medium text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-4 py-1.5 rounded-full border border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 transition-all"
                >
                    View All
                </Link>
            </div>

            <div className="flex-1 overflow-y-auto">
                {transactions.length > 0 ? (
                    <div className="divide-y divide-gray-100 dark:divide-white/5">
                        {transactions.map((t) => {
                            const iconInfo = getIconInfo(t.category);
                            return (
                                <div key={t.id} className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors group">
                                    {/* Category icon box */}
                                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 border border-transparent dark:border-white/5 ${iconInfo.bg} ${iconInfo.color}`}>
                                        <span className="text-base font-bold">{t.category?.[0] || "?"}</span>
                                    </div>

                                    {/* Description + Date & Time */}
                                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate mb-1">
                                            {t.description}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {formatDate(t.date, true)}
                                        </p>
                                    </div>

                                    {/* Amount + Category */}
                                    <div className="flex flex-col items-end justify-center flex-shrink-0">
                                        <span className={`text-sm font-semibold mb-1 ${
                                            t.type === 'income' ? 'text-accent' : 'text-neon-pink'
                                        }`}>
                                            {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {t.category}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="p-8 text-center text-gray-500 text-sm">
                        No transactions yet.
                    </div>
                )}
            </div>
        </div>
    );
}
