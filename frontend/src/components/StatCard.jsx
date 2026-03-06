import React from 'react';

export const StatCard = ({ label, value, icon: Icon, color }) => {
    const colorMap = {
        teal: 'text-teal-600',
        amber: 'text-amber-600',
        red: 'text-red-600',
        slate: 'text-slate-900'
    };

    const bgMap = {
        teal: 'bg-teal-50',
        amber: 'bg-amber-50',
        red: 'bg-red-50',
        slate: 'bg-slate-50'
    };

    return (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">{label}</p>
                    <div className="flex items-baseline gap-2">
                        <span className={`text-4xl font-bold ${colorMap[color]} tracking-tight`}>{value}</span>
                    </div>
                </div>
                <div className={`p-3 rounded-lg ${bgMap[color]}`}>
                    <Icon className={`w-6 h-6 ${colorMap[color]}`} />
                </div>
            </div>
        </div>
    );
};
