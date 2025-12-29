import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { Card } from "../ui/Card";
import { formatCurrency } from "../../utils/cn";

export function SpendingProfile({ spendingData, totalSpending }) {
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#b026ff', '#ff00ff'];

    return (
        <Card className="flex flex-col">
            <h3 className="text-lg font-bold mb-6">Spending Profile</h3>
            <div className="w-full relative flex-1" style={{ minHeight: 250 }}>
                {spendingData.length > 0 ? (
                    <>
                        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                            <PieChart>
                                <Pie
                                    data={spendingData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {spendingData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0)" />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0a0a16', borderColor: '#333', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-gray-400 text-sm font-medium">Total</span>
                            <span className="text-xl font-bold text-white">{formatCurrency(totalSpending)}</span>
                        </div>
                    </>
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                        No data available
                    </div>
                )}
            </div>

            {spendingData.length > 0 && (
                <div className="mt-6 space-y-3">
                    {spendingData.map((item, index) => (
                        <div key={item.name} className="flex items-center justify-between text-sm group cursor-default">
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-3 h-3 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)]"
                                    style={{ backgroundColor: COLORS[index % COLORS.length], boxShadow: `0 0 8px ${COLORS[index % COLORS.length]}` }}
                                />
                                <span className="text-gray-300 group-hover:text-white transition-colors">{item.name}</span>
                            </div>
                            <span className="font-bold text-white font-mono">{formatCurrency(item.value)}</span>
                        </div>
                    ))}
                </div>
            )}
        </Card>
    );
}
