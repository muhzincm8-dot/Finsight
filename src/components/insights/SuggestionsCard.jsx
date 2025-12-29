import { Card } from "../ui/Card";

export function SuggestionsCard({ transactions, netDelta, categoryData }) {
    return (
        <Card>
            <h3 className="font-bold mb-4">Smart Suggestions</h3>
            {transactions.length > 0 ? (
                <ul className="space-y-3 text-sm text-gray-400">
                    <li className="flex gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-neon-blue mt-1.5 shrink-0"></span>
                        {netDelta > 0 ? "Savings rate is positive. Good job!" : "Expenses exceed income this month."}
                    </li>
                    <li className="flex gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-neon-pink mt-1.5 shrink-0"></span>
                        Review your recent {categoryData[0]?.name || "expenses"} spending.
                    </li>
                </ul>
            ) : (
                <p className="text-sm text-gray-500">Add transactions to generate insights.</p>
            )}
        </Card>
    );
}
