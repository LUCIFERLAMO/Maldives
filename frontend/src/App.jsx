import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import HomePage from './pages/HomePage';
import BrowseJobsPage from './pages/BrowseJobsPage';
import JobDetailPage from './pages/JobDetailPage';
import SuccessPage from './pages/SuccessPage';
import RecruiterDashboard from './pages/RecruiterDashboard';
import AdminDashboard from './pages/AdminDashboard';
import CandidateLoginPage from './pages/CandidateLoginPage';
import AgentLoginPage from './pages/AgentLoginPage';
import AdminLoginPage from './pages/AdminLoginPage';
import CandidateDashboard from './pages/CandidateDashboard';
import SavedJobsPage from './pages/SavedJobsPage';
import MyApplicationsPage from './pages/MyApplicationsPage';

import ProfilePage from './pages/ProfilePage';
import SupportPage from './pages/SupportPage';
import AgentRegistrationPage from './pages/AgentRegistrationPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import { AuthProvider } from './context/AuthContext';
import { PopupProvider } from './context/PopupContext';
import GlobalErrorBoundary from './components/GlobalErrorBoundary';

import ProtectedRoute from './components/ProtectedRoute';

const AppContent = () => {
    const location = useLocation();
    // Hide Global Navbar/Footer for Recruiter and Admin Dashboards (they have their own sidebars)
    const isDashboard = location.pathname.startsWith('/recruiter') || location.pathname.startsWith('/admin');

    return (
        <div className="min-h-screen flex flex-col font-sans bg-white">
            {!isDashboard && <Navbar />}
            <main className="flex-grow">
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/jobs" element={
                        <GlobalErrorBoundary>
                            <BrowseJobsPage />
                        </GlobalErrorBoundary>
                    } />
                    <Route path="/job/:id" element={
                        <GlobalErrorBoundary>
                            <JobDetailPage />
                        </GlobalErrorBoundary>
                    } />
                    <Route path="/success" element={<SuccessPage />} />
                    <Route path="/support" element={<SupportPage />} />

                    {/* Authentication Routes */}
                    <Route path="/login" element={<CandidateLoginPage initialMode="login" />} />
                    <Route path="/register" element={<CandidateLoginPage initialMode="register" />} />
                    <Route path="/login/agent" element={<AgentLoginPage />} />
                    <Route path="/agent-login" element={<AgentLoginPage />} />
                    <Route path="/login/admin" element={<AdminLoginPage />} />
                    <Route path="/agent-registration" element={<AgentRegistrationPage />} />
                    <Route path="/reset-password" element={<ResetPasswordPage />} />

                    {/* Protected Admin Routes */}
                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute allowedRoles={['admin']}>
                                <GlobalErrorBoundary>
                                    <AdminDashboard />
                                </GlobalErrorBoundary>
                            </ProtectedRoute>
                        }
                    />

                    {/* Protected Recruiter/Agent Routes */}
                    <Route
                        path="/recruiter"
                        element={
                            <ProtectedRoute allowedRoles={['agent']}>
                                <RecruiterDashboard />
                            </ProtectedRoute>
                        }
                    />

                    {/* Protected Candidate Routes */}
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute allowedRoles={['candidate']}>
                                <CandidateDashboard />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute allowedRoles={['candidate', 'agent']}>
                                <ProfilePage />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/saved-jobs"
                        element={
                            <ProtectedRoute allowedRoles={['candidate']}>
                                <SavedJobsPage />
                            </ProtectedRoute>
                        }
                    />
                    {/* </Route> removed */}
                    <Route
                        path="/career-history"
                        element={
                            <ProtectedRoute allowedRoles={['candidate']}>
                                <MyApplicationsPage />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </main>
            {!isDashboard && <Footer />}
        </div >
    );
};

const App = () => {
    return (
        <AuthProvider>
            <PopupProvider>
                <BrowserRouter>
                    <ScrollToTop />
                    <AppContent />
                </BrowserRouter>
            </PopupProvider>
        </AuthProvider>
    );
};

export default App;
