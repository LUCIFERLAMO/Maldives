import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import CustomThemePopup from '../components/CustomThemePopup';
import ToastContainer from '../components/ToastContainer';

const PopupContext = createContext(null);

export const usePopup = () => {
    const context = useContext(PopupContext);
    if (!context) throw new Error('usePopup must be used within a PopupProvider');
    return context;
};

const MAX_TOASTS = 3;
let toastIdCounter = 0;

export const PopupProvider = ({ children }) => {
    // ─── Toast State ──────────────────────────────────────────────────────────
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((type, message) => {
        const id = ++toastIdCounter;
        setToasts(prev => {
            const next = [{ id, type, message }, ...prev];
            return next.slice(0, MAX_TOASTS); // cap at 3
        });
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    // ─── Confirm Modal State ──────────────────────────────────────────────────
    const [modalState, setModalState] = useState({
        isOpen: false,
        type: 'confirm',
        title: '',
        message: '',
        confirmText: 'Confirm',
        cancelText: 'Cancel',
        onConfirm: () => {},
        onCancel: () => {},
    });

    const closeModal = useCallback(() => {
        setModalState(prev => ({ ...prev, isOpen: false }));
    }, []);

    const triggerConfirm = useCallback(({ type = 'confirm', title, message, confirmText, cancelText }) => {
        return new Promise((resolve) => {
            setModalState({
                isOpen: true,
                type,
                title: title || 'Confirm Action',
                message,
                confirmText: confirmText || 'Yes, Proceed',
                cancelText: cancelText || 'Cancel',
                onConfirm: () => {
                    resolve(true);
                    setModalState(prev => ({ ...prev, isOpen: false }));
                },
                onCancel: () => {
                    resolve(false);
                    setModalState(prev => ({ ...prev, isOpen: false }));
                },
            });
        });
    }, []);

    // ─── Public API (same interface as before) ────────────────────────────────
    const popup = {
        // Non-blocking toasts
        success: (message) => addToast('success', message),
        error:   (message) => addToast('error', message),
        warning: (message) => addToast('warning', message),
        info:    (message) => addToast('info', message),
        alert:   (message) => addToast('info', message),
        // Blocking confirm modal (returns Promise<boolean>)
        confirm: (message, title, confirmText, cancelText) =>
            triggerConfirm({ type: 'confirm', title, message, confirmText, cancelText }),
    };

    return (
        <PopupContext.Provider value={popup}>
            {children}

            {/* Non-blocking toasts — bottom-right */}
            <ToastContainer toasts={toasts} onRemove={removeToast} />

            {/* Blocking confirm modal */}
            <CustomThemePopup
                isOpen={modalState.isOpen}
                type={modalState.type}
                title={modalState.title}
                message={modalState.message}
                confirmText={modalState.confirmText}
                cancelText={modalState.cancelText}
                onConfirm={modalState.onConfirm}
                onCancel={modalState.onCancel}
            />
        </PopupContext.Provider>
    );
};
