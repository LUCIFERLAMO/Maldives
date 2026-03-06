import mongoose from 'mongoose';

const DocumentSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true,
        index: true
    },
    document_type: {
        type: String, // e.g., 'RESUME', 'PASSPORT', 'LICENSE'
        required: true
    },
    filename: {
        type: String,
        required: true
    },
    content_type: {
        type: String, // MIME type
        required: true
    },
    file_data: {
        type: String, // Base64 encoded data
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

const Document = mongoose.model('Document', DocumentSchema);

export default Document;
