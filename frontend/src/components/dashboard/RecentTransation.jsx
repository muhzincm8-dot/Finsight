import { Card } from "../ui/Card";
import { formatCurrency, formatDate } from "../../utils/cn";

export function RecentTransactions({ transactions }) {
    return (
        <Card className="overflow-hidden p-0">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
                <h3 className="text-lg font-bold">Latest Transactions</h3>
                <button className="text-sm text-neon-blue hover:text-white transition-colors flex items-center gap-1">
                    View Full Log <span>&rsaquo;</span>
                </button>
            </div>
            <div className="overflow-x-auto">
                {transactions.length > 0 ? (
                    <table className="w-full text-left text-sm text-gray-400">
                        <thead className="bg-white/5 text-xs uppercase">
                            <tr>
                                <th className="px-6 py-4 font-medium">Description</th>
                                <th className="px-6 py-4 font-medium">Date</th>
                                <th className="px-6 py-4 font-medium">Category</th>
                                <th className="px-6 py-4 font-medium text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {transactions.map((t) => (
                                <tr key={t.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 text-white font-medium">{t.description}</td>
                                    <td className="px-6 py-4">{formatDate(t.date)}</td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 rounded-full text-xs bg-white/5 border border-white/10">
                                            {t.category}
                                        </span>
                                    </td>
                                    <td className={`px-6 py-4 text-right font-bold ${t.type === 'income' ? 'text-neon-green' : 'text-gray-300'}`}>
                                        {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="p-8 text-center text-gray-500">
                        No data found in vault.
                    </div>
                )}
            </div>
        </Card>
    );
}
