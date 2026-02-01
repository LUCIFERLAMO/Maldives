import mongoose from 'mongoose';

const SubscriptionSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        index: true
    },
    jobId: {
        type: String, // Can be MongoDB _id or custom ID
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Compound index to ensure unique subscription per user per job
SubscriptionSchema.index({ userId: 1, jobId: 1 }, { unique: true });

export default mongoose.model('Subscription', SubscriptionSchema);
