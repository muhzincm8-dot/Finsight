import { useBudget } from "../context/BudgetContext";
import { SpendingDistribution } from "../components/insights/SpendingDistribution";
import { VelocityCard } from "../components/insights/VelocityCard";
import { SuggestionsCard } from "../components/insights/SuggestionsCard";
import { GlobalConfig } from "../components/insights/GlobalConfigration";

export default function Insights() {
    const { transactions, budgetGoal, setBudgetGoal } = useBudget();

    // Calculate category totals
    const categoryData = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, curr) => {
            const existing = acc.find(item => item.name === curr.category);
            if (existing) {
                existing.value += Number(curr.amount);
            } else {
                acc.push({ name: curr.category, value: Number(curr.amount) });
            }
            return acc;
        }, []);

    // Calculate basic projections
    const currentMonthExpenses = transactions
        .filter(t => t.type === 'expense' && new Date(t.date).getMonth() === new Date().getMonth())
        .reduce((acc, curr) => acc + Number(curr.amount), 0);

    const currentMonthIncome = transactions
        .filter(t => t.type === 'income' && new Date(t.date).getMonth() === new Date().getMonth())
        .reduce((acc, curr) => acc + Number(curr.amount), 0);

    const netDelta = currentMonthIncome - currentMonthExpenses;
    const projectedBurn = currentMonthExpenses * 1.1; // Simple projection logic

    return (
        <div className="space-y-8">
            <h1 className="text-xl font-bold mb-4">Predictive Analytics</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <SpendingDistribution categoryData={categoryData} />

                <div className="space-y-6">
                    <VelocityCard projectedBurn={projectedBurn} netDelta={netDelta} />
                    <SuggestionsCard
                        transactions={transactions}
                        netDelta={netDelta}
                        categoryData={categoryData}
                    />
                </div>
            </div>

            <GlobalConfig budgetGoal={budgetGoal} setBudgetGoal={setBudgetGoal} />
        </div>
    );
}

