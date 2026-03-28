import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../api/axios";
import { useAuth } from "./AuthContext";

const BudgetContext = createContext();

export const useBudget = () => useContext(BudgetContext);

export function BudgetProvider({ children }) {
    const { currentUser } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [budgetGoal, setBudgetGoal] = useState(() => {
        return Number(localStorage.getItem("budgetGoal")) || 2000;
    });

    const fetchTransactions = useCallback(async () => {
        if (!currentUser) {
            setTransactions([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const res = await api.get('/transactions');
            // Mongoose object id is _id, but frontend might expect id
            const formattedTxns = res.data.map(t => ({...t, id: t._id }));
            setTransactions(formattedTxns);
        } catch (err) {
            console.error("Error fetching transactions: ", err);
        } finally {
            setLoading(false);
        }
    }, [currentUser]);

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    useEffect(() => {
        localStorage.setItem("budgetGoal", budgetGoal);
    }, [budgetGoal]);

    const addTransaction = async (transaction) => {
        if (!currentUser) return;
        try {
            const res = await api.post('/transactions', transaction);
            const newTxn = { ...res.data, id: res.data._id };
            setTransactions(prev => [newTxn, ...prev]);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    };

    const deleteTransaction = async (id) => {
        if (!currentUser) return;
        try {
            await api.delete(`/transactions/${id}`);
            setTransactions(prev => prev.filter(t => t.id !== id));
        } catch (e) {
            console.error("Error deleting document: ", e);
        }
    };

    const getStats = () => {
        const income = transactions
            .filter(t => t.type === 'income')
            .reduce((acc, curr) => acc + Number(curr.amount), 0);

        const expenses = transactions
            .filter(t => t.type === 'expense')
            .reduce((acc, curr) => acc + Number(curr.amount), 0);

        return {
            income,
            expenses,
            balance: income - expenses
        };
    };

    return (
        <BudgetContext.Provider value={{
            transactions,
            addTransaction,
            deleteTransaction,
            budgetGoal,
            setBudgetGoal,
            stats: getStats(),
            loading
        }}>
            {children}
        </BudgetContext.Provider>
    );
}
