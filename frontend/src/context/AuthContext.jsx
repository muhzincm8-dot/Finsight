import { createContext, useContext, useEffect, useState, useCallback } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const refreshUser = useCallback(async () => {
        const token = localStorage.getItem("token");
        if (token && token !== "undefined" && token !== "null") {
            try {
                const res = await api.get('/auth/profile');
                setCurrentUser(res.data);
                return res.data;
            } catch (err) {
                console.error("Failed to fetch user profile", err);
                localStorage.removeItem("token");
                setCurrentUser(null);
                return null;
            }
        } else {
            setCurrentUser(null);
            return null;
        }
    }, []);

    useEffect(() => {
        const init = async () => {
            await refreshUser();
            setLoading(false);
        };
        init();
    }, [refreshUser]);

    async function signup(email, password, name, mobileNumber) {
        const res = await api.post('/auth/register', {
            email: email.toLowerCase().trim(),
            password,
            name,
            mobileNumber
        });
        localStorage.setItem("token", res.data.token);
        setCurrentUser(res.data.user);
        return res.data.user;
    }

    async function login(email, password) {
        const res = await api.post('/auth/login', {
            email: email.toLowerCase().trim(),
            password
        });
        localStorage.setItem("token", res.data.token);
        setCurrentUser(res.data.user);
        return res.data.user;
    }

    function logout() {
        localStorage.removeItem("token");
        setCurrentUser(null);
    }

    async function updateProfile(data) {
        const res = await api.put('/auth/profile', data);
        // Refresh from server to get latest state
        setCurrentUser(res.data);
        return res.data;
    }

    const value = {
        currentUser,
        setCurrentUser,
        signup,
        login,
        logout,
        updateProfile,
        refreshUser,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
