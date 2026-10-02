import { SpendingDistribution } from "../components/insights/SpendingDistribution";
import { VelocityCard } from "../components/insights/VelocityCard";
import { SuggestionsCard } from "../components/insights/SuggestionsCard";
import { GlobalConfig } from "../components/insights/GlobalConfigration";
import { useInsightsData } from "../hooks/useInsightsData";

export default function Insights() {
    const {
        transactions,
        budgetGoal,
        setBudgetGoal,
        categoryData,
        netDelta,
        projectedBurn,
    } = useInsightsData();

    return (
        <div className="space-y-8">
            <h1 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Predictive Analytics</h1>

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
