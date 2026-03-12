/**
 * Password validation utility
 * Checks that a password meets minimum security requirements:
 * - At least 6 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one digit
 * - At least one special character
 */
export const validatePassword = (password) => {
    if (!password) return {
        isValid: false,
        errors: ['Password is required'],
        criteria: { length: false, upper: false, lower: false, number: false, symbol: false }
    };

    const criteria = {
        length: password.length >= 6,
        upper: /[A-Z]/.test(password),
        lower: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        symbol: /[!@#$%^&*(),.?":{}|<>_\-+=~`[\]\\;'/]/.test(password),
    };

    const errors = [];
    if (!criteria.length) errors.push('At least 6 characters');
    if (!criteria.upper) errors.push('At least one uppercase letter');
    if (!criteria.lower) errors.push('At least one lowercase letter');
    if (!criteria.number) errors.push('At least one number');
    if (!criteria.symbol) errors.push('At least one special character');

    return {
        isValid: errors.length === 0,
        errors,
        criteria,
    };
};

export default validatePassword;
