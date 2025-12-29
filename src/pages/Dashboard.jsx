import { useBudget } from "../context/BudgetContext";
// import { formatCurrency } from "../utils/cn";
import { StatsRow } from "../components/dashboard/StatRows";
import { BudgetHealth } from "../components/dashboard/BudgetHealth";
import { SpendingProfile } from "../components/dashboard/SpeandingProfile";
import { RecentTransactions } from "../components/dashboard/RecentTransation";

export default function Dashboard() {
    const { stats, transactions, budgetGoal } = useBudget();
    const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

    // Calculate spending percentage
    const spendingPercentage = Math.min((stats.expenses / budgetGoal) * 100, 100);

    // Generate last 6 months
    const months = Array.from({ length: 6 }, (_, i) => {
        const d = new Date();
        d.setMonth(d.getMonth() - (5 - i));
        return {
            month: d.getMonth(),
            year: d.getFullYear(),
            name: d.toLocaleString('default', { month: 'short' })
        };
    });

    const chartData = months.map(({ month, year, name }) => {
        const total = transactions
            .filter(t => t.type === 'expense')
            .filter(t => {
                const d = new Date(t.date);
                return d.getMonth() === month && d.getFullYear() === year;
            })
            .reduce((acc, curr) => acc + Number(curr.amount), 0);

        return { name, amount: total };
    });

    const spendingData = transactions
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

    const totalSpending = spendingData.reduce((acc, curr) => acc + curr.value, 0);

    return (
        <div className="space-y-6">
            <StatsRow stats={stats} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <BudgetHealth
                    spendingPercentage={spendingPercentage}
                    budgetGoal={budgetGoal}
                    chartData={chartData}
                />
                <SpendingProfile
                    spendingData={spendingData}
                    totalSpending={totalSpending}
                />
            </div>

            <RecentTransactions transactions={sortedTransactions} />
        </div>
    );
}

