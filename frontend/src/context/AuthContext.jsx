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
            if (token && token !== "undefined" && token !== "null") {
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
        setCurrentUser(res.data);
        return res.data;
    }

    const value = {
        currentUser,
        signup,
        login,
        logout,
        updateProfile
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
