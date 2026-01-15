import React from 'react';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import ScrollToTop from './components/ScrollToTop';
import HomePage from './pages/HomePage';
import BrowseJobsPage from './pages/BrowseJobsPage';
import JobDetailPage from './pages/JobDetailPage';
import SuccessPage from './pages/SuccessPage';
import RecruiterDashboard from './pages/RecruiterDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AuthPage from './pages/AuthPage';
import CandidateDashboard from './pages/CandidateDashboard';
import MyApplicationsPage from './pages/MyApplicationsPage';
import SupportPage from './pages/SupportPage';
import { AuthProvider } from './context/AuthContext';

const App = () => {
    return (
        <AuthProvider>
            <HashRouter>
                <ScrollToTop />
                <div className="min-h-screen flex flex-col font-sans bg-white">
                    <Navbar />
                    <main className="flex-grow">
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/jobs" element={<BrowseJobsPage />} />
                            <Route path="/job/:id" element={<JobDetailPage />} />
                            <Route path="/success" element={<SuccessPage />} />
                            <Route path="/recruiter" element={<RecruiterDashboard />} />
                            <Route path="/admin" element={<AdminDashboard />} />
                            <Route path="/login" element={<AuthPage initialMode="login" />} />
                            <Route path="/register" element={<AuthPage initialMode="register" />} />
                            <Route path="/support" element={<SupportPage />} />

                            {/* Candidate Protected Routes */}
                            <Route path="/dashboard" element={<CandidateDashboard />} />
                            <Route path="/applications" element={<MyApplicationsPage />} />
                        </Routes>
                    </main>
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
                                        <li><Link to="/login" state={{ from: 'agent' }} className="hover:text-teal-400 transition-colors">Agent Portal</Link></li>
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
                </div>
            </HashRouter>
        </AuthProvider>
    );
};

export default App;
