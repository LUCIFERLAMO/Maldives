import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        // You might want to update this with a proper loading spinner component
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
            </div>
        );
    }

    // 1. Check if user is logged in
    if (!user) {
        // Redirect to appropriate login page based on attempted path
        let loginPath = '/login';
        if (location.pathname.startsWith('/admin')) {
            loginPath = '/login/admin';
        } else if (location.pathname.startsWith('/recruiter')) {
            loginPath = '/login/agent';
        }

        return <Navigate to={loginPath} state={{ from: location }} replace />;
    }

    // 2. Check if user has required role (if roles are specified)
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        // User is logged in but unauthorized for this specific route

        // Redirect logic based on their actual role
        if (user.role === 'admin') return <Navigate to="/admin" replace />;
        if (user.role === 'agent') return <Navigate to="/recruiter" replace />;
        if (user.role === 'candidate') return <Navigate to="/dashboard" replace />;

        // Default fallthrough
        return <Navigate to="/" replace />;
    }

    // 3. Authorized
    return children;
};

export default ProtectedRoute;
