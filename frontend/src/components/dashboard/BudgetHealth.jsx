import { ResponsiveContainer, BarChart, XAxis, Tooltip, Bar, Cell } from "recharts";
import { Activity } from "lucide-react";
import { Card } from "../ui/Card";
import { formatCurrency } from "../../utils/cn";

export function BudgetHealth({ spendingPercentage, budgetGoal, chartData }) {
    return (
        <Card className="lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold">Budget Health</h3>
                <span className={`text-xl font-bold ${spendingPercentage > 90 ? 'text-red-500' : 'text-neon-blue'}`}>
                    {spendingPercentage.toFixed(1)}%
                </span>
            </div>

            <div className="space-y-6">
                <div>
                    <div className="flex justify-between text-xs text-gray-400 mb-2">
                        <span>Monthly Spending Goal ({formatCurrency(budgetGoal)})</span>
                    </div>
                    <div className="h-4 bg-gray-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-neon-blue to-purple-500 transition-all duration-1000"
                            style={{ width: `${spendingPercentage}%` }}
                        />
                    </div>
                </div>

                <div>
                    <h4 className="text-sm text-gray-400 mb-4 font-medium flex items-center gap-2">
                        <Activity size={16} /> Cashflow Trends
                    </h4>
                    <div className="w-full relative" style={{ height: 200 }}>
                        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                            <BarChart data={chartData}>
                                <XAxis
                                    dataKey="name"
                                    stroke="#4B5563"
                                    fontSize={10}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0a0a16', borderColor: '#333' }}
                                    itemStyle={{ color: '#fff' }}
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                />
                                <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#00f3ff' : '#2D2D44'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </Card>
    );
}
