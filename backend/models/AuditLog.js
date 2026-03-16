import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
    user: { type: String, required: true },
    role: { type: String, required: true },
    method: { type: String, required: true },
    url: { type: String, required: true },
    ip: { type: String },
    statusCode: { type: mongoose.Schema.Types.Mixed },
    timestamp: { type: Date, default: Date.now }
});

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

export default AuditLog;