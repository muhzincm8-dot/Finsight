import { Trash2 } from "lucide-react";
import { formatCurrency, formatDate } from "../../utils/cn";

export function TransactionItem({ transaction, onDelete }) {
    const { id, date, description, category, type, amount } = transaction;

    return (
        <div
            className="flex flex-col md:grid md:grid-cols-12 items-start md:items-center gap-4 md:gap-0 px-6 py-4 bg-card-bg/50 border border-white/5 rounded-lg hover:border-neon-blue/30 hover:bg-white/5 transition-all duration-300 group relative"
        >
            <div className="md:col-span-2 text-xs md:text-sm text-gray-400 font-mono">{formatDate(date)}</div>
            <div className="md:col-span-5 font-medium text-white group-hover:text-neon-blue transition-colors truncate pr-4 text-base md:text-sm">{description}</div>
            <div className="md:col-span-2 flex items-center">
                <span className="px-2 py-0.5 md:py-1 text-[10px] md:text-xs rounded-full bg-white/5 text-gray-300 border border-white/10">
                    {category}
                </span>
            </div>
            <div className={`md:col-span-2 text-left md:text-right font-bold font-mono text-lg md:text-sm ${type === 'income' ? 'text-neon-green' : 'text-neon-pink'}`}>
                {type === 'income' ? '+' : '-'}{formatCurrency(amount)}
            </div>
            <div className="md:col-span-1 flex justify-end absolute right-4 top-4 md:relative md:right-0 md:top-0">
                <button
                    onClick={() => onDelete(id)}
                    className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors opacity-100 md:opacity-0 md:group-hover:opacity-100"
                    title="Delete Transaction"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    );
}
