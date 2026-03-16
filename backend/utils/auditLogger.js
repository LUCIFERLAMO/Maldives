import AuditLog from '../models/AuditLog.js';

const logAudit = async (user, role, method, url, ip, statusCode) => {
    try {
        await AuditLog.create({
            user,
            role,
            method,
            url,
            ip,
            statusCode,
            timestamp: new Date()
        });
    } catch (err) {
        console.error('Audit log error:', err.message);
    }
};

export default logAudit;