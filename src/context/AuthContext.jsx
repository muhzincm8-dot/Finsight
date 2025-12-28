import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    setPersistence,
    browserSessionPersistence,
    updateProfile
} from "firebase/auth";

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    function signup(email, password, name) {
        return setPersistence(auth, browserSessionPersistence)
            .then(() => createUserWithEmailAndPassword(auth, email, password))
            .then((userCredential) => {
                return updateProfile(userCredential.user, {
                    displayName: name
                });
            });
    }

    function login(email, password) {
        return setPersistence(auth, browserSessionPersistence)
            .then(() => signInWithEmailAndPassword(auth, email, password));
    }

    function logout() {
        return signOut(auth);
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

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
