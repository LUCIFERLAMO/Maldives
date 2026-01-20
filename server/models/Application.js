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
    resume_file_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'uploads.files' // References GridFS file
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
