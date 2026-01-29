import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import multer from 'multer';

// Configure dotenv
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/maldives-career';

console.log('Attempting to connect to MongoDB...');

// Mongoose Connection
mongoose.connect(MONGODB_URI)
    .then(() => console.log('Connected to MongoDB Cloud (Atlas)'))
    .catch(err => console.log('MongoDB connection error:', err));

// Use memory storage for file uploads (files stored in memory temporarily, then saved to MongoDB as Base64)
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit per file
});

// Import Models
import Job from './models/Job.js';
import Application from './models/Application.js';
import Profile from './models/Profile.js';
import Agency from './models/Agency.js';
import JobRequest from './models/JobRequest.js';
import Document from './models/Document.js';

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

// PASSWORD UPDATE ROUTE (Authenticated User from Profile)
app.put('/api/auth/password', async (req, res) => {
    try {
        const { userId, currentPassword, newPassword } = req.body;

        // Find user
        let user = await Profile.findById(userId);
        if (!user) {
            user = await Profile.findOne({ id: userId });
        }

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify current password
        // Limit checks to prevent timing attacks slightly, though plain text comparison is the real issue here (should use bcrypt)
        const isMatch = user.password === currentPassword || user.temporaryPassword === currentPassword;
        if (!isMatch) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }

        // Update password
        user.password = newPassword;
        user.temporaryPassword = undefined; // Clear temp password if any
        user.requiresPasswordChange = false;

        await user.save();

        res.json({ message: 'Password updated successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to update password', error: err.message });
    }
});

// USER PROFILE ROUTES
// GET: Get Profile Details
app.get('/api/profile/:id', async (req, res) => {
    try {
        let profile = await Profile.findById(req.params.id);
        if (!profile) {
            profile = await Profile.findOne({ id: req.params.id });
        }
        if (!profile) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(profile);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch profile', error: err.message });
    }
});

