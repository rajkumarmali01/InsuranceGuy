import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import api from '../services/api';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    logout: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                // Fetch user role from Firestore
                try {
                    // The api interceptor will attach the token if auth.currentUser is set.
                    // However, inside onAuthStateChanged, auth.currentUser might not be fully synced in the interceptor's view immediately?
                    // Actually, api.ts uses auth.currentUser.
                    // Let's rely on the interceptor, or explicitly pass headers if needed.
                    // But api.get is cleaner.
                    const response = await api.get('/auth/me');
                    const data = response.data;
                    const userWithRole = { ...currentUser, role: data.role };
                    setUser(userWithRole as any);
                } catch (error) {
                    console.error('Error fetching user role:', error);
                    setUser(currentUser);
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const logout = async () => {
        await signOut(auth);
    };

    return (
        <AuthContext.Provider value={{ user, loading, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
