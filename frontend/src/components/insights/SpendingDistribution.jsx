import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { Card } from "../ui/Card";
import { CHART_COLORS } from "../../constants";
import { useTheme } from "../../context/ThemeContext";

export function SpendingDistribution({ categoryData }) {
    const { theme } = useTheme();

    return (
        <Card>
            <h3 className="text-lg font-bold mb-6 text-center text-gray-900 dark:text-white">Spending Distribution</h3>
            <div className="w-full relative" style={{ height: 300 }}>
                {categoryData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                        <PieChart>
                            <Pie
                                data={categoryData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {categoryData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} stroke="rgba(0,0,0,0)" />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: theme === 'dark' ? '#0f2a1e' : '#ecfdf5',
                                    borderColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(16,185,129,0.2)',
                                    borderRadius: '10px',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                }}
                                itemStyle={{ color: theme === 'dark' ? '#fff' : '#064e3b' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        No data available
                    </div>
                )}
            </div>

            <div className="mt-4 text-center">
                <p className="text-gray-500 dark:text-gray-400 text-sm">Dominant Sector: <span className="text-gray-900 dark:text-white font-bold">{
                    categoryData.length > 0 ? (categoryData.sort((a, b) => b.value - a.value)[0]?.name) : "N/A"
                }</span></p>
            </div>
        </Card>
    );
}
