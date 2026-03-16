import AuditLog from '../models/AuditLog.js';

const logAudit = (user, role, method, url, ip, statusCode) => {
    AuditLog.create({
        user:       user       || 'anonymous',
        role:       role       || 'guest',
        method:     method     || 'UNKNOWN',
        url:        url        || '/',
        ip:         ip         || 'unknown',
        statusCode: statusCode ?? 0,
        timestamp:  new Date()
    }).then(() => {
        console.log(`[AuditLog] Saved: ${method} ${url} ${statusCode}`);
    }).catch(err => {
        console.error('[AuditLog] FAILED to write:', err.message, { user, role, method, url, ip, statusCode });
    });
};

export default logAudit;