// PUT: Update Profile Details
app.put('/api/profile/:id', async (req, res) => {
    try {
        const { full_name, contact_number, skills, experience_years } = req.body;

        // Find by MongoDB _id or custom id field
        let profile;
        // Check if the ID is a valid MongoDB ObjectID format (24 hex chars)
        const isMongoId = /^[0-9a-fA-F]{24}$/.test(req.params.id);

        if (isMongoId) {
            profile = await Profile.findById(req.params.id);
        }

        if (!profile) {
            profile = await Profile.findOne({ id: req.params.id });
        }

        if (!profile) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update fields
        if (full_name) profile.full_name = full_name;
        if (contact_number) profile.contact_number = contact_number;

        // Update Candidate specific fields
        if (profile.role === 'CANDIDATE') {
            if (skills) profile.skills = skills;
            if (experience_years !== undefined) profile.experience_years = experience_years;
        }

        await profile.save();

        res.json({ message: 'Profile updated successfully', profile });
    } catch (err) {
        res.status(500).json({ message: 'Failed to update profile', error: err.message });
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

// POST: Create a new Job (Admin)
app.post('/api/jobs', async (req, res) => {
    try {
        const {
            title, company, location, category, salary_range,
            description, requirements, headcount
        } = req.body;

        // Validation
        if (!title || !company || !location || !category || !description) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Get highest ID for simple increment (or use UUID in future)
        const lastJob = await Job.findOne().sort({ id: -1 });
        const newId = lastJob && !isNaN(parseInt(lastJob.id)) ? (parseInt(lastJob.id) + 1).toString() : '1';

        const newJob = new Job({
            id: newId,
            title,
            company,
            location,
            category,
            salary_range,
            description,
            requirements: Array.isArray(requirements) ? requirements : requirements.split(',').map(r => r.trim()),
            vacancies: headcount || 1,
            posted_date: new Date(),
            status: 'OPEN'
        });

        await newJob.save();
        res.status(201).json(newJob);
    } catch (err) {
        res.status(500).json({ message: 'Failed to create job', error: err.message });
    }
});

// Import Category Model
import Category from './models/Category.js';

// GET: Job Categories List (Dynamic)
app.get('/api/jobs/categories', async (req, res) => {
    try {
        let categories = await Category.find().sort({ name: 1 });

        // Seed if empty (First run)
        if (categories.length === 0) {
            const initialCategories = ['Hospitality', 'Construction', 'Healthcare', 'IT', 'Education', 'Retail', 'Manufacturing', 'Tourism', 'Fishing', 'Agriculture', 'Other'];
            await Category.insertMany(initialCategories.map(name => ({ name })));
            categories = await Category.find().sort({ name: 1 });
        }

        // Return just names to match previous array format if needed, OR return objects. 
        // Previous frontend expects array of strings? Let's check BrowseJobsPage.
        // BrowseJobsPage: const data = await response.json(); setCategories(data || []);
        // And it iterates: {CATEGORIES.map(cat => ...)}
        // If data is objects, this breaks.
        // Let's return array of strings for compatibility, OR update frontend.
        // Returning objects is better for IDs, but for now to be safe with existing code:
        res.json(categories.map(c => c.name));
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST: Add Category
app.post('/api/jobs/categories', async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ message: 'Category name is required' });

        const exists = await Category.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
        if (exists) return res.status(400).json({ message: 'Category already exists' });

        const newCategory = new Category({ name });
        await newCategory.save();

        res.status(201).json(newCategory);
    } catch (err) {
        res.status(500).json({ message: 'Failed to add category', error: err.message });
    }
});

// DELETE: Delete Category (with validation and cascade option)
app.delete('/api/jobs/categories/:name', async (req, res) => {
    try {
        const categoryName = req.params.name;
        const forceDelete = req.query.force === 'true';

        // Count jobs in this category
        const totalJobs = await Job.countDocuments({ category: categoryName });
        const openJobs = await Job.countDocuments({ category: categoryName, status: 'OPEN' });

        // Check for OPEN (active) jobs - must close them first
        if (openJobs > 0) {
            return res.status(400).json({
                message: `Cannot delete category '${categoryName}'. It has ${openJobs} active (OPEN) job(s). Please close all jobs in this category first.`,
                openJobsCount: openJobs,
                totalJobsCount: totalJobs,
                canForceDelete: false
            });
        }

        // If there are closed jobs and force delete is not requested, warn user
        if (totalJobs > 0 && !forceDelete) {
            return res.status(400).json({
                message: `Category '${categoryName}' has ${totalJobs} closed job(s). These will be permanently deleted along with the category. Use force delete to proceed.`,
                openJobsCount: 0,
                totalJobsCount: totalJobs,
                canForceDelete: true
            });
        }

        // Delete all jobs in this category (cascade delete)
        if (totalJobs > 0) {
            await Job.deleteMany({ category: categoryName });
        }

        // Delete the category
        const result = await Category.deleteOne({ name: categoryName });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.json({
            message: `Category '${categoryName}' and ${totalJobs} job(s) deleted successfully`,
            deletedJobsCount: totalJobs
        });
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete category', error: err.message });
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

// PUT: Update Job Status (Start/Close)
app.put('/api/jobs/:id/status', async (req, res) => {
    try {
        const { status } = req.body; // e.g., 'OPEN', 'CLOSED'

        let job = await Job.findOne({ id: req.params.id });
        if (!job && mongoose.Types.ObjectId.isValid(req.params.id)) {
            job = await Job.findById(req.params.id);
        }

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        job.status = status;
        await job.save();

        res.json({ message: `Job status updated to ${status}`, job });
    } catch (err) {
        res.status(500).json({ message: 'Failed to update job status', error: err.message });
    }
});

// DELETE: Delete Job (Permanent)
app.delete('/api/jobs/:id', async (req, res) => {
    try {
        let job = await Job.findOne({ id: req.params.id });
        if (!job && mongoose.Types.ObjectId.isValid(req.params.id)) {
            job = await Job.findById(req.params.id);
        }

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Ideally, we should also delete or archive related applications
        // For now, we will just delete the job as per requirement
        await Job.deleteOne({ _id: job._id });

        res.json({ message: 'Job deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete job', error: err.message });
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

        // ========== SECURITY: Server-side Sanitization ==========
        const sanitizeInput = (str) => {
            if (!str) return '';
            return String(str)
                .replace(/<[^>]*>/g, '') // Remove HTML tags
                .replace(/javascript:/gi, '') // Remove javascript: protocol
                .replace(/on\w+=/gi, '') // Remove event handlers
                .replace(/[<>]/g, '') // Remove < and > characters
                .trim();
        };

        // ========== SECURITY: Input Validation ==========
        const errors = [];

        // Validate required fields exist
        if (!agent_id) errors.push('Agent ID is required');
        if (!title || sanitizeInput(title).length < 2) errors.push('Job Title must be at least 2 characters');
        if (!company || sanitizeInput(company).length < 2) errors.push('Company Name must be at least 2 characters');
        if (!location || sanitizeInput(location).length < 2) errors.push('Location must be at least 2 characters');
        if (!description || sanitizeInput(description).length < 10) errors.push('Description must be at least 10 characters');

        // Validate length limits
        if (title && sanitizeInput(title).length > 100) errors.push('Job Title must be less than 100 characters');
        if (company && sanitizeInput(company).length > 100) errors.push('Company Name must be less than 100 characters');
        if (location && sanitizeInput(location).length > 100) errors.push('Location must be less than 100 characters');
        if (description && sanitizeInput(description).length > 2000) errors.push('Description must be less than 2000 characters');
        if (salary_range && sanitizeInput(salary_range).length > 50) errors.push('Salary Range must be less than 50 characters');

        // Validate category is from allowed list
        const allowedCategories = ['Hospitality', 'Construction', 'Healthcare', 'IT', 'Education', 'Retail', 'Manufacturing', 'Tourism', 'Fishing', 'Agriculture', 'Other'];
        if (!category || !allowedCategories.includes(category)) {
            errors.push('Invalid category selected');
        }

        // Validate salary_range format (if provided)
        if (salary_range) {
            const salaryPattern = /^[\d\s$€£,.\-\/a-zA-Z]+$/;
            const hasSuspiciousContent = /<|>|script|javascript|onclick|onerror/i.test(salary_range);
            if (!salaryPattern.test(salary_range) || hasSuspiciousContent) {
                errors.push('Salary Range contains invalid characters');
            }
        }

        // Validate vacancies
        const vacancyNum = parseInt(vacancies) || 1;
        if (vacancyNum < 1 || vacancyNum > 1000) {
            errors.push('Vacancies must be between 1 and 1000');
        }

        // Return validation errors
        if (errors.length > 0) {
            return res.status(400).json({ message: errors.join(', '), errors });
        }

        // ========== Sanitize all inputs before saving ==========
        const sanitizedRequirements = Array.isArray(requirements)
            ? requirements.map(r => sanitizeInput(r)).filter(r => r.length > 0 && r.length <= 200)
            : [];

        const newJobRequest = new JobRequest({
            agent_id: sanitizeInput(agent_id),
            agent_name: sanitizeInput(agent_name),
            agent_email: sanitizeInput(agent_email),
            agency_name: sanitizeInput(agency_name),
            title: sanitizeInput(title),
            company: sanitizeInput(company),
            location: sanitizeInput(location),
            category,
            salary_range: sanitizeInput(salary_range),
            description: sanitizeInput(description),
            requirements: sanitizedRequirements,
            vacancies: vacancyNum,
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

// ========================
// APPLICATIONS ROUTES - Files stored as Base64 in MongoDB
// ========================

// POST: Submit Application with Resume and Certificates (stored as Base64 in MongoDB)
app.post('/api/applications', upload.fields([{ name: 'resume', maxCount: 1 }, { name: 'certs', maxCount: 1 }]), async (req, res) => {
    try {
        const files = req.files || {};

        if (!files.resume || files.resume.length === 0) {
            return res.status(400).json({ message: 'No resume uploaded' });
        }

        const resumeFile = files.resume[0];
        const certsFile = files.certs ? files.certs[0] : null;

        // Create application with Base64-encoded files stored directly in MongoDB
        const newApplication = new Application({
            job_id: req.body.job_id,
            candidate_name: req.body.name,
            email: req.body.email,
            contact_number: req.body.contact,
            agent_id: req.body.agent_id || null, // Capture agent ID if provided
            resume: {
                filename: resumeFile.originalname,
                contentType: resumeFile.mimetype,
                data: resumeFile.buffer.toString('base64')
            },
            certificates: certsFile ? {
                filename: certsFile.originalname,
                contentType: certsFile.mimetype,
                data: certsFile.buffer.toString('base64')
            } : undefined,
            status: 'PENDING'
        });

        const savedApp = await newApplication.save();

        // Return success without the file data (to keep response small)
        res.status(201).json({
            message: 'Application submitted successfully!',
            application: {
                id: savedApp.id,
                job_id: savedApp.job_id,
                candidate_name: savedApp.candidate_name,
                email: savedApp.email,
                status: savedApp.status,
                applied_at: savedApp.applied_at
            }
        });
    } catch (err) {
        console.error('Application Error:', err);
        res.status(500).json({ message: 'Failed to submit application', error: err.message });
    }
});

// GET: Applications by Candidate Email (For Candidate Dashboard "My Applications")
app.get('/api/applications/candidate/:email', async (req, res) => {
    try {
        const applications = await Application.find({ email: req.params.email })
            .select('-resume.data -certificates.data') // Exclude heavy file data
            .sort({ applied_at: -1 });

        // Enhance with Job details - fetch job info for each application
        const enhancedApplications = await Promise.all(
            applications.map(async (app) => {
                const appObj = app.toObject();

                // Try to find the job by job_id
                let job = null;
                if (app.job_id) {
                    // Try finding by custom 'id' field first
                    job = await Job.findOne({ id: app.job_id }).select('title company location category');

                    // If not found and job_id looks like a MongoDB ObjectId, try findById
                    if (!job && mongoose.Types.ObjectId.isValid(app.job_id)) {
                        job = await Job.findById(app.job_id).select('title company location category');
                    }
                }

                // Attach job details to the application
                appObj.job = job ? {
                    title: job.title,
                    company: job.company,
                    location: job.location,
                    category: job.category
                } : null;

                return appObj;
            })
        );

        res.json(enhancedApplications);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch candidate applications', error: err.message });
    }
});

// GET: Applications by Agent ID and Job ID (For Agent Vacancy View)
app.get('/api/applications/agent/:agentId/job/:jobId', async (req, res) => {
    try {
        const { agentId, jobId } = req.params;

        const applications = await Application.find({
            agent_id: agentId,
            job_id: jobId
        })
            .select('-resume.data -certificates.data') // Exclude heavy file data
            .sort({ applied_at: -1 });

        res.json(applications);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch agent applications', error: err.message });
    }
});

// GET: All applications by Agent ID (For Agent Pipeline/Dashboard)
app.get('/api/applications/agent/:agentId/all', async (req, res) => {
    try {
        const { agentId } = req.params;

        const applications = await Application.find({ agent_id: agentId })
            .select('-resume.data -certificates.data')
            .sort({ applied_at: -1 });

        // Enhance with job details
        const enhancedApplications = await Promise.all(
            applications.map(async (app) => {
                const appObj = app.toObject();
                let job = null;

                if (app.job_id) {
                    job = await Job.findOne({ id: app.job_id }).select('title company location category');
                    if (!job && mongoose.Types.ObjectId.isValid(app.job_id)) {
                        job = await Job.findById(app.job_id).select('title company location category');
                    }
                }

                appObj.jobs = job ? {
                    title: job.title,
                    company: job.company,
                    location: job.location,
                    category: job.category
                } : null;

                return appObj;
            })
        );

        res.json(enhancedApplications);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch agent applications', error: err.message });
    }
});

// GET: All applications (for Admin Dashboard)
app.get('/api/admin/applications', async (req, res) => {
    try {
        const { status, job_id } = req.query;
        const filter = {};
        if (status) filter.status = status;
        if (job_id) filter.job_id = job_id;

        // Exclude file data from list view for performance
        const applications = await Application.find(filter)
            .select('-resume.data -certificates.data')
            .sort({ applied_at: -1 });

        // Enhance with Job details
        const enhancedApplications = await Promise.all(
            applications.map(async (app) => {
                const appObj = app.toObject();

                // Find job by job_id
                let job = null;
                if (app.job_id) {
                    job = await Job.findOne({ id: app.job_id }).select('title company location category');
                    if (!job && mongoose.Types.ObjectId.isValid(app.job_id)) {
                        job = await Job.findById(app.job_id).select('title company location category');
                    }
                }

                appObj.job = job ? {
                    title: job.title,
                    company: job.company,
                    location: job.location,
                    category: job.category
                } : null;

                // Find agent details if it's an agency application
                if (app.agent_id) {
                    const agent = await Profile.findById(app.agent_id).select('agency_name');
                    if (agent) {
                        appObj.agency_name = agent.agency_name;
                    } else {
                        // Fallback: try to find by string ID if legacy
                        const agentLegacy = await Profile.findOne({ _id: app.agent_id }).select('agency_name');
                        if (agentLegacy) appObj.agency_name = agentLegacy.agency_name;
                    }
                }

                return appObj;
            })
        );

        res.json(enhancedApplications);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch applications', error: err.message });
    }
});

// PUT: Update application status (for Admin to approve/reject)
app.put('/api/admin/applications/:id/status', async (req, res) => {
    try {
        const { status, reviewed_by, review_notes } = req.body;

        // Find by MongoDB _id or custom id field
        let application = null;
        if (mongoose.Types.ObjectId.isValid(req.params.id)) {
            application = await Application.findById(req.params.id);
        }

        if (!application) {
            application = await Application.findOne({ id: req.params.id });
        }

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        application.status = status;
        if (reviewed_by) application.reviewed_by = reviewed_by;
        if (review_notes) application.review_notes = review_notes;
        application.reviewed_at = new Date();

        await application.save();

        res.json({ message: 'Application status updated', application });
    } catch (err) {
        res.status(500).json({ message: 'Failed to update application status', error: err.message });
    }
});

// ============ VISIBILITY REQUEST ENDPOINTS ============

// POST: Candidate requests visibility for their application progress
app.post('/api/applications/:id/request-visibility', async (req, res) => {
    try {
        let application = null;
        if (mongoose.Types.ObjectId.isValid(req.params.id)) {
            application = await Application.findById(req.params.id);
        }
        if (!application) {
            application = await Application.findOne({ id: req.params.id });
        }

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Check if already requested or rejected
        if (application.visibility_request_status === 'REJECTED') {
            return res.status(400).json({ message: 'Visibility request was already denied for this application' });
        }
        if (application.visibility_request_status === 'PENDING') {
            return res.status(400).json({ message: 'Visibility request is already pending' });
        }
        if (application.visibility_request_status === 'APPROVED') {
            return res.status(400).json({ message: 'Visibility is already approved' });
        }

        application.visibility_request_status = 'PENDING';
        application.visibility_requested_at = new Date();
        await application.save();

        res.json({ message: 'Visibility request submitted successfully', application });
    } catch (err) {
        res.status(500).json({ message: 'Failed to submit visibility request', error: err.message });
    }
});

// GET: Admin - Fetch all pending visibility requests
app.get('/api/admin/visibility-requests', async (req, res) => {
    try {
        const pendingRequests = await Application.find({ visibility_request_status: 'PENDING' })
            .select('-resume.data -certificates.data') // Exclude large file data
            .sort({ visibility_requested_at: -1 });

        // Enrich with job details
        const enrichedRequests = await Promise.all(pendingRequests.map(async (app) => {
            const job = await Job.findOne({ id: app.job_id }) || await Job.findOne({ _id: app.job_id });
            return {
                ...app.toObject(),
                jobTitle: job?.title || 'Unknown Job',
                jobCompany: job?.company || 'Unknown Company'
            };
        }));

        res.json(enrichedRequests);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch visibility requests', error: err.message });
    }
});

// GET: Admin - Count of pending visibility requests
app.get('/api/admin/visibility-requests/count', async (req, res) => {
    try {
        const count = await Application.countDocuments({ visibility_request_status: 'PENDING' });
        res.json({ count });
    } catch (err) {
        res.status(500).json({ message: 'Failed to count visibility requests', error: err.message });
    }
});

// PUT: Admin - Approve visibility request
app.put('/api/admin/visibility-requests/:id/approve', async (req, res) => {
    try {
        let application = null;
        if (mongoose.Types.ObjectId.isValid(req.params.id)) {
            application = await Application.findById(req.params.id);
        }
        if (!application) {
            application = await Application.findOne({ id: req.params.id });
        }

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        application.visibility_request_status = 'APPROVED';
        application.visibility_reviewed_by = req.body.reviewed_by || 'Admin';
        application.visibility_reviewed_at = new Date();
        await application.save();

        res.json({ message: 'Visibility request approved', application });
    } catch (err) {
        res.status(500).json({ message: 'Failed to approve visibility request', error: err.message });
    }
});

// PUT: Admin - Reject visibility request
app.put('/api/admin/visibility-requests/:id/reject', async (req, res) => {
    try {
        let application = null;
        if (mongoose.Types.ObjectId.isValid(req.params.id)) {
            application = await Application.findById(req.params.id);
        }
        if (!application) {
            application = await Application.findOne({ id: req.params.id });
        }

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        application.visibility_request_status = 'REJECTED';
        application.visibility_reviewed_by = req.body.reviewed_by || 'Admin';
        application.visibility_reviewed_at = new Date();
        await application.save();

        res.json({ message: 'Visibility request rejected', application });
    } catch (err) {
        res.status(500).json({ message: 'Failed to reject visibility request', error: err.message });
    }
});

// GET: Single application with file data (for downloading)
app.get('/api/applications/:id', async (req, res) => {
    try {
        const application = await Application.findOne({ id: req.params.id });
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }
        res.json(application);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch application', error: err.message });
    }
});

// GET: Download resume file
app.get('/api/applications/:id/resume', async (req, res) => {
    try {
        const application = await Application.findOne({ id: req.params.id });
        if (!application || !application.resume) {
            return res.status(404).json({ message: 'Resume not found' });
        }

        const fileBuffer = Buffer.from(application.resume.data, 'base64');
        res.set({
            'Content-Type': application.resume.contentType,
            'Content-Disposition': `attachment; filename="${application.resume.filename}"`
        });
        res.send(fileBuffer);
    } catch (err) {
        res.status(500).json({ message: 'Failed to download resume', error: err.message });
    }
});

// GET: Download certificates file
app.get('/api/applications/:id/certificates', async (req, res) => {
    try {
        const application = await Application.findOne({ id: req.params.id });
        if (!application || !application.certificates) {
            return res.status(404).json({ message: 'Certificates not found' });
        }

        const fileBuffer = Buffer.from(application.certificates.data, 'base64');
        res.set({
            'Content-Type': application.certificates.contentType,
            'Content-Disposition': `attachment; filename="${application.certificates.filename}"`
        });
        res.send(fileBuffer);
    } catch (err) {
        res.status(500).json({ message: 'Failed to download certificates', error: err.message });
    }
});

// ========================
// DOCUMENTS ROUTES (For Profile Page)
// ========================

// GET: Fetch user's documents (Metadata only, for list view)
app.get('/api/documents', async (req, res) => {
    try {
        const { user_id } = req.query;
        if (!user_id) return res.status(400).json({ message: 'User ID is required' });

        // Exclude file_data for performance
        const documents = await Document.find({ user_id }).select('-file_data').sort({ created_at: -1 });
        res.json(documents);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch documents', error: err.message });
    }
});

// GET: Fetch a single document with full data (for auto-attach)
app.get('/api/documents/:id', async (req, res) => {
    try {
        const document = await Document.findById(req.params.id);
        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }
        res.json(document);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch document', error: err.message });
    }
});

// POST: Upload a document
app.post('/api/documents', upload.single('file'), async (req, res) => {
    try {
        const { user_id, document_type } = req.body;
        const file = req.file;

        if (!file) return res.status(400).json({ message: 'No file uploaded' });
        if (!user_id) return res.status(400).json({ message: 'User ID is required' });
        if (!document_type) return res.status(400).json({ message: 'Document type is required' });

        const newDoc = new Document({
            user_id,
            document_type,
            filename: file.originalname,
            content_type: file.mimetype,
            file_data: file.buffer.toString('base64')
        });

        await newDoc.save();

        res.status(201).json({
            message: 'Document uploaded successfully',
            document: {
                id: newDoc._id,
                document_type: newDoc.document_type,
                filename: newDoc.filename,
                created_at: newDoc.created_at
            }
        });
    } catch (err) {
        res.status(500).json({ message: 'Failed to upload document', error: err.message });
    }
});

// DELETE: Remove a document
app.delete('/api/documents/:id', async (req, res) => {
    try {
        const document = await Document.findByIdAndDelete(req.params.id);
        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }
        res.json({ message: 'Document deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete document', error: err.message });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
