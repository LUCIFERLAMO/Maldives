/**
 * Validates a password based on specific security criteria:
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one digit
 * - At least one special character
 * 
 * @param {string} password - The password to validate
 * @returns {object} - An object containing validation status and specific criteria matches
 */
export const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLongEnough = password.length >= minLength;

    const isValid = hasUpperCase && hasLowerCase && hasNumber && hasSymbol && isLongEnough;

    return {
        isValid,
        criteria: {
            length: isLongEnough,
            upper: hasUpperCase,
            lower: hasLowerCase,
            number: hasNumber,
            symbol: hasSymbol
        },
        message: isValid ? 'Strong password' : 'Password does not meet requirements'
    };
};
