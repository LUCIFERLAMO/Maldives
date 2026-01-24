import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const applicationSchema = new mongoose.Schema({
    id: {
        type: String,
        default: uuidv4,
        unique: true
    },
    job_id: {
        type: String,
        required: true
    },
    candidate_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    contact_number: {
        type: String,
        required: true
    },
    // Optional: if submitted by an agent
    agent_id: {
        type: String,
        required: false
    },
    // File stored as Base64 in MongoDB
    resume: {
        filename: String,
        contentType: String,
        data: String // Base64 encoded file data
    },
    certificates: {
        filename: String,
        contentType: String,
        data: String // Base64 encoded file data (optional)
    },
    status: {
        type: String,
        enum: ['PENDING', 'REVIEWING', 'ACCEPTED', 'REJECTED'],
        default: 'PENDING'
    },
    applied_at: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

export default mongoose.model('Application', applicationSchema);
