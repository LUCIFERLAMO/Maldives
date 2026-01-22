import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false); // No initial loading needed as we don't check session

    useEffect(() => {
        // Check for persisted user in localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            // Call our new backend API instead of Supabase
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, role: 'CANDIDATE' }) // Defaulting role, logic handles errors
            });

            const data = await response.json();

            if (response.ok) {
                const userData = {
                    id: data.user.id,
                    name: data.user.full_name,
                    email: data.user.email,
                    role: data.user.role.toLowerCase(), // Ensure lowercase for consistent checks
                    avatar: '',
                    // Agent-specific fields
                    agency_name: data.user.agency_name || null,
                    contact_number: data.user.contact_number || null,
                    status: data.user.status || 'ACTIVE'
                };
                setUser(userData);
                localStorage.setItem('user', JSON.stringify(userData));
                return { error: null };
            } else {
                return { error: data.message };
            }
        } catch (error) {
            console.error('Login error:', error);
            return { error: 'Network error. Please try again.' };
        }
    };

    // Kept for Admin/Dev Login bypass
    const mockLogin = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const signup = async (email, password, name, phone) => {
        // Placeholder for signup logic interacting with your new API if needed here
        // For now, pages handle their own signup API calls directly
        return { error: 'Signup logic moved to individual pages.' };
    };

    const logout = async () => {
        setUser(null);
        localStorage.removeItem('user');
        window.location.href = '/';
    };

    return (
        <AuthContext.Provider value={{
            user,
            login,
            mockLogin,
            signup,
            logout,
            isAuthenticated: !!user,
            loading
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
