import React from 'react';
import { LayoutDashboard, Briefcase, UserCheck, Globe2, UserPlus, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const DashboardSidebar = ({ activeTab, setActiveTab, isOpen = false, onClose }) => {
    const { logout } = useAuth();

    // Auto-close on mobile when selecting an item
    const handleTabClick = (id) => {
        setActiveTab(id);
        if (window.innerWidth < 1024 && onClose) {
            onClose();
        }
    };

    const navItems = [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'vacancies', label: 'Vacancies', icon: Briefcase },
        { id: 'network', label: 'Agencies', icon: Globe2 },
        { id: 'create_profile', label: 'Provisioning', icon: UserPlus },
    ];

    return (
        <>
            {/* Mobile Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/50 z-20 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={onClose}
                />
            )}

            <aside className={`
                fixed lg:static top-0 left-0 h-screen w-72 bg-slate-900 text-slate-300 flex flex-col z-30
                transition-transform duration-300 ease-in-out border-r border-slate-800
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="h-20 flex flex-col justify-center px-6 border-b border-slate-900/50 bg-slate-900">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-teal-500 border border-teal-500/30">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-white text-sm tracking-widest uppercase">Governance Hub</span>
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Admin Control</span>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
                    {[
                        { id: 'overview', label: 'OVERVIEW', icon: LayoutDashboard },
                        { id: 'audit', label: 'AUDIT QUEUE', icon: UserCheck },
                        { id: 'vacancies', label: 'VACANCY\nMANAGEMENT', icon: Briefcase },
                        { id: 'agents', label: 'AGENT ECOSYSTEM', icon: Globe2 },
                    ].map((item) => {
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => handleTabClick(item.id)}
                                className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg text-[10px] font-black tracking-widest uppercase transition-all duration-200 ${isActive
                                    ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/20'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                                <span className="text-left leading-tight">{item.label}</span>
                            </button>
                        );
                    })}
                </nav>

                {/* User / Logout */}
                <div className="p-4 border-t border-slate-800 bg-slate-900">
                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-slate-800 hover:text-red-300 transition-all"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>
        </>
    );
};
