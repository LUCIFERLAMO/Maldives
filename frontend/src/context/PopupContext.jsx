import React, { createContext, useContext, useState, useCallback } from 'react';
import CustomThemePopup from '../components/CustomThemePopup';

const PopupContext = createContext(null);

export const usePopup = () => {
    const context = useContext(PopupContext);
    if (!context) {
        throw new Error('usePopup must be used within a PopupProvider');
    }
    return context;
};

export const PopupProvider = ({ children }) => {
    const [popupState, setPopupState] = useState({
        isOpen: false,
        type: 'info',
        title: '',
        message: '',
        confirmText: 'OK',
        cancelText: 'Cancel',
        onConfirm: () => { },
        onCancel: () => { }
    });

    const closePopup = useCallback(() => {
        setPopupState(prev => ({ ...prev, isOpen: false }));
    }, []);

    const triggerPopup = useCallback(({ type = 'info', title, message, confirmText, cancelText, onConfirm, onCancel }) => {
        return new Promise((resolve) => {
            setPopupState({
                isOpen: true,
                type,
                title: title || (type === 'error' ? 'Error' : type === 'success' ? 'Success' : 'Notice'),
                message,
                confirmText: confirmText || (type === 'confirm' ? 'Confirm' : 'OK'),
                cancelText: cancelText || 'Cancel',
                onConfirm: () => {
                    if (onConfirm) onConfirm();
                    resolve(true); // Resolve promise true for confirmation
                    setPopupState(prev => ({ ...prev, isOpen: false }));
                },
                onCancel: () => {
                    if (onCancel) onCancel();
                    resolve(false); // Resolve promise false for cancellation
                    setPopupState(prev => ({ ...prev, isOpen: false }));
                }
            });
        });
    }, []);

    const popup = {
        alert: (message, title = 'Alert') => triggerPopup({ type: 'info', title, message }),
        success: (message, title = 'Success') => triggerPopup({ type: 'success', title, message }),
        error: (message, title = 'Error') => triggerPopup({ type: 'error', title, message }),
        warning: (message, title = 'Warning') => triggerPopup({ type: 'warning', title, message }),
        confirm: (message, title = 'Confirm Action', confirmText = 'Yes, Proceed', cancelText = 'Cancel') =>
            triggerPopup({ type: 'confirm', title, message, confirmText, cancelText })
    };

    return (
        <PopupContext.Provider value={popup}>
            {children}
            <CustomThemePopup
                isOpen={popupState.isOpen}
                type={popupState.type}
                title={popupState.title}
                message={popupState.message}
                confirmText={popupState.confirmText}
                cancelText={popupState.cancelText}
                onConfirm={popupState.onConfirm}
                onCancel={popupState.onCancel}
            />
        </PopupContext.Provider>
    );
};
