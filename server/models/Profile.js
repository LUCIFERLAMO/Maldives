import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const profileSchema = new mongoose.Schema({
    id: {
        type: String,
        default: uuidv4,
        unique: true
    },
    role: {
        type: String,
        enum: ['ADMIN', 'AGENT', 'CANDIDATE'],
        required: true
    },
    full_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: { // Storing plain/hashed password (ensure hashing in controller)
        type: String,
        required: true
    },
    contact_number: {
        type: String,
        required: false
    },
    // Agent Specific Fields
    agency_name: {
        type: String,
        required: function () { return this.role === 'AGENT'; }
    },
    license_number: {
        type: String,
        required: false
    },
    // Candidate Specific Fields
    skills: {
        type: [String],
        default: []
    },
    experience_years: {
        type: Number,
        default: 0
    },
    // Status
    status: {
        type: String,
        enum: ['ACTIVE', 'INACTIVE', 'BANNED'],
        default: 'ACTIVE'
    }
}, {
    timestamps: true
});

export default mongoose.model('Profile', profileSchema);
