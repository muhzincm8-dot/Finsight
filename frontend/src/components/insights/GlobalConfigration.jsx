import { Card } from "../ui/Card";
import { Button } from "../ui/Button";

export function GlobalConfig({ budgetGoal, setBudgetGoal }) {
    return (
        <Card>
            <h3 className="font-bold mb-4 text-gray-900 dark:text-white">Global Configuration</h3>
            <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Monthly Ceiling (Goal)</label>
                <div className="flex flex-col sm:flex-row gap-4 mt-2">
                    <input
                        type="number"
                        value={budgetGoal}
                        onChange={(e) => setBudgetGoal(e.target.value)}
                        className="flex-1 bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2 text-gray-900 dark:text-white outline-none focus:border-accent"
                    />
                    <Button 
                        onClick={() => alert("Configuration synced to neuro-cloud.")}
                        className="w-full sm:w-auto"
                    >
                        Sync Configuration
                    </Button>
                </div>
            </div>
        </Card>
    );
}
