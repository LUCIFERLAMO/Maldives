import API_BASE_URL from '../api/config.js';
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // Wait for localStorage check

    // Helper: save user to localStorage WITHOUT the avatar (base64 avatars are too large and blow the quota)
    const saveToStorage = (userData) => {
        try {
            const { avatar, ...storableData } = userData;
            localStorage.setItem('user', JSON.stringify(storableData));
        } catch (e) {
            console.error('localStorage save failed:', e);
        }
    };

    useEffect(() => {
        // Check for persisted user in localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsed = JSON.parse(storedUser);
            // Immediately set user without avatar so the app loads fast
            setUser(parsed);
            // Then fetch the avatar (and other fresh data) from DB in the background
            if (parsed.id) {
                fetch(`${API_BASE_URL}/api/profile/${parsed.id}`)
                    .then(r => r.ok ? r.json() : null)
                    .then(profile => {
                        if (profile) {
                            setUser(prev => prev ? {
                                ...prev,
                                avatar: profile.avatar || null,
                                contact_number: profile.contact_number || prev.contact_number || '',
                                phone: profile.contact_number || prev.phone || '',
                                location: profile.location || prev.location || '',
                                skills: profile.skills || prev.skills || [],
                                experience_years: profile.experience_years ?? prev.experience_years ?? 0,
                            } : prev);
                        }
                    })
                    .catch(e => console.warn('Background profile refresh failed:', e));
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, role: 'CANDIDATE' })
            });

            const data = await response.json();

            if (response.ok) {
                // Fetch fresh full profile from DB to get latest avatar, location, phone etc.
                let fullProfile = null;
                try {
                    const profileRes = await fetch(`${API_BASE_URL}/api/profile/${data.user.id}`);
                    if (profileRes.ok) fullProfile = await profileRes.json();
                } catch (e) {
                    console.warn('Could not fetch full profile after login:', e);
                }

                const userData = {
                    id: data.user.id,
                    _id: data.user._id,
                    name: fullProfile?.full_name || data.user.full_name,
                    full_name: fullProfile?.full_name || data.user.full_name,
                    email: data.user.email,
                    role: data.user.role.toLowerCase(),
                    avatar: fullProfile?.avatar || data.user.avatar || null,
                    phone: fullProfile?.contact_number || data.user.contact_number || '',
                    contact_number: fullProfile?.contact_number || data.user.contact_number || '',
                    location: fullProfile?.location || data.user.location || '',
                    skills: fullProfile?.skills || data.user.skills || [],
                    experience_years: fullProfile?.experience_years ?? data.user.experience_years ?? 0,
                    agency_name: fullProfile?.agency_name || data.user.agency_name || null,
                    status: fullProfile?.status || data.user.status || 'ACTIVE'
                };
                setUser(userData);
                saveToStorage(userData); // Avatar excluded from storage
                return { error: null };
            } else {
                return { error: data.message };
            }
        } catch (error) {
            console.error('Login error:', error);
            return { error: 'Network error. Please try again.' };
        }
    };

    // Kept for Admin/Dev/Agent Login
    const mockLogin = (userData) => {
        setUser(userData);
        saveToStorage(userData); // Avatar excluded from storage
    };

    // Google OAuth Login (Candidate and Agent portals only)
    const loginWithGoogle = async (credential, role = 'CANDIDATE') => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/google`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ credential, role })
            });

            const data = await response.json();

            if (response.ok) {
                // Fetch fresh full profile from DB to get latest avatar, location etc.
                let fullProfile = null;
                try {
                    const profileRes = await fetch(`${API_BASE_URL}/api/profile/${data.user.id}`);
                    if (profileRes.ok) fullProfile = await profileRes.json();
                } catch (e) {
                    console.warn('Could not fetch full profile after Google login:', e);
                }

                const userData = {
                    id: data.user.id,
                    _id: data.user._id,
                    name: fullProfile?.full_name || data.user.full_name,
                    full_name: fullProfile?.full_name || data.user.full_name,
                    email: data.user.email,
                    role: data.user.role.toLowerCase(),
                    avatar: fullProfile?.avatar || data.user.avatar || null,
                    phone: fullProfile?.contact_number || data.user.contact_number || '',
                    contact_number: fullProfile?.contact_number || data.user.contact_number || '',
                    location: fullProfile?.location || data.user.location || '',
                    skills: fullProfile?.skills || data.user.skills || [],
                    experience_years: fullProfile?.experience_years ?? data.user.experience_years ?? 0,
                    agency_name: fullProfile?.agency_name || data.user.agency_name || null,
                    status: fullProfile?.status || data.user.status || 'ACTIVE'
                };
                setUser(userData);
                saveToStorage(userData);
                return { error: null };
            } else {
                return { error: data.message };
            }
        } catch (error) {
            console.error('Google login error:', error);
            return { error: 'Network error. Please try again.' };
        }
    };

    const signup = async (email, password, name, phone) => {
        return { error: 'Signup logic moved to individual pages.' };
    };

    const logout = async () => {
        setUser(null);
        localStorage.removeItem('user');
        window.location.href = '/';
    };

    const updateUser = (updatedData) => {
        setUser((prevUser) => {
            const newUser = { ...prevUser, ...updatedData };
            saveToStorage(newUser); // Avatar excluded from storage
            return newUser;
        });
    };

    return (
        <AuthContext.Provider value={{
            user,
            login,
            loginWithGoogle,
            mockLogin,
            signup,
            logout,
            updateUser,
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
