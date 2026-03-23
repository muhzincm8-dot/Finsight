import { createContext, useContext, useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, deleteDoc, doc, onSnapshot, query, orderBy } from "firebase/firestore";
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

    useEffect(() => {
        if (!currentUser) {
            setTransactions([]);
            setLoading(false);
            return;
        }

        const q = query(
            collection(db, "users", currentUser.uid, "transactions"),
            orderBy("date", "desc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const docs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setTransactions(docs);
            setLoading(false);
        });

        return unsubscribe;
    }, [currentUser]);

    useEffect(() => {
        localStorage.setItem("budgetGoal", budgetGoal);
    }, [budgetGoal]);

    const addTransaction = async (transaction) => {
        if (!currentUser) return;
        try {
            await addDoc(collection(db, "users", currentUser.uid, "transactions"), {
                ...transaction,
                createdAt: new Date()
            });
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    };

    const deleteTransaction = async (id) => {
        if (!currentUser) return;
        try {
            await deleteDoc(doc(db, "users", currentUser.uid, "transactions", id));
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
