import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { formatCurrency } from "../../utils/cn";
import { CHART_COLORS } from "../../constants";
import { useTheme } from "../../context/ThemeContext";

export function SpendingProfile({ spendingData, totalSpending }) {
    const { theme } = useTheme();

    return (
        <div className="rounded-xl bg-white dark:bg-[#0f1015] border border-gray-200 dark:border-white/5 p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Spending Overview</h3>
                <span className="text-xs text-gray-500 px-3 py-1 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/5 flex items-center gap-1">
                    This Month <span className="text-[10px]">▼</span>
                </span>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-6 md:h-[220px]">
                {/* Donut Chart */}
                <div className="w-full md:w-1/2 relative h-[220px] md:h-full">
                    {spendingData.length > 0 ? (
                        <>
                            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                                <PieChart>
                                    <Pie
                                        data={spendingData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={65}
                                        outerRadius={90}
                                        paddingAngle={0}
                                        dataKey="value"
                                        strokeWidth={0}
                                    >
                                        {spendingData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: theme === 'dark' ? '#111217' : '#ffffff',
                                            borderColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                                            borderRadius: '10px',
                                            padding: '8px 12px',
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                        }}
                                        itemStyle={{ color: theme === 'dark' ? '#fff' : '#111827', fontSize: '13px' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-gray-500 dark:text-gray-400 text-[11px] font-medium tracking-wide">Total Spent</span>
                                <span className="text-lg font-bold text-gray-900 dark:text-white mt-1">{formatCurrency(totalSpending)}</span>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                            No data available
                        </div>
                    )}
                </div>

                {/* Legend */}
                {spendingData.length > 0 && (
                    <div className="w-full md:w-1/2 flex flex-col justify-center gap-4 mt-2 md:mt-0">
                        {spendingData.map((item, index) => {
                            const pct = totalSpending > 0 ? Math.round((item.value / totalSpending) * 100) : 0;
                            return (
                                <div key={item.name} className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-3 h-3 rounded-full flex-shrink-0"
                                            style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                                        />
                                        <div className="flex flex-col">
                                            <span className="text-gray-900 dark:text-white font-medium text-xs mb-0.5">{item.name}</span>
                                            <span className="text-gray-500 text-[11px]">{pct}%</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-gray-700 dark:text-gray-300 text-[11px] font-medium mb-0.5">{pct}%</span>
                                        <span className="text-gray-900 dark:text-white font-semibold text-xs">{formatCurrency(item.value)}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
