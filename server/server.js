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
import Agency from './models/Agency.js';
import JobRequest from './models/JobRequest.js';

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
        const { email, password, role, name, agencyName, skills, contact } = req.body;

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
            contact_number: contact,
            agency_name: role === 'AGENT' ? agencyName : undefined,
            skills: role === 'CANDIDATE' ? skills : undefined,
            status: role === 'AGENT' ? 'PENDING' : 'ACTIVE' // Agents need admin approval
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

        // Validate password (check both regular and temporary password)
        const isValidPassword = user.password === password || user.temporaryPassword === password;
        if (!isValidPassword) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Validate role access
        if (user.role !== role) {
            return res.status(403).json({ message: `Access denied. This account is not a ${role}.` });
        }

        // Block banned/rejected users from logging in
        if (user.status === 'BANNED') {
            return res.status(403).json({ message: 'Your account has been blocked. Please contact support.' });
        }

        // Check if agent needs to change password (first login)
        const requiresPasswordChange = user.requiresPasswordChange || false;

        res.json({
            message: 'Login successful',
            user: {
                id: user.id,
                _id: user._id,
                full_name: user.full_name,
                email: user.email,
                role: user.role,
                agency_name: user.agency_name,
                status: user.status // Include status for approval check
            },
            requiresPasswordChange
        });
    } catch (err) {
        res.status(500).json({ message: 'Login failed', error: err.message });
    }
});

// PASSWORD RESET ROUTE (For agents to reset their password with old password verification)
app.post('/api/auth/reset-password', async (req, res) => {
    try {
        const { email, oldPassword, newPassword } = req.body;

        // Find user by email
        const user = await Profile.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify old password
        const isValidOldPassword = user.password === oldPassword || user.temporaryPassword === oldPassword;
        if (!isValidOldPassword) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }

        // Update to new password
        user.password = newPassword; // NOTE: In production, hash this!
        user.temporaryPassword = undefined; // Clear any temp password
        user.requiresPasswordChange = false;
        await user.save();

        res.json({ message: 'Password updated successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to reset password', error: err.message });
    }
});

// PASSWORD CHANGE ROUTE (For first-time agents)
app.put('/api/auth/change-password', async (req, res) => {
    try {
        const { email, agentId, newPassword } = req.body;

        // Find user by email or agentId
        let user;
        if (email) {
            user = await Profile.findOne({ email });
        } else if (agentId) {
            user = await Profile.findById(agentId);
        }

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update password and clear the flag
        user.password = newPassword; // NOTE: In production, hash this!
        user.requiresPasswordChange = false;
        user.temporaryPassword = undefined; // Remove temp password
        await user.save();

        res.json({ message: 'Password updated successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to update password', error: err.message });
    }
});

// ADMIN AGENT ROUTES (From Profile model - for agents registered via agent-registration page)

// GET: Fetch pending agents (from Profile model)
app.get('/api/admin/pending-agents', async (req, res) => {
    try {
        const pendingAgents = await Profile.find({
            role: 'AGENT',
            status: 'PENDING'
        }).sort({ createdAt: -1 });
        res.json(pendingAgents);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch pending agents', error: err.message });
    }
});

// PUT: Approve agent (update status to ACTIVE)
app.put('/api/admin/agents/:id/approve', async (req, res) => {
    try {
        const { id } = req.params;

        // Find agent profile
        const agent = await Profile.findById(id);
        if (!agent) {
            return res.status(404).json({ message: 'Agent not found' });
        }

        // Update agent status to ACTIVE
        agent.status = 'ACTIVE';
        await agent.save();

        res.json({
            message: 'Agent approved successfully',
            agent: {
                name: agent.full_name,
                email: agent.email,
                agency_name: agent.agency_name,
                status: agent.status
            }
        });
    } catch (err) {
        res.status(500).json({ message: 'Failed to approve agent', error: err.message });
    }
});

