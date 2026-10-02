import { Wallet, TrendingUp, TrendingDown, Percent } from "lucide-react";
import { formatCurrency } from "../../utils/cn";

export function StatsRow({ stats }) {
    const savingsRate = stats.income > 0
        ? Math.round(((stats.income - stats.expenses) / stats.income) * 100)
        : 0;

    const cards = [
        {
            label: "Total Balance",
            value: formatCurrency(stats.balance),
            icon: Wallet,
            iconColor: "text-accent",
            iconBg: "bg-emerald-50 dark:bg-[#0d2a1b]",
            changeText: "12.5% from last month",
            changeType: "positive",
        },
        {
            label: "Income",
            value: formatCurrency(stats.income),
            icon: TrendingUp,
            iconColor: "text-accent",
            iconBg: "bg-emerald-50 dark:bg-[#0d2a1b]",
            changeText: "18.3% from last month",
            changeType: "positive",
        },
        {
            label: "Expenses",
            value: formatCurrency(stats.expenses),
            icon: TrendingDown,
            iconColor: "text-neon-pink",
            iconBg: "bg-red-50 dark:bg-[#2d1417]",
            changeText: "7.2% from last month",
            changeType: "negative",
        },
        {
            label: "Savings Rate",
            value: `${savingsRate}%`,
            icon: Percent,
            iconColor: "text-accent",
            iconBg: "bg-emerald-50 dark:bg-[#0d2a1b]",
            changeText: "10% from last month",
            changeType: "positive",
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {cards.map((card) => (
                <div
                    key={card.label}
                    className="relative overflow-hidden rounded-xl bg-white dark:bg-[#0f1015] border border-gray-200 dark:border-white/5 p-5 transition-all duration-300"
                >
                    <div className="flex items-start justify-between relative z-10">
                        <div className="space-y-3">
                            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{card.label}</p>
                            <p className="text-[28px] font-bold text-gray-900 dark:text-white tracking-tight leading-none">{card.value}</p>
                            <div className="flex items-center gap-1.5 pt-1">
                                {card.changeType === "positive" ? (
                                    <span className="text-accent text-sm font-medium flex items-center gap-1">
                                        ↑ {card.changeText.split(' ')[0]}
                                    </span>
                                ) : (
                                    <span className="text-neon-pink text-sm font-medium flex items-center gap-1">
                                        ↓ {card.changeText.split(' ')[0]}
                                    </span>
                                )}
                                <span className="text-gray-500 dark:text-gray-500 text-sm">
                                    {card.changeText.substring(card.changeText.indexOf(' '))}
                                </span>
                            </div>
                        </div>

                        <div className={`w-12 h-12 rounded-xl ${card.iconBg} border border-transparent dark:border-white/5 flex items-center justify-center flex-shrink-0`}>
                            <card.icon size={22} className={card.iconColor} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
