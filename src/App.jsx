import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
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
import MyApplicationsPage from './pages/MyApplicationsPage';
import ProfilePage from './pages/ProfilePage';
import SupportPage from './pages/SupportPage';
import AgentRegistrationPage from './pages/AgentRegistrationPage';
import { AuthProvider } from './context/AuthContext';

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
                    <Route path="/jobs" element={<BrowseJobsPage />} />
                    <Route path="/job/:id" element={<JobDetailPage />} />
                    <Route path="/success" element={<SuccessPage />} />
                    <Route path="/support" element={<SupportPage />} />

                    {/* Authentication Routes */}
                    <Route path="/login" element={<CandidateLoginPage initialMode="login" />} />
                    <Route path="/register" element={<CandidateLoginPage initialMode="register" />} />
                    <Route path="/login/agent" element={<AgentLoginPage />} />
                    <Route path="/agent-login" element={<AgentLoginPage />} />
                    <Route path="/login/admin" element={<AdminLoginPage />} />
                    <Route path="/agent-registration" element={<AgentRegistrationPage />} />

                    {/* Protected Admin Routes */}
                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute allowedRoles={['admin']}>
                                <AdminDashboard />
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
                        path="/applications"
                        element={
                            <ProtectedRoute allowedRoles={['candidate']}>
                                <MyApplicationsPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute allowedRoles={['candidate']}>
                                <ProfilePage />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </main>
            {!isDashboard && (
                <footer className="bg-slate-900 text-slate-400 py-12">
                    <div className="container mx-auto px-4 max-w-6xl">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                            <div className="col-span-1 md:col-span-2">
                                <div className="flex items-center gap-2 text-white font-black text-xl mb-6">
                                    <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
                                        <span className="text-white text-lg">M</span>
                                    </div>
                                    MaldivesCareer
                                </div>
                                <p className="text-sm leading-relaxed max-w-sm">Connecting the world's best talent to luxury career opportunities across the Maldives. Our platform simplifies the international recruitment process for both candidates and employers.</p>
                            </div>
                            <div>
                                <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Platform</h4>
                                <ul className="space-y-4 text-sm">
                                    <li><Link to="/jobs" className="hover:text-teal-400 transition-colors">Browse Jobs</Link></li>
                                    <li><Link to="/login/agent" className="hover:text-teal-400 transition-colors">Agent Portal</Link></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Support</h4>
                                <ul className="space-y-4 text-sm">
                                    <li><Link to="/support" className="hover:text-teal-400 transition-colors">Contact Us</Link></li>
                                    <li className="hover:text-white cursor-pointer transition-colors">Privacy Policy</li>
                                    <li className="hover:text-white cursor-pointer transition-colors">Terms of Service</li>
                                </ul>
                            </div>
                        </div>
                        <div className="pt-12 border-t border-white/10 text-center text-[11px] font-bold uppercase tracking-[0.2em] opacity-40">
                            © 2024 MaldivesCareer Connect. All rights reserved.
                        </div>
                    </div>
                </footer>
            )}
        </div>
    );
};

const App = () => {
    return (
        <AuthProvider>
            <BrowserRouter>
                <ScrollToTop />
                <AppContent />
            </BrowserRouter>
        </AuthProvider>
    );
};

export default App;
