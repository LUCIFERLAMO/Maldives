import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const jobRequestSchema = new mongoose.Schema({
    id: {
        type: String,
        default: uuidv4,
        unique: true
    },
    // Agent who submitted the request
    agent_id: {
        type: String,
        required: true
    },
    agent_name: {
        type: String,
        required: true
    },
    agent_email: {
        type: String,
        required: true
    },
    agency_name: {
        type: String,
        required: false
    },
    // Job Details
    title: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['Hospitality', 'Construction', 'Healthcare', 'IT', 'Education', 'Retail', 'Manufacturing', 'Tourism', 'Fishing', 'Agriculture', 'Other'],
        required: true
    },
    salary_range: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: true
    },
    requirements: {
        type: [String],
        default: []
    },
    vacancies: {
        type: Number,
        default: 1
    },
    // Request Status
    status: {
        type: String,
        enum: ['PENDING', 'APPROVED', 'REJECTED'],
        default: 'PENDING'
    },
    // Admin review
    reviewed_by: {
        type: String,
        default: null
    },
    review_notes: {
        type: String,
        default: null
    },
    reviewed_at: {
        type: Date,
        default: null
    },
    // When approved, this links to the created job
    approved_job_id: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});

export default mongoose.model('JobRequest', jobRequestSchema);