// PUT: Reject/Block agent
app.put('/api/admin/agents/:id/reject', async (req, res) => {
    try {
        const { id } = req.params;

        // Find agent profile
        const agent = await Profile.findById(id);
        if (!agent) {
            return res.status(404).json({ message: 'Agent not found' });
        }

        // Update agent status to BANNED (blocked)
        agent.status = 'BANNED';
        await agent.save();

        res.json({
            message: 'Agent rejected/blocked',
            agent: {
                name: agent.full_name,
                email: agent.email,
                status: agent.status
            }
        });
    } catch (err) {
        res.status(500).json({ message: 'Failed to reject agent', error: err.message });
    }
});

// ADMIN AGENCY ROUTES (Legacy - from Agency model)

// GET: Fetch agencies (with optional status filter)
app.get('/api/admin/agencies', async (req, res) => {
    try {
        const { status } = req.query;
        const filter = status ? { status } : {};
        const agencies = await Agency.find(filter).sort({ createdAt: -1 });
        res.json(agencies);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch agencies', error: err.message });
    }
});

// PUT: Approve agency
app.put('/api/admin/agencies/:id/approve', async (req, res) => {
    try {
        const { id } = req.params;

        // Find agency
        const agency = await Agency.findById(id);
        if (!agency) {
            return res.status(404).json({ message: 'Agency not found' });
        }

        // Update agency status
        agency.status = 'Active';
        await agency.save();

        // Generate temporary password
        const tempPassword = 'Temp@' + Math.random().toString(36).slice(-6).toUpperCase();

        // Check if agent profile already exists
        let agentProfile = await Profile.findOne({ email: agency.email });

        if (!agentProfile) {
            // Create new agent profile
            agentProfile = new Profile({
                full_name: agency.name,
                email: agency.email,
                password: tempPassword,
                temporaryPassword: tempPassword,
                role: 'AGENT',
                agency_name: agency.name,
                contact_number: agency.contact,
                requiresPasswordChange: true,
                agencyId: agency._id,
                status: 'ACTIVE'
            });
            await agentProfile.save();
        } else {
            // Update existing profile with temp password
            agentProfile.temporaryPassword = tempPassword;
            agentProfile.requiresPasswordChange = true;
            await agentProfile.save();
        }

        res.json({
            message: 'Agency approved successfully',
            agency: {
                name: agency.name,
                email: agency.email,
                status: agency.status
            },
            agentCredentials: {
                email: agency.email,
                temporaryPassword: tempPassword
            }
        });
    } catch (err) {
        res.status(500).json({ message: 'Failed to approve agency', error: err.message });
    }
});

// PUT: Reject agency
app.put('/api/admin/agencies/:id/reject', async (req, res) => {
    try {
        const { id } = req.params;

        // Find agency
        const agency = await Agency.findById(id);
        if (!agency) {
            return res.status(404).json({ message: 'Agency not found' });
        }

        // Update agency status
        agency.status = 'Rejected';
        await agency.save();

        res.json({
            message: 'Agency rejected',
            agency: {
                name: agency.name,
                status: agency.status
            }
        });
    } catch (err) {
        res.status(500).json({ message: 'Failed to reject agency', error: err.message });
    }
});

