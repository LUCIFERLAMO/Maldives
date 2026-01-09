import React from 'react';
import { Search, Bell, Settings, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface DashboardHeaderProps {
    onMenuClick?: () => void;
    searchQuery?: string;
    onSearchChange?: (query: string) => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onMenuClick, searchQuery, onSearchChange }) => {
    const { user } = useAuth();
    return (
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 z-10 sticky top-0 shadow-sm">

            <div className="flex items-center gap-4">
                {/* Mobile Menu Trigger */}
                <button
                    onClick={onMenuClick}
                    className="p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg lg:hidden"
                >
                    <Menu className="w-6 h-6" />
                </button>

                {/* Search Bar */}
                <div className="hidden md:flex items-center w-96 relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-teal-600 transition-colors" />
                    <input
                        type="text"
                        value={searchQuery || ''}
                        onChange={(e) => onSearchChange?.(e.target.value)}
                        placeholder="Search candidates, vacancies..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-teal-500/20 focus:bg-white transition-all text-slate-700 placeholder:text-slate-400 font-medium"
                    />
                </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2 md:gap-4">
                <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-teal-500 rounded-full border-2 border-white"></span>
                </button>
                <button className="hidden md:block p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
                    <Settings className="w-5 h-5" />
                </button>

                <div className="h-8 w-px bg-slate-200 mx-2 hidden md:block"></div>

                <div className="flex items-center gap-3">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-semibold text-slate-900 leading-none">Admin User</p>
                        <p className="text-xs text-slate-500 mt-1 font-medium">Administrator</p>
                    </div>
                    <div className="w-9 h-9 bg-teal-100 rounded-full flex items-center justify-center border-2 border-white shadow-sm overflow-hidden">
                        <img src="https://ui-avatars.com/api/?name=Admin+User&background=0d9488&color=fff" alt="Profile" className="w-full h-full object-cover" />
                    </div>
                </div>
            </div>
        </header>
    );
};
