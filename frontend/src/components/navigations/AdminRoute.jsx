import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export function AdminRoute({ children }) {
    const { currentUser } = useAuth();

    if (!currentUser) return <Navigate to="/login" />;
    if (currentUser.role !== 'admin') return <Navigate to="/" />;

    return children;
}
