import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("token");
            if (token) {
                try {
                    const res = await api.get('/auth/profile');
                    setCurrentUser(res.data);
                } catch (err) {
                    console.error("Failed to fetch user profile", err);
                    localStorage.removeItem("token");
                    setCurrentUser(null);
                }
            } else {
                setCurrentUser(null);
            }
            setLoading(false);
        };

        fetchUser();
    }, []);

    async function signup(email, password, name, mobileNumber) {
        const res = await api.post('/auth/register', {
            email,
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
            email,
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

    const value = {
        currentUser,
        signup,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
