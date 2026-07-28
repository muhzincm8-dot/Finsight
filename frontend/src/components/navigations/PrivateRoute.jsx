import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useEffect } from "react";

export function PrivateRoute({ children }) {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (currentUser && currentUser.isActive === false) {
            logout();
            navigate("/login", { state: { suspended: true } });
        }
    }, [currentUser, logout, navigate]);

    if (!currentUser) return <Navigate to="/login" />;
    if (currentUser.isActive === false) return null;

    return children;
}
