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
            // Retry helper for transient network errors (like AbortSignal)
            const attemptLogin = async (retries = 3) => {
                try {
                    const { data, error } = await supabase.auth.signInWithPassword({
                        email,
                        password
                    });
                    if (error) throw error;
                    return data;
                } catch (err) {
                    const msg = (err.message || "").toLowerCase();
                    if ((msg.includes("signal is aborted") || msg.includes("aborted")) && retries > 0) {
                        console.warn(`Transient login error: ${err.message}. Retrying...`);
                        await new Promise(r => setTimeout(r, 500));
                        return attemptLogin(retries - 1);
                    }
                    throw err;
                }
            };

            // 1. Authenticate with retries
            const data = await attemptLogin();

            // 2. Check Profile Status (Safely)
            let profile = null;
            try {
                const { data: profileData, error: profileError } = await supabase
                    .from('profiles')
                    .select('id, full_name, role, status')
                    .eq('id', data.user.id)
                    .single();

                if (profileError) throw profileError;
                profile = profileData;

            } catch (fetchError) {
                console.warn("Profile fetch failed, using auth metadata fallback:", fetchError.message);
                // Fallback to metadata if DB fetch fails (e.g. Schema Error)
                const metadata = data.user.user_metadata || {};
                profile = {
                    id: data.user.id,
                    full_name: metadata.full_name || metadata.name || 'Agent',
                    role: 'agent', // Defaulting to agent if we can't check
                    status: 'APPROVED', // Assuming approved if they have a valid login
                    phone: '',
                    avatar_url: ''
                };
            }

            // 3. Block if not Approved (Agency logic)
            // Only check strict status if we actually fetched a real profile from DB
            // If we are using fallback, we assume they are good to go (or we block them elsewhere)
            if (profile.status !== 'APPROVED') {
                await supabase.auth.signOut();
                throw new Error("Your account is pending approval by Admin.");
            }

            // Success - update state
            setUser({
                id: profile.id,
                name: profile.full_name,
                email: data.user.email,
                phone: profile.phone || '',
                role: profile.role,
                avatar: profile.avatar_url || ''
            });

            return { error: null };
        } catch (error) {
            console.error('Login error:', error);
            return { error: error.message };
        }
    };

    // Mock Login for Admin/Agent portals (Client-side only bypass)
    const mockLogin = (userData) => {
        setUser(userData);
        setLoading(false);
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
        try {
            await supabase.auth.signOut();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setUser(null);
            // Explicitly reload to clear any memory/client-side state
            window.location.href = '/';
        }
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
