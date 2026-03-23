import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { Card } from "../ui/Card";

export function SpendingDistribution({ categoryData }) {
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#b026ff', '#ff00ff'];

    return (
        <Card>
            <h3 className="text-lg font-bold mb-6 text-center">Spending Distribution</h3>
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
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0)" />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ backgroundColor: '#0a0a16', borderColor: '#333', borderRadius: '8px' }}
                                itemStyle={{ color: '#fff' }}
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
                <p className="text-gray-400 text-sm">Dominant Sector: <span className="text-white font-bold">{
                    categoryData.length > 0 ? (categoryData.sort((a, b) => b.value - a.value)[0]?.name) : "N/A"
                }</span></p>
            </div>
        </Card>
    );
}
