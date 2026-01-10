import React from 'react';
import { useAuth } from '../context/AuthContext';

export const DashboardHeader = ({ onMenuClick, searchQuery, onSearchChange, title }) => {
    const { user } = useAuth();
    return (
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 z-10 sticky top-0 shadow-sm">

            {/* Left Brand Area */}
            {/* Left Brand Area */}
            <div className="flex items-center gap-12">
                <div className="flex items-center gap-3">
                    <span className="font-extrabold text-teal-600 text-lg tracking-tight">{title}</span>
                </div>

                <span className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] pt-1">Governance Hub</span>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2 md:gap-6">
                <div className="flex items-center gap-3">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-bold text-slate-900 leading-none">Platform Administrator</p>
                        <p className="text-[10px] text-slate-400 mt-1 font-black uppercase tracking-widest">Platform Admin</p>
                    </div>
                    <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center border-2 border-white shadow-sm overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Profile" className="w-full h-full object-cover" />
                    </div>
                </div>


            </div>
        </header>
    );
};
