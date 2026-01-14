import React from 'react';
import { useAuth } from '../context/AuthContext';

export const DashboardHeader = ({ onMenuClick, searchQuery, onSearchChange, title }) => {
    const { user } = useAuth();
    return (
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 z-40 sticky top-0 shadow-sm">

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



            </div>
        </header>
    );
};
