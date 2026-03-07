import React, { useEffect, useState } from 'react';
import { ShieldAlert, Trash2, AlertTriangle, HelpCircle } from 'lucide-react';

/**
 * CustomThemePopup — used ONLY for confirm/destructive modals.
 * Non-confirm notifications (success/error/info/warning) are handled
 * by ToastContainer via PopupContext.
 */
const CustomThemePopup = ({
    isOpen,
    type = 'confirm',
    title,
    message,
    onConfirm,
    onCancel,
    confirmText = 'Yes, Proceed',
    cancelText = 'Cancel',
}) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setMounted(true);
        } else {
            const t = setTimeout(() => setMounted(false), 300);
            return () => clearTimeout(t);
        }
    }, [isOpen]);

    if (!mounted && !isOpen) return null;

    const themes = {
        confirm: {
            icon: HelpCircle,
            iconBg: 'bg-slate-100',
            iconColor: 'text-slate-700',
            bar: 'from-slate-700 to-slate-900',
            confirmBtn: 'bg-slate-900 hover:bg-slate-700 text-white',
        },
        danger: {
            icon: Trash2,
            iconBg: 'bg-red-50',
            iconColor: 'text-red-600',
            bar: 'from-red-500 to-red-700',
            confirmBtn: 'bg-red-600 hover:bg-red-700 text-white',
        },
        warning: {
            icon: AlertTriangle,
            iconBg: 'bg-amber-50',
            iconColor: 'text-amber-600',
            bar: 'from-amber-500 to-orange-500',
            confirmBtn: 'bg-amber-600 hover:bg-amber-700 text-white',
        },
    };

    const theme = themes[type] || themes.confirm;
    const Icon = theme.icon;

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
            className={`fixed inset-0 z-[99998] flex items-center justify-center p-4 transition-all duration-300 ${
                isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
        >
            {/* Backdrop */}
            <div
                className={`absolute inset-0 bg-slate-900/60 backdrop-blur-[6px] transition-opacity duration-300 ${
                    isOpen ? 'opacity-100' : 'opacity-0'
                }`}
                onClick={onCancel}
            />

            {/* Modal Card */}
            <div
                className={`relative bg-white w-full max-w-[420px] rounded-3xl shadow-[0_24px_64px_rgba(0,0,0,0.18)] overflow-hidden transform transition-all duration-300 ease-out ${
                    isOpen ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-4 opacity-0'
                }`}
            >
                {/* Top gradient accent */}
                <div className={`h-1.5 w-full bg-gradient-to-r ${theme.bar}`} />

                <div className="p-8 flex flex-col items-center text-center">
                    {/* Icon */}
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-5 ${theme.iconBg}`}>
                        <Icon className={`w-8 h-8 ${theme.iconColor}`} strokeWidth={1.8} />
                    </div>

                    {/* Text */}
                    <h3 id="confirm-title" className="text-xl font-black text-slate-900 mb-2 tracking-tight">
                        {title}
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed mb-8 max-w-xs">
                        {message}
                    </p>

                    {/* Buttons */}
                    <div className="flex gap-3 w-full">
                        <button
                            onClick={onCancel}
                            className="flex-1 px-5 py-3 bg-white text-slate-700 border-2 border-slate-200 rounded-xl text-sm font-bold hover:bg-slate-50 hover:border-slate-300 transition-all"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={onConfirm}
                            className={`flex-1 px-5 py-3 rounded-xl text-sm font-bold shadow-lg transition-all active:scale-95 ${theme.confirmBtn}`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomThemePopup;
