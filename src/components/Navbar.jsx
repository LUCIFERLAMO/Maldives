import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Briefcase, LogOut, User, ChevronDown, Menu, X, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { INDUSTRIES } from '../constants';

const Navbar = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false); // User Dropdown
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Mobile Nav
    const [isJobsOpen, setIsJobsOpen] = useState(false); // Mobile Jobs Accordion

    const handleCategoryClick = (category) => {
        navigate(`/jobs?category=${category}`);
        setIsMobileMenuOpen(false);
    };

    return (
        <nav className="sticky top-0 z-[100] bg-white h-20 flex items-center border-b border-slate-100">
            <div className="container mx-auto px-6 flex items-center justify-between h-full relative">

                {/* LEFT: BRAND & MAIN LINKS */}
                <div className="flex items-center gap-12">
                    <Link to="/" className="flex items-center gap-2 font-black text-xl text-slate-900 tracking-tighter">
                        <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center text-white text-sm shadow-lg shadow-teal-600/20">
                            <Briefcase className="w-4 h-4" />
                        </div>
                        <span>MaldivesCareer</span>
                    </Link>

                    <div className="hidden lg:flex items-center gap-8">
                        <Link to="/" className="text-sm font-bold text-slate-600 hover:text-teal-600 transition-colors">Home</Link>

                        {/* Jobs Hover Menu */}
                        <div className="relative group">
                            <button className="flex items-center gap-1 text-sm font-bold text-slate-600 hover:text-teal-600 transition-colors py-8">
                                Jobs <ChevronDown className="w-3.5 h-3.5 opacity-40 transition-transform group-hover:rotate-180" />
                            </button>

                            <div className="absolute top-full left-0 pt-2 hidden group-hover:block animate-in fade-in slide-in-from-top-2 duration-200 z-[110]">
                                <div className="bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 py-3 w-64 overflow-hidden ring-1 ring-slate-900/5">
                                    <button
                                        onClick={() => handleCategoryClick('All')}
                                        className="w-full text-left px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 hover:text-teal-600 transition-colors"
                                    >
                                        All Vacancies
                                    </button>
                                    <div className="h-px bg-slate-50 my-2 mx-4"></div>
                                    {INDUSTRIES.map((industry) => (
                                        <button
                                            key={industry}
                                            onClick={() => handleCategoryClick(industry)}
                                            className="w-full text-left px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 hover:text-teal-600 transition-colors"
                                        >
                                            {industry}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Contact Us Hover Menu */}
                        <div className="relative group">
                            <button className="flex items-center gap-1 text-sm font-bold text-slate-600 hover:text-teal-600 transition-colors py-8">
                                Contact Us <ChevronDown className="w-3.5 h-3.5 opacity-40 transition-transform group-hover:rotate-180" />
                            </button>

                            <div className="absolute top-full right-0 pt-2 hidden group-hover:block animate-in fade-in slide-in-from-top-2 duration-200 z-[110]">
                                <div className="bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 py-3 w-64 overflow-hidden ring-1 ring-slate-900/5">
                                    <div className="px-6 py-3">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Email Us</p>
                                        <a href="mailto:support@maldivescareer.com" className="text-sm font-bold text-slate-700 hover:text-teal-600 transition-colors block">
                                            support@maldivescareer.com
                                        </a>
                                    </div>
                                    <div className="h-px bg-slate-50 my-1 mx-4"></div>
                                    <div className="px-6 py-3">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">WhatsApp</p>
                                        <a href="https://wa.me/9609991234" target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-slate-700 hover:text-teal-600 transition-colors block">
                                            +960 999-1234
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT: PORTALS & AUTH */}
                <div className="flex items-center gap-4 lg:gap-6">
                    {!isAuthenticated && (
                        <div className="hidden xl:flex items-center gap-6 border-r border-slate-100 pr-6 mr-2">
                            <Link to="/login/agent" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">Agent Portal</Link>
                            <Link to="/login/admin" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">Admin Portal</Link>
                        </div>
                    )}

                    {isAuthenticated ? (
                        <div className="relative">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="flex items-center gap-3 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-full border border-slate-100 transition-all"
                            >
                                <div className="w-7 h-7 rounded-full bg-teal-600 flex items-center justify-center text-white font-black text-[10px]">
                                    {user?.name.charAt(0)}
                                </div>
                                <div className="hidden md:flex flex-col items-start">
                                    <span className="text-[10px] font-bold text-slate-800 leading-tight">{user?.name.split(' ')[0]}</span>
                                </div>
                                <ChevronDown className="w-3 h-3 opacity-40 hidden md:block" />
                            </button>

                            {isMenuOpen && (
                                <div className="absolute right-0 mt-4 w-60 bg-white rounded-2xl shadow-2xl border border-slate-100 py-3 overflow-hidden animate-in fade-in zoom-in-95 duration-200 ring-1 ring-slate-900/5 z-[120]">
                                    <Link to={user?.role === 'candidate' ? '/dashboard' : (user?.name === 'Platform Administrator' ? '/admin' : '/recruiter')} onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-6 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors">
                                        <LayoutDashboard className="w-4 h-4 text-slate-400" /> Dashboard
                                    </Link>
                                    <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-6 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors">
                                        <User className="w-4 h-4 text-slate-400" /> My Profile
                                    </Link>
                                    <div className="h-px bg-slate-50 my-2"></div>
                                    <button
                                        onClick={() => { logout(); setIsMenuOpen(false); navigate('/'); }}
                                        className="w-full text-left flex items-center gap-3 px-6 py-3 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors"
                                    >
                                        <LogOut className="w-4 h-4" /> Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="hidden lg:flex items-center gap-3">
                            <Link
                                to="/login"
                                className="text-[11px] font-black text-slate-500 hover:text-teal-600 px-4 py-2 uppercase tracking-widest transition-colors"
                            >
                                Log in
                            </Link>
                            <Link
                                to="/register"
                                className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-teal-600/20"
                            >
                                Sign Up
                            </Link>
                        </div>
                    )}

                    {/* MOBILE MENU BUTTON */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="lg:hidden p-2 text-slate-600 hover:text-teal-600 transition-colors"
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* MOBILE MENU OVERLAY */}
            {isMobileMenuOpen && (
                <div className="lg:hidden absolute top-20 left-0 w-full bg-white border-t border-slate-100 shadow-2xl h-[calc(100vh-80px)] overflow-y-auto animate-in fade-in slide-in-from-top-5 duration-200">
                    <div className="p-6 flex flex-col gap-6">
                        {!isAuthenticated && (
                            <div className="grid grid-cols-2 gap-4 pb-6 border-b border-slate-50">
                                <Link to="/login" className="flex items-center justify-center h-12 rounded-xl bg-slate-50 font-bold text-slate-700 text-sm">Log in</Link>
                                <Link to="/register" className="flex items-center justify-center h-12 rounded-xl bg-teal-600 font-bold text-white text-sm shadow-md shadow-teal-600/20">Sign Up</Link>
                            </div>
                        )}

                        <div className="space-y-2">
                            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="block py-3 text-sm font-black text-slate-900 uppercase tracking-widest">Home</Link>

                            {/* Mobile Jobs Accordion */}
                            <div>
                                <button
                                    onClick={() => setIsJobsOpen(!isJobsOpen)}
                                    className="w-full flex items-center justify-between py-3 text-sm font-black text-slate-900 uppercase tracking-widest"
                                >
                                    Jobs
                                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isJobsOpen ? 'rotate-180' : ''}`} />
                                </button>
                                {isJobsOpen && (
                                    <div className="pl-4 border-l-2 border-slate-100 mt-2 space-y-3 pb-2">
                                        <button onClick={() => handleCategoryClick('All')} className="block text-xs font-bold text-slate-500 hover:text-teal-600">All Vacancies</button>
                                        {INDUSTRIES.map(ind => (
                                            <button key={ind} onClick={() => handleCategoryClick(ind)} className="block text-xs font-bold text-slate-500 hover:text-teal-600">{ind}</button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <Link to="/support" onClick={() => setIsMobileMenuOpen(false)} className="block py-3 text-sm font-black text-slate-900 uppercase tracking-widest">Contact Us</Link>
                        </div>

                        {!isAuthenticated && (
                            <div className="mt-auto pt-8 border-t border-slate-50">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Portals</p>
                                <div className="flex flex-col gap-3">
                                    <Link to="/login/agent" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 text-xs font-bold text-slate-600">Agent Portal</Link>
                                    <Link to="/login/admin" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 text-xs font-bold text-slate-600">Admin Portal</Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
