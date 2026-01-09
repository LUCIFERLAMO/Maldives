import React from 'react';
import { LayoutDashboard, Briefcase, UserCheck, Globe2, UserPlus, LogOut, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface DashboardSidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    isOpen?: boolean;
    onClose?: () => void;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ activeTab, setActiveTab, isOpen = false, onClose }) => {
    const { logout } = useAuth();

    // Auto-close on mobile when selecting an item
    const handleTabClick = (id: string) => {
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
                {/* Brand */}
                <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800 bg-slate-900">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-teal-900/50">
                            M
                        </div>
                        <span className="font-bold text-white text-lg tracking-tight">MaldivesCareer</span>
                    </div>
                    {/* Mobile Close Button */}
                    <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-white">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto custom-scrollbar">
                    {navItems.map((item) => {
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => handleTabClick(item.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                                    ? 'bg-teal-600 text-white shadow-lg shadow-teal-900/20'
                                    : 'hover:bg-slate-800 hover:text-white'
                                    }`}
                            >
                                <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                                {item.label}
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
