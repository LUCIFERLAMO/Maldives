import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for existing session
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                loadUserProfile(session.user.id);
            } else {
                setLoading(false);
            }
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (session) {
                    await loadUserProfile(session.user.id);
                } else {
                    setUser(null);
                }
                setLoading(false);
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    const loadUserProfile = async (userId) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) {
                // If profile doesn't exist, try to get basic user info from auth
                console.warn('Profile loading error (might be missing row):', error);
                const { data: { user: authUser } } = await supabase.auth.getUser();

                if (authUser) {
                    setUser({
                        id: authUser.id,
                        name: authUser.user_metadata?.name || authUser.email.split('@')[0],
                        email: authUser.email,
                        role: 'candidate', // Default fallback
                        avatar: null
                    });
                }
                return;
            }

            setUser({
                id: data.id,
                name: data.name,
                email: data.email,
                phone: data.phone,
                role: data.role,
                avatar: data.avatar_url
            });
        } catch (error) {
            console.error('Error loading profile:', error);
            // Fallback for critical errors
            const { data: { user: authUser } } = await supabase.auth.getUser();
            if (authUser) {
                setUser({
                    id: authUser.id,
                    email: authUser.email,
                    role: 'candidate',
                    name: 'User'
                });
            } else {
                setUser(null);
            }
        }
    };

    const login = async (email, password) => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) throw error;

            if (data.user) {
                await loadUserProfile(data.user.id);
            }

            return { error: null };
        } catch (error) {
            return { error: error.message };
        }
    };

    const signup = async (email, password, name, phone) => {
        try {
            // Create auth user
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password
            });

            if (authError) throw authError;

            // Create profile
            const { error: profileError } = await supabase
                .from('profiles')
                .insert([
                    {
                        id: authData.user.id,
                        name,
                        email,
                        phone,
                        role: 'candidate'
                    }
                ]);

            if (profileError) throw profileError;

            // Load profile
            await loadUserProfile(authData.user.id);

            return { error: null };
        } catch (error) {
            return { error: error.message };
        }
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        window.location.href = '/';
    };

    return (
        <AuthContext.Provider value={{
            user,
            login,
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
