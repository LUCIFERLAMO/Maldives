import mongoose from 'mongoose';

const agencySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true
    },
    contact: {
        type: String
    },
    location: {
        type: String
    },
    logo: {
        type: String, // URL
        default: "https://via.placeholder.com/150"
    },
    status: {
        type: String,
        enum: ['Pending', 'Active', 'Rejected'],
        default: 'Pending'
    },
    description: {
        type: String
    },
    website: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Agency', agencySchema);
