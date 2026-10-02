import { useState } from "react";
import { useBudget } from "../context/BudgetContext";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Search, Filter, Download, Plus } from "lucide-react";
import { TransactionItem } from "../components/transactions/TransactionalItem";
import { downloadTransactionsCSV } from "../services/exportService";
import { TRANSACTION_FILTER_CATEGORIES, INCOME_CATEGORIES } from "../constants";

export default function Transactions({ onAddClick }) {
    const { transactions, deleteTransaction } = useBudget();
    const [search, setSearch] = useState("");
    const [filterCategory, setFilterCategory] = useState("All");

    const filtered = transactions.filter(t => {
        const matchesSearch = (t.description || "").toLowerCase().includes(search.toLowerCase());
        const matchesCategory =
            filterCategory === "All"
                ? true
                : filterCategory === "Income"
                ? t.type === "income" || t.category === "Income" || INCOME_CATEGORIES.includes(t.category)
                : filterCategory === "Bills"
                ? t.category === "Bills" || t.category === "Utilities"
                : t.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Encrypted Transaction Log</h1>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-2" onClick={() => downloadTransactionsCSV(filtered)}>
                        <Download size={16} /> Download CSV
                    </Button>
                    <Button size="sm" className="gap-2" onClick={onAddClick}>
                        <Plus size={16} /> Add
                    </Button>
                </div>
            </div>

            <Card className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <Input
                        placeholder="Search log..."
                        icon={Search}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1"
                    />
                    <div className="relative min-w-[200px]">
                        <select
                            className="w-full bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-gray-900 dark:text-white outline-none appearance-none focus:border-accent/50"
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                        >
                            {TRANSACTION_FILTER_CATEGORIES.map(cat => (
                                <option key={cat} value={cat}>
                                    {cat === "All" ? "All Sectors" : cat}
                                </option>
                            ))}
                        </select>
                        <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
                    </div>
                </div>
            </Card>

            <div className="space-y-2">
                {/* Table Header */}
                <div className="hidden md:grid grid-cols-12 px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/5">
                    <div className="col-span-2">Date</div>
                    <div className="col-span-5">Description</div>
                    <div className="col-span-2">Sector</div>
                    <div className="col-span-2 text-right">Amount</div>
                    <div className="col-span-1"></div>
                </div>

                <div className="space-y-2">
                    {filtered.length > 0 ? filtered.map((t) => (
                        <TransactionItem
                            key={t.id}
                            transaction={t}
                            onDelete={deleteTransaction}
                        />
                    )) : (
                        <div className="text-center py-12 text-gray-500">
                            No matching records found.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
