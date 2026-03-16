import express from 'express';
import AuditLog from '../models/AuditLog.js';

const router = express.Router();

router.get("/audit-logs", async (req, res) => {
  try {
    const logs = await AuditLog
      .find()
      .sort({ timestamp: -1 })
      .limit(200);

    res.json(logs);
  } catch (err) {
    console.error('Failed to fetch audit logs:', err.message);
    res.status(500).json({ message: 'Failed to fetch audit logs', error: err.message });
  }
});

export default router;
