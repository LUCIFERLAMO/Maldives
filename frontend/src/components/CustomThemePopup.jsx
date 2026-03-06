import React, { useEffect, useState } from 'react';
import { X, CheckCircle2, AlertTriangle, Info, AlertOctagon } from 'lucide-react';

const CustomThemePopup = ({ isOpen, type = 'info', title, message, onConfirm, onCancel, confirmText = 'OK', cancelText = 'Cancel' }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setVisible(true);
        } else {
            const timer = setTimeout(() => setVisible(false), 300); // Wait for exit animation
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!visible && !isOpen) return null;

    // Theme Config based on type
    const themes = {
        success: {
            icon: CheckCircle2,
            color: 'text-teal-600',
            bg: 'bg-teal-50',
            border: 'border-teal-100',
            btn: 'bg-teal-600 hover:bg-teal-700',
            ring: 'focus:ring-teal-500'
        },
        error: {
            icon: AlertOctagon,
            color: 'text-red-600',
            bg: 'bg-red-50',
            border: 'border-red-100',
            btn: 'bg-red-600 hover:bg-red-700',
            ring: 'focus:ring-red-500'
        },
        warning: {
            icon: AlertTriangle,
            color: 'text-amber-600',
            bg: 'bg-amber-50',
            border: 'border-amber-100',
            btn: 'bg-amber-600 hover:bg-amber-700',
            ring: 'focus:ring-amber-500'
        },
        info: {
            icon: Info,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
            border: 'border-blue-100',
            btn: 'bg-blue-600 hover:bg-blue-700',
            ring: 'focus:ring-blue-500'
        },
        confirm: {
            icon: Info, // Or QuestionMark
            color: 'text-slate-800',
            bg: 'bg-slate-50',
            border: 'border-slate-200',
            btn: 'bg-slate-900 hover:bg-slate-800',
            ring: 'focus:ring-slate-500'
        }
    };

    const theme = themes[type] || themes.info;
    const Icon = theme.icon;

    return (
        <div className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            {/* Backdrop */}
            <div className={`absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`} onClick={type !== 'confirm' ? onCancel : undefined} />

            {/* Modal Card */}
            <div className={`
                bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 ease-out border border-white/20
                ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}
            `}>
                {/* Header Decoration */}
                <div className={`h-2 w-full ${theme.btn}`} />

                <div className="p-6 md:p-8">
                    <div className="flex flex-col items-center text-center">
                        {/* Icon */}
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 shadow-sm border-4 border-white ${theme.bg} ${theme.color}`}>
                            <Icon className="w-8 h-8" strokeWidth={2.5} />
                        </div>

                        {/* Content */}
                        <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
                        <p className="text-slate-500 text-sm leading-relaxed mb-8">{message}</p>

                        {/* Actions */}
                        <div className="flex items-center gap-3 w-full">
                            {(type === 'confirm' || type === 'warning') && (
                                <button
                                    onClick={onCancel}
                                    className="flex-1 px-4 py-2.5 bg-white text-slate-700 border border-slate-200 rounded-xl text-sm font-bold hover:bg-slate-50 hover:border-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-200"
                                >
                                    {cancelText}
                                </button>
                            )}
                            <button
                                onClick={onConfirm}
                                className={`flex-1 px-4 py-2.5 text-white rounded-xl text-sm font-bold shadow-lg shadow-current/20 transition-all transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 ${theme.btn} ${theme.ring}`}
                            >
                                {confirmText}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomThemePopup;
