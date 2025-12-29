import { useState } from "react";
import { useBudget } from "../context/BudgetContext";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
// import { formatCurrency, formatDate } from "../utils/cn";
import { Search, Filter, Download, Plus, Trash2 } from "lucide-react";

import { TransactionItem } from "../components/transactions/TransactionalItem";

export default function Transactions({ onAddClick }) {
    const { transactions, deleteTransaction } = useBudget();
    const [search, setSearch] = useState("");
    const [filterCategory, setFilterCategory] = useState("All");

    const filtered = transactions.filter(t => {
        const matchesSearch = t.description.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = filterCategory === "All" || t.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    const handleDownloadCSV = () => {
        const headers = ["Date", "Description", "Category", "Type", "Amount"];
        const csvContent = [
            headers.join(","),
            ...filtered.map(t => [
                t.date,
                `"${t.description.replace(/"/g, '""')}"`,
                t.category,
                t.type,
                t.amount
            ].join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `transactions_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h1 className="text-xl font-bold">Encrypted Transaction Log</h1>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-2" onClick={handleDownloadCSV}>
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
                            className="w-full bg-surface-dark border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none appearance-none focus:border-neon-blue/50"
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                        >
                            <option value="All">All Sectors</option>
                            <option value="Food">Food</option>
                            <option value="Transport">Transport</option>
                            <option value="Bills">Bills</option>
                            <option value="Entertainment">Entertainment</option>
                            <option value="Tech">Tech</option>
                            <option value="Income">Income</option>
                        </select>
                        <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
                    </div>
                </div>
            </Card>

            <div className="space-y-2">
                {/* Table Header */}
                <div className="grid grid-cols-12 px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider bg-white/5 rounded-lg border border-white/5">
                    <div className="col-span-2">Date</div>
                    <div className="col-span-5">Description</div>
                    <div className="col-span-2">Sector</div>
                    <div className="col-span-2 text-right">Amount</div>
                    <div className="col-span-1"></div>
                </div>

                {/* List */}
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