// JOBS ROUTES
// GET: All Jobs (with optional category filter)
app.get('/api/jobs', async (req, res) => {
    try {
        const { category, status } = req.query;
        const filter = {};
        if (category && category !== 'All') filter.category = category;
        if (status) filter.status = status;

        const jobs = await Job.find(filter).sort({ posted_date: -1 });
        res.json(jobs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET: Job Categories List
app.get('/api/jobs/categories', async (req, res) => {
    try {
        const categories = ['Hospitality', 'Construction', 'Healthcare', 'IT', 'Education', 'Retail', 'Manufacturing', 'Tourism', 'Fishing', 'Agriculture', 'Other'];
        res.json(categories);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET: Single Job by ID
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

// ========================
// JOB REQUEST ROUTES (For Agents/Recruiters)
// ========================

// POST: Create a new job request (Agent submits job for admin approval)
app.post('/api/job-requests', async (req, res) => {
    try {
        const {
            agent_id, agent_name, agent_email, agency_name,
            title, company, location, category, salary_range,
            description, requirements, vacancies
        } = req.body;

        const newJobRequest = new JobRequest({
            agent_id,
            agent_name,
            agent_email,
            agency_name,
            title,
            company,
            location,
            category,
            salary_range,
            description,
            requirements: requirements || [],
            vacancies: vacancies || 1,
            status: 'PENDING'
        });

        await newJobRequest.save();
        res.status(201).json({
            message: 'Job request submitted successfully. Awaiting admin approval.',
            jobRequest: newJobRequest
        });
    } catch (err) {
        console.error('Job Request Error:', err);
        res.status(500).json({ message: 'Failed to submit job request', error: err.message });
    }
});

// GET: All job requests for an agent (Agent can see their submitted requests)
app.get('/api/job-requests/agent/:agentId', async (req, res) => {
    try {
        const jobRequests = await JobRequest.find({ agent_id: req.params.agentId }).sort({ createdAt: -1 });
        res.json(jobRequests);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch job requests', error: err.message });
    }
});

// GET: All pending job requests (For Admin Dashboard)
app.get('/api/admin/job-requests', async (req, res) => {
    try {
        const { status } = req.query;
        const filter = status ? { status } : {};
        const jobRequests = await JobRequest.find(filter).sort({ createdAt: -1 });
        res.json(jobRequests);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch job requests', error: err.message });
    }
});

// GET: Pending job requests count (For Admin Dashboard stats)
app.get('/api/admin/job-requests/pending/count', async (req, res) => {
    try {
        const count = await JobRequest.countDocuments({ status: 'PENDING' });
        res.json({ count });
    } catch (err) {
        res.status(500).json({ message: 'Failed to get pending count', error: err.message });
    }
});

// PUT: Approve a job request (Admin approves and creates the actual job)
app.put('/api/admin/job-requests/:id/approve', async (req, res) => {
    try {
        const { id } = req.params;
        const { reviewed_by, review_notes } = req.body;

        // Find the job request
        const jobRequest = await JobRequest.findById(id);
        if (!jobRequest) {
            return res.status(404).json({ message: 'Job request not found' });
        }

        if (jobRequest.status !== 'PENDING') {
            return res.status(400).json({ message: 'Job request already processed' });
        }

        // Create the actual job from the request
        const newJob = new Job({
            title: jobRequest.title,
            company: jobRequest.company,
            location: jobRequest.location,
            category: jobRequest.category,
            salary_range: jobRequest.salary_range,
            description: jobRequest.description,
            requirements: jobRequest.requirements,
            status: 'OPEN'
        });

        await newJob.save();

        // Update the job request status
        jobRequest.status = 'APPROVED';
        jobRequest.reviewed_by = reviewed_by || 'Admin';
        jobRequest.review_notes = review_notes || 'Approved';
        jobRequest.reviewed_at = new Date();
        jobRequest.approved_job_id = newJob.id;
        await jobRequest.save();

        res.json({
            message: 'Job request approved and job created successfully',
            jobRequest,
            job: newJob
        });
    } catch (err) {
        res.status(500).json({ message: 'Failed to approve job request', error: err.message });
    }
});

// PUT: Reject a job request (Admin rejects)
app.put('/api/admin/job-requests/:id/reject', async (req, res) => {
    try {
        const { id } = req.params;
        const { reviewed_by, review_notes } = req.body;

        // Find the job request
        const jobRequest = await JobRequest.findById(id);
        if (!jobRequest) {
            return res.status(404).json({ message: 'Job request not found' });
        }

        if (jobRequest.status !== 'PENDING') {
            return res.status(400).json({ message: 'Job request already processed' });
        }

        // Update the job request status
        jobRequest.status = 'REJECTED';
        jobRequest.reviewed_by = reviewed_by || 'Admin';
        jobRequest.review_notes = review_notes || 'Rejected';
        jobRequest.reviewed_at = new Date();
        await jobRequest.save();

        res.json({
            message: 'Job request rejected',
            jobRequest
        });
    } catch (err) {
        res.status(500).json({ message: 'Failed to reject job request', error: err.message });
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
