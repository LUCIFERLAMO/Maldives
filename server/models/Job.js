import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const jobSchema = new mongoose.Schema({
    id: {
        type: String,
        default: uuidv4,
        unique: true
    },
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
        default: 'Other'
    },
    salary_range: {
        type: String,
        required: false
    },
    posted_date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['OPEN', 'CLOSED'],
        default: 'OPEN'
    },
    description: {
        type: String,
        required: true
    },
    requirements: {
        type: [String],
        default: []
    }
}, {
    timestamps: true
});

export default mongoose.model('Job', jobSchema);
