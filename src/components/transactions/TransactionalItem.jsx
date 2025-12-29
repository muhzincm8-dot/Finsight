import { Trash2 } from "lucide-react";
import { formatCurrency, formatDate } from "../../utils/cn";

export function TransactionItem({ transaction, onDelete }) {
    const { id, date, description, category, type, amount } = transaction;

    return (
        <div
            className="grid grid-cols-12 items-center px-6 py-4 bg-card-bg/50 border border-white/5 rounded-lg hover:border-neon-blue/30 hover:bg-white/5 transition-all duration-300 group"
        >
            <div className="col-span-2 text-sm text-gray-400 font-mono">{formatDate(date)}</div>
            <div className="col-span-5 font-medium text-white group-hover:text-neon-blue transition-colors truncate pr-4">{description}</div>
            <div className="col-span-2">
                <span className="px-2 py-1 text-xs rounded-full bg-white/5 text-gray-300 border border-white/10">
                    {category}
                </span>
            </div>
            <div className={`col-span-2 text-right font-bold font-mono ${type === 'income' ? 'text-neon-green' : 'text-neon-pink'}`}>
                {type === 'income' ? '+' : '-'}{formatCurrency(amount)}
            </div>
            <div className="col-span-1 flex justify-end">
                <button
                    onClick={() => onDelete(id)}
                    className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    title="Delete Transaction"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    );
}
