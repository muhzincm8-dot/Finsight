import { Modal } from "../ui/Modal";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { useTransactionForm } from "../../hooks/useTransactionForm";

export function AddTransactionModal({ isOpen, onClose }) {
    const {
        formData,
        currentCategories,
        handleFieldChange,
        handleTypeChange,
        handleDescriptionChange,
        handleSubmit,
    } = useTransactionForm(onClose);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="New Vault Entry">
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Type Toggle */}
                <div className="grid grid-cols-2 gap-4">
                    <button
                        type="button"
                        onClick={() => handleTypeChange('expense')}
                        className={`py-3 px-4 rounded-xl border font-medium transition-all duration-300 ${formData.type === 'expense'
                            ? 'bg-neon-pink/10 border-neon-pink text-neon-pink shadow-[0_0_15px_rgba(255,0,255,0.3)]'
                            : 'bg-surface-dark border-white/5 text-gray-400 hover:border-white/10'
                            }`}
                    >
                        Expense
                    </button>
                    <button
                        type="button"
                        onClick={() => handleTypeChange('income')}
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
                        onChange={e => handleFieldChange('amount', e.target.value)}
                        required
                        className="h-12"
                    />

                    <Input
                        label="Description"
                        placeholder="e.g. Starbucks, Salary..."
                        value={formData.description}
                        onChange={e => handleDescriptionChange(e.target.value)}
                        required
                        className="h-12"
                    />

                    <div>
                        <label className="text-xs font-bold text-gray-500 ml-1 uppercase mb-1.5 block">Sector</label>
                        <select
                            className="w-full bg-surface-dark border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-accent/50 transition-colors h-12 appearance-none"
                            value={formData.category}
                            onChange={e => handleFieldChange('category', e.target.value)}
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
                        onChange={e => handleFieldChange('date', e.target.value)}
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
