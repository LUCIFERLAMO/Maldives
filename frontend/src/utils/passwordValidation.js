/**
 * Password validation utility
 * Checks that a password meets minimum security requirements:
 * - At least 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one digit
 * - At least one special character
 */
export const validatePassword = (password) => {
    if (!password) return { isValid: false, errors: ['Password is required'] };

    const errors = [];

    if (password.length < 8) errors.push('At least 8 characters');
    if (!/[A-Z]/.test(password)) errors.push('At least one uppercase letter');
    if (!/[a-z]/.test(password)) errors.push('At least one lowercase letter');
    if (!/[0-9]/.test(password)) errors.push('At least one number');
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errors.push('At least one special character');

    return {
        isValid: errors.length === 0,
        errors,
    };
};

export default validatePassword;
