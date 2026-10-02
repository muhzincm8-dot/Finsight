import { ResponsiveContainer, BarChart, XAxis, Tooltip, Bar, Cell } from "recharts";
import { Activity } from "lucide-react";
import { formatCurrency } from "../../utils/cn";
import { useTheme } from "../../context/ThemeContext";

export function BudgetHealth({ spendingPercentage, budgetGoal, chartData }) {
    const { theme } = useTheme();

    return (
        <div className="rounded-xl bg-white dark:bg-[#0f1015] border border-gray-200 dark:border-white/5 p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Budget Health</h3>
                <span className={`text-xl font-bold ${spendingPercentage > 90 ? 'text-neon-pink' : 'text-accent'}`}>
                    {spendingPercentage.toFixed(1)}%
                </span>
            </div>

            <div className="space-y-6 flex-1 flex flex-col">
                {/* Progress Bar */}
                <div>
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
                        <span>Monthly Spending Goal ({formatCurrency(budgetGoal)})</span>
                        <span className={spendingPercentage > 90 ? 'text-neon-pink' : 'text-accent'}>
                            {spendingPercentage.toFixed(0)}% used
                        </span>
                    </div>
                    <div className="h-3 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all duration-1000 ${
                                spendingPercentage > 90
                                    ? 'bg-gradient-to-r from-neon-pink to-red-600'
                                    : 'bg-gradient-to-r from-accent to-emerald-400'
                            }`}
                            style={{ width: `${spendingPercentage}%` }}
                        />
                    </div>
                </div>

                {/* Cashflow Chart */}
                <div className="flex-1 flex flex-col justify-end">
                    <h4 className="text-sm text-gray-500 dark:text-gray-400 mb-4 font-medium flex items-center gap-2">
                        <Activity size={16} className="text-accent" /> Cashflow Trends
                    </h4>
                    <div className="w-full relative" style={{ height: 200 }}>
                        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                            <BarChart data={chartData}>
                                <XAxis
                                    dataKey="name"
                                    stroke="#4B5563"
                                    fontSize={11}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: theme === 'dark' ? '#0f2a1e' : '#ecfdf5',
                                        borderColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(16,185,129,0.2)',
                                        borderRadius: '10px',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                    }}
                                    itemStyle={{ color: theme === 'dark' ? '#fff' : '#064e3b' }}
                                    cursor={{ fill: 'rgba(16,185,129,0.05)' }}
                                />
                                <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                                    {chartData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={index % 2 === 0 ? '#10b981' : 'rgba(16,185,129,0.2)'}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
