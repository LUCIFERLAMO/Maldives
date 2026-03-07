import React, { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';

// ─── Individual Toast ──────────────────────────────────────────────────────────
const Toast = ({ id, type, message, onRemove }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Trigger slide-in
        const enterTimer = requestAnimationFrame(() => setVisible(true));
        // Auto-dismiss
        const exitTimer = setTimeout(() => {
            setVisible(false);
            setTimeout(() => onRemove(id), 350);
        }, 3500);
        return () => {
            cancelAnimationFrame(enterTimer);
            clearTimeout(exitTimer);
        };
    }, [id, onRemove]);

    const handleClose = () => {
        setVisible(false);
        setTimeout(() => onRemove(id), 350);
    };

    const config = {
        success: {
            icon: CheckCircle2,
            bar: 'bg-teal-500',
            iconColor: 'text-teal-500',
            iconBg: 'bg-teal-50',
        },
        error: {
            icon: XCircle,
            bar: 'bg-red-500',
            iconColor: 'text-red-500',
            iconBg: 'bg-red-50',
        },
        warning: {
            icon: AlertTriangle,
            bar: 'bg-amber-500',
            iconColor: 'text-amber-500',
            iconBg: 'bg-amber-50',
        },
        info: {
            icon: Info,
            bar: 'bg-blue-500',
            iconColor: 'text-blue-500',
            iconBg: 'bg-blue-50',
        },
    };

    const { icon: Icon, bar, iconColor, iconBg } = config[type] || config.info;

    return (
        <div
            role="alert"
            aria-live="polite"
            style={{
                transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: visible ? 'translateX(0) scale(1)' : 'translateX(100%) scale(0.95)',
                opacity: visible ? 1 : 0,
                marginBottom: '10px',
            }}
            className="w-full max-w-[360px] bg-white rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-slate-100 overflow-hidden flex items-stretch"
        >
            {/* Left accent bar */}
            <div className={`w-1 shrink-0 ${bar}`} />

            {/* Icon */}
            <div className={`flex items-center justify-center w-11 shrink-0 ${iconBg}`}>
                <Icon className={`w-5 h-5 ${iconColor}`} strokeWidth={2.5} />
            </div>

            {/* Message */}
            <p className="flex-1 px-3 py-3.5 text-sm font-semibold text-slate-800 leading-snug">
                {message}
            </p>

            {/* Close button */}
            <button
                onClick={handleClose}
                className="flex items-center justify-center w-10 shrink-0 text-slate-300 hover:text-slate-600 hover:bg-slate-50 transition-colors"
                aria-label="Dismiss notification"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
};

// ─── Toast Container ───────────────────────────────────────────────────────────
const ToastContainer = ({ toasts, onRemove }) => {
    if (!toasts || toasts.length === 0) return null;

    return (
        <div
            aria-label="Notifications"
            style={{ zIndex: 99999 }}
            className="fixed bottom-5 right-5 flex flex-col-reverse items-end pointer-events-none"
        >
            {toasts.map((toast) => (
                <div key={toast.id} className="pointer-events-auto">
                    <Toast
                        id={toast.id}
                        type={toast.type}
                        message={toast.message}
                        onRemove={onRemove}
                    />
                </div>
            ))}
        </div>
    );
};

export default ToastContainer;
