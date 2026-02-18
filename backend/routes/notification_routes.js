import express from 'express';
import Subscription from '../models/Subscription.js';
import Notification from '../models/Notification.js';
import Job from '../models/Job.js';

const router = express.Router();

// ================= SUBSCRIPTIONS =================

// TOGGLE SUBSCRIPTION (Subscribe/Unsubscribe)
router.post('/subscribe', async (req, res) => {
    try {
        const { userId, jobId } = req.body;

        if (!userId || !jobId) {
            return res.status(400).json({ message: 'User ID and Job ID are required' });
        }

        const existing = await Subscription.findOne({ userId, jobId });

        if (existing) {
            await Subscription.deleteOne({ _id: existing._id });
            return res.json({ subscribed: false, message: 'Unsubscribed from job alerts' });
        } else {
            const newSub = new Subscription({ userId, jobId });
            await newSub.save();
            return res.json({ subscribed: true, message: 'Subscribed to job alerts' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to toggle subscription', error: error.message });
    }
});

// CHECK SUBSCRIPTION STATUS
router.get('/subscription/check', async (req, res) => {
    try {
        const { userId, jobId } = req.query;
        if (!userId || !jobId) return res.json({ subscribed: false });

        const existing = await Subscription.findOne({ userId, jobId });
        res.json({ subscribed: !!existing });
    } catch (error) {
        res.status(500).json({ message: 'Error checking subscription', error: error.message });
    }
});

// GET USER SUBSCRIPTIONS
router.get('/subscriptions/:userId', async (req, res) => {
    try {
        const subs = await Subscription.find({ userId: req.params.userId }).sort({ createdAt: -1 });
        // Optionally populate Job details if needed, but for now just IDs
        res.json(subs);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch subscriptions', error: error.message });
    }
});

// ================= NOTIFICATIONS =================

// GET USER NOTIFICATIONS
router.get('/notifications/:userId', async (req, res) => {
    try {
        const notes = await Notification.find({ userId: req.params.userId }).sort({ createdAt: -1 }).limit(50);
        const unreadCount = await Notification.countDocuments({ userId: req.params.userId, isRead: false });
        res.json({ notifications: notes, unreadCount });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch notifications', error: error.message });
    }
});

// MARK AS READ
router.put('/notifications/:id/read', async (req, res) => {
    try {
        await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update notification', error: error.message });
    }
});

// MARK ALL AS READ
router.put('/notifications/user/:userId/read-all', async (req, res) => {
    try {
        await Notification.updateMany({ userId: req.params.userId, isRead: false }, { isRead: true });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ message: 'Failed to mark all as read', error: error.message });
    }
});

export default router;
