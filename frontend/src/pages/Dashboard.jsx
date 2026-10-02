import { StatsRow } from "../components/dashboard/StatRows";
import { BudgetHealth } from "../components/dashboard/BudgetHealth";
import { SpendingProfile } from "../components/dashboard/SpeandingProfile";
import { RecentTransactions } from "../components/dashboard/RecentTransation";
import { UpgradeBanner } from "../components/dashboard/UpgradeBanner";
import { useDashboardData } from "../hooks/useDashboardData";

export default function Dashboard() {
    const {
        stats,
        budgetGoal,
        sortedTransactions,
        spendingPercentage,
        chartData,
        spendingData,
        totalSpending,
    } = useDashboardData();

    return (
        <div className="space-y-6">
            {/* Background Glow */}
            <div className="absolute top-[-150px] left-[-150px] w-[600px] h-[500px] bg-accent/10 dark:bg-accent/20 rounded-full blur-[120px] -z-10 pointer-events-none transition-colors duration-500" />

            {/* Page Header */}
            <div className="relative z-10 pb-6 space-y-2 -mt-4 md:-mt-6 lg:-mt-8">
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Welcome back,</p>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight leading-tight">
                    Take control of <br className="hidden sm:block" />
                    your <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-accent dark:from-emerald-400">financial future</span>
                </h2>
                <p className="text-gray-500 text-sm pt-1">
                    Smart insights. Better decisions. Financial freedom.
                </p>
            </div>

            {/* Stats Cards */}
            <StatsRow stats={stats} />

            {/* Budget Health + Spending Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3">
                    <BudgetHealth
                        spendingPercentage={spendingPercentage}
                        budgetGoal={budgetGoal}
                        chartData={chartData}
                    />
                </div>
                <div className="lg:col-span-2">
                    <SpendingProfile
                        spendingData={spendingData}
                        totalSpending={totalSpending}
                    />
                </div>
            </div>

            {/* Recent Transactions */}
            <RecentTransactions transactions={sortedTransactions} />

            {/* Upgrade Banner */}
            <UpgradeBanner />
        </div>
    );
}
