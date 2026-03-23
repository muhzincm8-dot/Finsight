import { useState } from "react";
import { useBudget } from "../../context/BudgetContext";
import { Modal } from "../ui/Modal";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";

export function AddTransactionModal({ isOpen, onClose }) {
    const { addTransaction } = useBudget();
    const [formData, setFormData] = useState({
        description: "",
        amount: "",
        category: "Food",
        type: "expense",
        date: new Date().toISOString().split('T')[0]
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        addTransaction(formData);
        onClose();
        setFormData({
            description: "",
            amount: "",
            category: "Food",
            type: "expense",
            date: new Date().toISOString().split('T')[0]
        });
    };

    const EXPENSE_CATEGORIES = [
        "Food", "Transport", "Housing", "Utilities", "Entertainment",
        "Health", "Shopping", "Education", "Tech"
    ];

    const INCOME_CATEGORIES = [
        "Salary", "Freelance", "Investments", "Gift", "Other"
    ];

    const KEYWORD_MAPPINGS = {
        expense: {
            Food: ["starbucks", "mcdonalds", "burger", "pizza", "coffee", "lunch", "dinner", "groceries", "restaurant", "cafe"],
            Transport: ["uber", "lyft", "taxi", "bus", "train", "flight", "petrol", "gas", "fuel", "parking"],
            Housing: ["rent", "mortgage", "repair", "furniture"],
            Utilities: ["electric", "water", "internet", "wifi", "phone", "mobile", "bill"],
            Entertainment: ["netflix", "spotify", "hulu", "cinema", "movie", "game", "steam", "concert"],
            Health: ["doctor", "pharmacy", "gym", "medicine", "clinic"],
            Shopping: ["amazon", "ebay", "walmart", "target", "clothes", "shoes"],
            Education: ["course", "book", "tuition", "school", "university"],
            Tech: ["software", "hardware", "apple", "google", "microsoft", "subscription"]
        },
        income: {
            Salary: ["salary", "wages", "paycheck", "bonus"],
            Freelance: ["project", "client", "upwork", "fiverr", "freelance"],
            Investments: ["dividend", "interest", "stock", "crypto", "return"],
            Gift: ["gift", "birthday", "present"],
            Other: ["refund", "cashback"]
        }
    };

    const currentCategories = formData.type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

    const handleDescriptionChange = (e) => {
        const desc = e.target.value;
        const descLower = desc.toLowerCase();

        let suggestedCategory = formData.category;
        const mappings = KEYWORD_MAPPINGS[formData.type];

        if (mappings) {
            for (const [category, keywords] of Object.entries(mappings)) {
                if (keywords.some(keyword => descLower.includes(keyword))) {
                    suggestedCategory = category;
                    break;
                }
            }
        }

        setFormData({ ...formData, description: desc, category: suggestedCategory });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="New Vault Entry">
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Type Toggle */}
                <div className="grid grid-cols-2 gap-4">
                    <button
                        type="button"
                        onClick={() => setFormData({ ...formData, type: 'expense', category: EXPENSE_CATEGORIES[0] })}
                        className={`py-3 px-4 rounded-xl border font-medium transition-all duration-300 ${formData.type === 'expense'
                            ? 'bg-neon-pink/10 border-neon-pink text-neon-pink shadow-[0_0_15px_rgba(255,0,255,0.3)]'
                            : 'bg-surface-dark border-white/5 text-gray-400 hover:border-white/10'
                            }`}
                    >
                        Expense
                    </button>
                    <button
                        type="button"
                        onClick={() => setFormData({ ...formData, type: 'income', category: INCOME_CATEGORIES[0] })}
                        className={`py-3 px-4 rounded-xl border font-medium transition-all duration-300 ${formData.type === 'income'
                            ? 'bg-neon-green/10 border-neon-green text-neon-green shadow-[0_0_15px_rgba(0,255,157,0.3)]'
                            : 'bg-surface-dark border-white/5 text-gray-400 hover:border-white/10'
                            }`}
                    >
                        Income
                    </button>
                </div>

                <div className="space-y-4">
                    <Input
                        label="Amount"
                        type="number"
                        placeholder="0.00"
                        value={formData.amount}
                        onChange={e => setFormData({ ...formData, amount: e.target.value })}
                        required
                        className="h-12"
                    />

                    <Input
                        label="Description"
                        placeholder="e.g. Starbucks, Salary..."
                        value={formData.description}
                        onChange={handleDescriptionChange}
                        required
                        className="h-12"
                    />

                    <div>
                        <label className="text-xs font-bold text-gray-500 ml-1 uppercase mb-1.5 block">Sector</label>
                        <select
                            className="w-full bg-surface-dark border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-neon-blue/50 transition-colors h-12 appearance-none"
                            value={formData.category}
                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                        >
                            {currentCategories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <Input
                        label="Date"
                        type="date"
                        value={formData.date}
                        onChange={e => setFormData({ ...formData, date: e.target.value })}
                        required
                        className="h-12"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={onClose}
                        className="w-full border border-white/10 hover:bg-white/5 text-gray-300 h-12"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        className="w-full bg-cyan-900/30 text-cyan-400 border border-cyan-500/50 hover:bg-cyan-900/50 h-12 shadow-[0_0_10px_rgba(0,255,255,0.1)]"
                    >
                        Save to Vault
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
