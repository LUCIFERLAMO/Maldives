import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import multer from 'multer';
import { GridFsStorage } from 'multer-gridfs-storage';
import crypto from 'crypto';

// Configure dotenv
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/maldives-career';

// Global GridFS Bucket Variable
let gfs, gridfsBucket;

console.log('Attempting to connect to MongoDB...');

const conn = mongoose.createConnection(MONGODB_URI);

conn.once('open', () => {
    console.log('Connected to MongoDB Cloud (Atlas)');
    // Init GridFS
    gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: 'uploads'
    });
    gfs = gridfsBucket;
});

// Create storage engine
const storage = new GridFsStorage({
    url: MONGODB_URI,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: 'uploads'
                };
                resolve(fileInfo);
            });
        });
    }
});

const upload = multer({ storage });

// Regular Mongoose Connection (for Models)
mongoose.connect(MONGODB_URI)
    .then(() => console.log('Mongoose connected'))
    .catch(err => console.log(err));

// Import Models
import Job from './models/Job.js';
import Application from './models/Application.js';
import Profile from './models/Profile.js';

// --- ROUTES ---

// Health Check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        mode: MONGODB_URI.includes('localhost') ? 'local' : 'cloud'
    });
});

// AUTH ROUTES
app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password, role, name, agencyName, skills } = req.body;

        // Check if user exists
        const existingUser = await Profile.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const newProfile = new Profile({
            full_name: name,
            email,
            password, // NOTE: In production, hash this password with bcrypt!
            role,
            agency_name: role === 'AGENT' ? agencyName : undefined,
            skills: role === 'CANDIDATE' ? skills : undefined
        });

        await newProfile.save();
        res.status(201).json({ message: 'User registered successfully', user: newProfile });
    } catch (err) {
        res.status(500).json({ message: 'Registration failed', error: err.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password, role } = req.body;

        // Check user
        const user = await Profile.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Validate password
        if (user.password !== password) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Validate role access
        if (user.role !== role) {
            return res.status(403).json({ message: `Access denied. This account is not a ${role}.` });
        }

        res.json({ message: 'Login successful', user });
    } catch (err) {
        res.status(500).json({ message: 'Login failed', error: err.message });
    }
});

// JOBS ROUTES
app.get('/api/jobs', async (req, res) => {
    try {
        const jobs = await Job.find().sort({ posted_date: -1 });
        res.json(jobs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get('/api/jobs/:id', async (req, res) => {
    try {
        const job = await Job.findOne({ id: req.params.id });
        if (!job && mongoose.Types.ObjectId.isValid(req.params.id)) {
            const jobById = await Job.findById(req.params.id);
            if (jobById) return res.json(jobById);
        }

        if (!job) return res.status(404).json({ message: 'Job not found' });
        res.json(job);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// APPLICATIONS ROUTES
// POST: Submit Application with Resume
app.post('/api/applications', upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No resume uploaded' });
        }

        const newApplication = new Application({
            job_id: req.body.job_id,
            candidate_name: req.body.name, // Frontend sends 'name', schema expects 'candidate_name'
            email: req.body.email,
            contact_number: req.body.contact,
            resume_file_id: req.file.id, // GridFS ID
            status: 'PENDING'
        });

        const savedApp = await newApplication.save();
        res.status(201).json(savedApp);
    } catch (err) {
        console.error('Application Error:', err);
        res.status(500).json({ message: 'Failed to submit application', error: err.message });
    }
});

// GET: Download File by Filename
app.get('/api/files/:filename', async (req, res) => {
    try {
        const file = await conn.db.collection('uploads.files').findOne({ filename: req.params.filename });
        if (!file) {
            return res.status(404).json({ err: 'No file exists' });
        }

        const readStream = gridfsBucket.openDownloadStreamByName(req.params.filename);
        readStream.pipe(res);
    } catch (err) {
        res.status(500).json({ err: 'Error retrieving file' });
    }
});


// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
