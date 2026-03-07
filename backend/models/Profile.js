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
    // Profile Avatar
    avatar: {
        type: String,  // base64 data URL or URL to hosted image
        required: false
    },
    experience_years: {
        type: Number,
        default: 0
    },
    location: {
        type: String,
        required: false,
        default: ''
    },
    savedJobs: {
        type: [String], // Array of Job IDs (custom string IDs or ObjectIds as strings)
        default: []
    },
    // Agent Application Documents
    documents: {
        identity: {
            filename: String,
            contentType: String,
            data: String
        },
        license: {
            filename: String,
            contentType: String,
            data: String
        },
        profile: {
            filename: String,
            contentType: String,
            data: String
        }
    },
    // Status
    status: {
        type: String,
        enum: ['ACTIVE', 'INACTIVE', 'BANNED', 'PENDING', 'ON_HOLD'],
        default: 'ACTIVE'
    },
    // First Login Detection (for agents with temp password)
    requiresPasswordChange: {
        type: Boolean,
        default: false
    },
    // Store temporary password (admin-generated)
    temporaryPassword: {
        type: String,
        required: false
    },
    // Link to Agency (for agents)
    agencyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Agency',
        required: false
    },
    // Google OAuth - stores Google's unique user ID (sub) for account linking
    googleId: {
        type: String,
        required: false,
        default: null
    },
    // Password Reset via Email
    resetPasswordToken: {
        type: String,
        required: false,
        default: null
    },
    resetPasswordExpires: {
        type: Date,
        required: false,
        default: null
    }
}, {
    timestamps: true
});

export default mongoose.model('Profile', profileSchema);
