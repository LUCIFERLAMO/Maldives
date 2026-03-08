import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import multer from 'multer';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import dns from 'dns';
import bcrypt from 'bcryptjs';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// Force all DNS resolution to prefer IPv4 (Render free tier blocks IPv6 outbound)
dns.setDefaultResultOrder('ipv4first');

// Configure dotenv
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Central Password Validation Logic (Backend)
const validatePassword = (password) => {
    if (!password) return false;
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>_\-+=~`[\]\\;'/]/.test(password);
    return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumber && hasSymbol;
};

// CORS — allow local dev origins + any production origins set in ALLOWED_ORIGINS env var
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:3001',
    'http://localhost:3002',
    ...(process.env.ALLOWED_ORIGINS || '').split(',').map(o => o.trim()).filter(Boolean)
];
app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (e.g. mobile apps, Postman, server-to-server)
        if (!origin) return callback(null, true);
        // Allow any Vercel preview/production deployment URL automatically
        if (origin.endsWith('.vercel.app')) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        callback(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true
}));

// Security: set protective HTTP response headers (XSS, clickjacking, MIME sniffing, etc.)
app.use(helmet());

// Helper: escape user-supplied strings before using in regex (prevents ReDoS attacks)
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Rate limiting — protect sensitive endpoints from brute-force and abuse
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many attempts from this IP. Please try again in 15 minutes.' }
});
const forgotPasswordLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many password reset requests. Please try again in 15 minutes.' }
});
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api/', globalLimiter);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/maldives-career';

console.log('Attempting to connect to MongoDB...');

// Mongoose Connection
mongoose.connect(MONGODB_URI)
    .then(() => console.log(`Connected to MongoDB: ${MONGODB_URI.includes('localhost') ? 'Local' : 'Cloud/Atlas'}`))
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
import Subscription from './models/Subscription.js';
import Notification from './models/Notification.js';
import notificationRoutes from './routes/notification_routes.js';

// --- ROUTES ---

// Health Check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        mode: MONGODB_URI.includes('localhost') ? 'local' : 'cloud'
    });
});

// NOTIFICATION ROUTES
app.use('/api', notificationRoutes);

// AUTH ROUTES
app.post('/api/auth/register', authLimiter, upload.fields([
    { name: 'identityProof', maxCount: 1 },
    { name: 'businessLicense', maxCount: 1 },
    { name: 'agencyProfile', maxCount: 1 }
]), async (req, res) => {
    try {
        let { email, password, role, name, agencyName, skills, contact, phone } = req.body;

        // Backend Password Validation
        if (!validatePassword(password)) {
            return res.status(400).json({
                message: 'Password does not meet security requirements: Minimum 8 characters, at least one uppercase, one lowercase, one digit, and one special character.'
            });
        }

        // Normalize email
        if (email) {
            email = email.toLowerCase().trim();
        }

        // Check if user exists (case-insensitive)
        const existingUser = await Profile.findOne({ email: { $regex: new RegExp(`^${escapeRegex(email)}$`, 'i') } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Handle Agent Documents if role is AGENT
        let documents = undefined;
        if (role === 'AGENT' && req.files) {
            const identityFile = req.files.identityProof ? req.files.identityProof[0] : null;
            const licenseFile = req.files.businessLicense ? req.files.businessLicense[0] : null;
            const profileFile = req.files.agencyProfile ? req.files.agencyProfile[0] : null;

            documents = {};
            if (identityFile) {
                documents.identity = {
                    filename: identityFile.originalname,
                    contentType: identityFile.mimetype,
                    data: identityFile.buffer.toString('base64')
                };
            }
            if (licenseFile) {
                documents.license = {
                    filename: licenseFile.originalname,
                    contentType: licenseFile.mimetype,
                    data: licenseFile.buffer.toString('base64')
                };
            }
            if (profileFile) {
                documents.profile = {
                    filename: profileFile.originalname,
                    contentType: profileFile.mimetype,
                    data: profileFile.buffer.toString('base64')
                };
            }
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const newProfile = new Profile({
            full_name: name,
            email,
            password: hashedPassword,
            role,
            contact_number: contact || phone,
            agency_name: role === 'AGENT' ? agencyName : undefined,
            skills: role === 'CANDIDATE' ? skills : undefined,
            status: role === 'AGENT' ? 'PENDING' : 'ACTIVE', // Agents need admin approval
            documents: role === 'AGENT' ? documents : undefined
        });

        await newProfile.save();
        res.status(201).json({ message: 'User registered successfully', user: newProfile });
    } catch (err) {
        res.status(500).json({ message: 'Registration failed', error: err.message });
    }
});

app.post('/api/auth/login', authLimiter, async (req, res) => {
    try {
        let { email, password, role } = req.body;

        // Normalize email
        if (email) {
            email = email.toLowerCase().trim();
        }

        // Check user - use case-insensitive regex so emails like 'BCD@gmail.com' still match when user types 'bcd@gmail.com'
        const user = await Profile.findOne({ email: { $regex: new RegExp(`^${escapeRegex(email)}$`, 'i') } });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Validate password — bcrypt compare with graceful fallback for legacy plain-text accounts
        let isValidPassword = await bcrypt.compare(password, user.password).catch(() => false);
        if (!isValidPassword) {
            // Fallback: support old plain-text passwords and migrate them to bcrypt silently
            if (user.password === password) {
                isValidPassword = true;
                user.password = await bcrypt.hash(password, 12);
                await user.save();
            }
        }
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

        // Block agents who are awaiting admin approval
        if (user.role === 'AGENT' && (user.status === 'PENDING' || user.status === 'INACTIVE')) {
            return res.status(403).json({ message: 'Your account is awaiting admin approval. Please wait.' });
        }

        // Block agents who are placed on hold
        if (user.role === 'AGENT' && user.status === 'ON_HOLD') {
            return res.status(403).json({ message: 'Your account is currently on hold. Please wait for admin review.' });
        }

        // Check if agent needs to change password (first login)
        const requiresPasswordChange = user.requiresPasswordChange || false;

        res.json({
            message: 'Login successful',
            user: {
                id: user.id,
                _id: user._id,
                name: user.full_name,
                full_name: user.full_name,
                email: user.email,
                role: user.role,
                agency_name: user.agency_name,
                agencyName: user.agency_name,
                contact_number: user.contact_number,
                phone: user.contact_number,
                location: user.location || '',
                skills: user.skills || [],
                experience_years: user.experience_years || 0,
                avatar: user.avatar || null,
                status: user.status,
                requiresPasswordChange
            },
            requiresPasswordChange
        });
    } catch (err) {
        res.status(500).json({ message: 'Login failed', error: err.message });
    }
});

// GOOGLE OAUTH LOGIN ROUTE (Candidate and Agent portals only)
// Security requirements enforced:
//  1. email_verified must be true
//  2. ADMIN accounts are blocked (unauthorized)
//  3. One Google sub → one account (no hijacking via email collision)
//  4. Account must be ACTIVE (not BANNED, INACTIVE, PENDING, or DELETED)
//  5. GOOGLE_CLIENT_ID / GOOGLE_CALLBACK_URL read from env — never hardcoded
//  6. Multiple redirect URIs supported via GOOGLE_ALLOWED_ORIGINS env var
app.post('/api/auth/google', authLimiter, async (req, res) => {
    try {
        const { credential, role } = req.body;

        if (!credential) {
            return res.status(400).json({ message: 'Google credential is required' });
        }

        // ── Requirement 5/6: Read all config from environment variables ──────────
        const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
        const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL || '';
        // Comma-separated list of allowed origins/redirect URIs (dev + prod)
        const GOOGLE_ALLOWED_ORIGINS = (process.env.GOOGLE_ALLOWED_ORIGINS || '')
            .split(',')
            .map(s => s.trim())
            .filter(Boolean);

        // ── Verify the Google ID token via Google's tokeninfo endpoint ────────────
        const googleRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`);
        const tokenData = await googleRes.json();

        if (tokenData.error || !tokenData.sub) {
            return res.status(401).json({ message: 'Invalid Google token. Please try again.' });
        }

        // ── Requirement 1: email_verified must be true ────────────────────────────
        if (tokenData.email_verified !== 'true' && tokenData.email_verified !== true) {
            return res.status(401).json({ message: 'Google account email is not verified. Please verify your Google email first.' });
        }

        // ── Requirement 5: Audience must match our Client ID ──────────────────────
        if (GOOGLE_CLIENT_ID && tokenData.aud !== GOOGLE_CLIENT_ID) {
            return res.status(401).json({ message: 'Google token audience is invalid.' });
        }

        // ── Requirement 6: Validate callback URL against allowed origins ──────────
        // (Only enforced when GOOGLE_CALLBACK_URL and GOOGLE_ALLOWED_ORIGINS are set)
        if (GOOGLE_CALLBACK_URL && GOOGLE_ALLOWED_ORIGINS.length > 0) {
            const isAllowedOrigin = GOOGLE_ALLOWED_ORIGINS.some(origin =>
                GOOGLE_CALLBACK_URL.startsWith(origin)
            );
            if (!isAllowedOrigin) {
                console.warn(`[Google OAuth] Callback URL "${GOOGLE_CALLBACK_URL}" not in allowed origins list.`);
                return res.status(401).json({ message: 'Google OAuth redirect URI is not authorized.' });
            }
        }

        const googleSub = tokenData.sub;                          // Unique Google user ID
        const googleEmail = tokenData.email?.toLowerCase().trim();
        const googleName = tokenData.name || '';

        if (!googleEmail) {
            return res.status(400).json({ message: 'Could not retrieve email from Google account.' });
        }

        // ── Requirement 2 (pre-lookup): Block if requested role is ADMIN ──────────
        if (role === 'ADMIN') {
            return res.status(401).json({ message: 'Unauthorized. Admin accounts cannot use Google login.' });
        }

        // ── Look up account by googleId first, then by email ─────────────────────
        const profileByGoogleId = await Profile.findOne({ googleId: googleSub });
        const profileByEmail = await Profile.findOne({ email: { $regex: new RegExp(`^${escapeRegex(googleEmail)}$`, 'i') } });

        // ── Requirement 3: Prevent one Google identity linking to multiple accounts ─
        // If a record exists with this googleId AND a different record exists with
        // the matching email → the same Google account is trying to attach to a
        // second user record. Deny it.
        if (
            profileByGoogleId &&
            profileByEmail &&
            profileByGoogleId._id.toString() !== profileByEmail._id.toString()
        ) {
            return res.status(409).json({
                message: 'This Google account is already linked to a different user. Please sign in with your original account.'
            });
        }

        // Prefer the googleId match; fall back to email match
        const profile = profileByGoogleId || profileByEmail;

        if (profile) {
            // ── Requirement 2: Block ADMIN accounts (even if found by email) ────────
            if (profile.role === 'ADMIN') {
                return res.status(401).json({ message: 'Unauthorized. Admin accounts cannot use Google login.' });
            }

            // ── Requirement 4: Account status checks ─────────────────────────────────
            // Must be ACTIVE — deny BANNED, INACTIVE, PENDING, or any unknown status
            const allowedStatuses = ['ACTIVE'];
            if (!allowedStatuses.includes(profile.status)) {
                const statusMessages = {
                    BANNED: 'Your account has been suspended. Please contact support.',
                    INACTIVE: 'Your account is inactive. Please contact support to reactivate it.',
                    PENDING: 'Your account is pending approval. Please wait for admin confirmation.',
                };
                const message = statusMessages[profile.status] || 'Your account is not active. Please contact support.';
                return res.status(403).json({ message });
            }

            // ── Requirement 3 (cont.): Link googleId if not yet set ──────────────────
            // Only safe to link when no other account carries this googleId already
            if (!profile.googleId && !profileByGoogleId) {
                profile.googleId = googleSub;
                await profile.save();
            }

            // ── Success: return user session data ────────────────────────────────────
            return res.json({
                message: 'Google login successful',
                user: {
                    id: profile.id,
                    _id: profile._id,
                    name: profile.full_name,
                    full_name: profile.full_name,
                    email: profile.email,
                    role: profile.role,
                    agency_name: profile.agency_name || null,
                    contact_number: profile.contact_number || '',
                    phone: profile.contact_number || '',
                    location: profile.location || '',
                    skills: profile.skills || [],
                    experience_years: profile.experience_years || 0,
                    avatar: profile.avatar || null,
                    status: profile.status
                }
            });

        } else {
            // ── NEW USER: Create a CANDIDATE account via Google ───────────────────────
            // Agents must be registered via Admin — Google login always creates CANDIDATE.
            const newProfile = new Profile({
                full_name: googleName,
                email: googleEmail,
                password: `google_oauth_${googleSub}`, // Placeholder — unusable for local login
                role: 'CANDIDATE',
                googleId: googleSub,
                contact_number: '',
                skills: [],
                status: 'ACTIVE'
            });

            await newProfile.save();

            return res.status(201).json({
                message: 'Google account registered and logged in',
                user: {
                    id: newProfile.id,
                    _id: newProfile._id,
                    name: newProfile.full_name,
                    full_name: newProfile.full_name,
                    email: newProfile.email,
                    role: newProfile.role,
                    contact_number: '',
                    phone: '',
                    location: '',
                    skills: [],
                    experience_years: 0,
                    avatar: null,
                    status: newProfile.status
                }
            });
        }

    } catch (err) {
        console.error('Google OAuth error:', err);
        res.status(500).json({ message: 'Google login failed', error: err.message });
    }
});

// PASSWORD RESET ROUTE (For agents to reset their password with old password verification)
app.post('/api/auth/reset-password', async (req, res) => {
    try {
        let { email, oldPassword, newPassword } = req.body;

        // Normalize email
        if (email) {
            email = email.toLowerCase().trim();
        }

        // Find user by email
        const user = await Profile.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify old password — bcrypt compare with plain-text fallback for legacy accounts
        let isValidOldPassword = await bcrypt.compare(oldPassword, user.password).catch(() => false);
        if (!isValidOldPassword) {
            isValidOldPassword = user.password === oldPassword;
        }
        if (!isValidOldPassword) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }

        // Backend Password Validation for new password
        if (!validatePassword(newPassword)) {
            return res.status(400).json({
                message: 'New password does not meet security requirements.'
            });
        }

        // Update to new password — hashed
        user.password = await bcrypt.hash(newPassword, 12);
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
        let { email, agentId, newPassword } = req.body;

        // Find user by email or agentId
        let user;
        if (email) {
            email = email.toLowerCase().trim();
            user = await Profile.findOne({ email });
        } else if (agentId) {
            user = await Profile.findById(agentId);
        }

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Backend Password Validation
        if (!validatePassword(newPassword)) {
            return res.status(400).json({
                message: 'New password does not meet security requirements.'
            });
        }

        // Update password and clear the flag — hashed
        user.password = await bcrypt.hash(newPassword, 12);
        user.requiresPasswordChange = false;
        user.temporaryPassword = undefined; // Remove temp password
        await user.save();

        res.json({ message: 'Password updated successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to update password', error: err.message });
    }
});

// ── EMAIL-BASED FORGOT PASSWORD ROUTES ──────────────────────────────────────

// POST /api/auth/forgot-password — generate token + send reset email
app.post('/api/auth/forgot-password', forgotPasswordLimiter, async (req, res) => {
    try {
        let { email } = req.body;
        if (!email) return res.status(400).json({ message: 'Email is required.' });
        email = email.toLowerCase().trim();

        // ── Check server email config is set ─────────────────────────────────────
        if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
            console.error('Forgot password: EMAIL_USER or EMAIL_APP_PASSWORD not configured.');
            return res.status(503).json({ message: 'Password reset via email is not configured yet. Please contact support.' });
        }

        // ── Look up user — return real error if not found ────────────────────────
        const user = await Profile.findOne({ email: { $regex: new RegExp(`^${escapeRegex(email)}$`, 'i') } });
        if (!user) {
            return res.status(404).json({ message: 'No account found with that email address. Please check and try again.' });
        }

        // ── Only CANDIDATE accounts can use this flow ────────────────────────────
        if (user.role !== 'CANDIDATE') {
            return res.status(403).json({ message: 'Password reset via email is only available for candidate accounts.' });
        }

        // ── Account must be ACTIVE ────────────────────────────────────────────────
        if (user.status !== 'ACTIVE') {
            return res.status(403).json({ message: 'Your account is not active. Please contact support.' });
        }

        // ── Generate secure random token ──────────────────────────────────────────
        const token = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = token;
        user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
        await user.save();

        // ── Build reset link ──────────────────────────────────────────────────────
        const frontendOrigin = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173').split(',')[0].trim();
        const resetLink = `${frontendOrigin}/reset-password?token=${token}`;

        const emailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; background: #f9f9f9; border-radius: 12px; overflow: hidden;">
                <div style="background: linear-gradient(135deg, #0f172a, #134e4a); padding: 32px; text-align: center;">
                    <h1 style="color: #5eead4; margin: 0; font-size: 24px;">GlobalAKJobs</h1>
                    <p style="color: #99f6e4; margin: 8px 0 0; font-size: 14px;">Island Jobs Simplified</p>
                </div>
                <div style="padding: 32px;">
                    <h2 style="color: #0f172a; margin-top: 0;">Reset Your Password</h2>
                    <p style="color: #475569; line-height: 1.6;">Hi ${user.full_name},</p>
                    <p style="color: #475569; line-height: 1.6;">We received a request to reset the password for your account. Click the button below to set a new password. This link is valid for <strong>15 minutes</strong>.</p>
                    <div style="text-align: center; margin: 32px 0;">
                        <a href="${resetLink}" style="background: #0d9488; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; display: inline-block;">Reset Password</a>
                    </div>
                    <p style="color: #94a3b8; font-size: 13px;">If you didn't request this, you can safely ignore this email. Your password won't change.</p>
                    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;">
                    <p style="color: #94a3b8; font-size: 12px; text-align: center;">GlobalAKJobs · Maldives Career Platform</p>
                </div>
            </div>
        `;

        const resendApiKey = (process.env.RESEND_API_KEY || '').trim();

        if (resendApiKey) {
            // ── PRODUCTION: Resend HTTP API (works on Render — port 443, no SMTP) ──
            console.log('[Email] Sending via Resend HTTP API');
            const resendRes = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${resendApiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    from: 'GlobalAKJobs <onboarding@resend.dev>',
                    to: [user.email],
                    subject: 'Reset Your GlobalAKJobs Password',
                    html: emailHtml,
                }),
            });
            const resendData = await resendRes.json();
            if (!resendRes.ok) {
                throw new Error(resendData?.message || `Resend API error ${resendRes.status}`);
            }
            console.log('[Email] Resend sent OK, id:', resendData.id);
        } else {
            // ── DEV / LOCAL: Ethereal auto-account (no setup needed) ─────────────
            console.log('[Email] No RESEND_API_KEY — using Ethereal dev mode');
            const testAccount = await nodemailer.createTestAccount();
            const transporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                auth: { user: testAccount.user, pass: testAccount.pass },
            });
            const info = await transporter.sendMail({
                from: '"GlobalAKJobs [TEST]" <noreply@globalaKjobs.dev>',
                to: user.email,
                subject: 'Reset Your GlobalAKJobs Password',
                html: emailHtml,
            });
            console.log('\n📧 [DEV] Email captured — no real email sent');
            console.log('🔗 Preview  :', nodemailer.getTestMessageUrl(info));
            console.log('🔑 Reset link:', resetLink, '\n');
        }

        res.json({ message: 'Reset link sent! Please check your inbox (and spam folder).' });
    } catch (err) {
        console.error('Forgot password error:', err?.message || err);
        res.status(500).json({ message: 'Failed to send reset email. Please try again later.' });
    }
});

// GET /api/auth/validate-reset-token/:token — check token validity
app.get('/api/auth/validate-reset-token/:token', async (req, res) => {
    try {
        const { token } = req.params;
        const user = await Profile.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: new Date() }
        });
        if (!user) {
            return res.status(400).json({ valid: false, message: 'Reset link is invalid or has expired.' });
        }
        res.json({ valid: true, email: user.email });
    } catch (err) {
        res.status(500).json({ valid: false, message: 'Error validating token.' });
    }
});

// POST /api/auth/reset-password-token — apply new password using token
app.post('/api/auth/reset-password-token', async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        if (!token || !newPassword) {
            return res.status(400).json({ message: 'Token and new password are required.' });
        }
        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters.' });
        }
        const user = await Profile.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: new Date() }
        });
        if (!user) {
            return res.status(400).json({ message: 'Reset link is invalid or has expired. Please request a new one.' });
        }
        user.password = await bcrypt.hash(newPassword, 12);
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        user.temporaryPassword = undefined;
        user.requiresPasswordChange = false;
        await user.save();
        res.json({ message: 'Password reset successfully. You can now log in.' });
    } catch (err) {
        console.error('Reset password token error:', err);
        res.status(500).json({ message: 'Failed to reset password. Please try again.' });
    }
});

// PASSWORD UPDATE ROUTE (Authenticated User from Profile)
app.put('/api/auth/password', async (req, res) => {
    try {
        const { userId, currentPassword, newPassword } = req.body;

        // Find user - First try by custom UUID id field, then by MongoDB ObjectId
        let user = await Profile.findOne({ id: userId });

        // If not found by custom id, try MongoDB _id (only if valid ObjectId format)
        if (!user && mongoose.Types.ObjectId.isValid(userId)) {
            user = await Profile.findById(userId);
        }

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify current password — bcrypt compare with plain-text fallback
        let isMatch = await bcrypt.compare(currentPassword, user.password).catch(() => false);
        if (!isMatch) {
            isMatch = user.password === currentPassword;
        }
        if (!isMatch) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }

        // Backend Password Validation
        if (!validatePassword(newPassword)) {
            return res.status(400).json({
                message: 'New password does not meet security requirements.'
            });
        }

        // Update password — hashed
        user.password = await bcrypt.hash(newPassword, 12);
        user.temporaryPassword = undefined; // Clear temp password if any
        user.requiresPasswordChange = false;

        await user.save();

        res.json({ message: 'Password updated successfully' });
    } catch (err) {
        console.error('Password update error:', err);
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
        const { full_name, contact_number, location, skills, experience_years } = req.body;

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

        // Update shared fields
        if (full_name) profile.full_name = full_name;
        if (contact_number !== undefined) profile.contact_number = contact_number;
        if (location !== undefined) profile.location = location;

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

// POST: Upload/Update Profile Avatar
app.post('/api/profile/:id/avatar', upload.single('avatar'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'No image file uploaded' });

        let profile;
        const isMongoId = /^[0-9a-fA-F]{24}$/.test(req.params.id);
        if (isMongoId) profile = await Profile.findById(req.params.id);
        if (!profile) profile = await Profile.findOne({ id: req.params.id });
        if (!profile) return res.status(404).json({ message: 'User not found' });

        // Convert to base64 data URL so it can be stored directly in DB and displayed
        const base64 = req.file.buffer.toString('base64');
        const mimeType = req.file.mimetype;
        const dataUrl = `data:${mimeType};base64,${base64}`;

        profile.avatar = dataUrl;
        await profile.save();

        res.json({ message: 'Avatar updated successfully', avatar: dataUrl });
    } catch (err) {
        console.error('Avatar upload error:', err);
        res.status(500).json({ message: 'Failed to upload avatar', error: err.message });
    }
});

// POST: Toggle Saved Job
app.post('/api/profile/:id/save-job', async (req, res) => {
    try {
        const { jobId } = req.body;
        if (!jobId) return res.status(400).json({ message: 'Job ID is required' });

        let profile;
        const isMongoId = /^[0-9a-fA-F]{24}$/.test(req.params.id);
        if (isMongoId) profile = await Profile.findById(req.params.id);
        if (!profile) profile = await Profile.findOne({ id: req.params.id });

        if (!profile) return res.status(404).json({ message: 'User not found' });

        // Ensure user is candidate
        if (profile.role?.toLowerCase() !== 'candidate') return res.status(403).json({ message: 'Only candidates can save jobs' });

        const index = profile.savedJobs.indexOf(jobId);
        if (index > -1) {
            profile.savedJobs.splice(index, 1); // Remove
        } else {
            profile.savedJobs.push(jobId); // Add
        }

        await profile.save();
        res.json({ message: 'Saved jobs updated', savedJobs: profile.savedJobs });
    } catch (err) {
        res.status(500).json({ message: 'Failed to update saved jobs', error: err.message });
    }
});

// GET: Fetch Saved Jobs for Candidate
app.get('/api/profile/:id/saved-jobs', async (req, res) => {
    try {
        let profile;
        const isMongoId = /^[0-9a-fA-F]{24}$/.test(req.params.id);
        if (isMongoId) profile = await Profile.findById(req.params.id);
        if (!profile) profile = await Profile.findOne({ id: req.params.id });

        if (!profile) return res.status(404).json({ message: 'User not found' });
        if (profile.role?.toLowerCase() !== 'candidate') return res.status(403).json({ message: 'Only candidates have saved jobs' });

        const savedJobsIds = profile.savedJobs || [];
        const validMongoIds = savedJobsIds.filter(id => /^[0-9a-fA-F]{24}$/.test(id));

        const jobs = await Job.find({
            $or: [
                { id: { $in: savedJobsIds } },
                { _id: { $in: validMongoIds } }
            ]
        });

        res.json(jobs);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch saved jobs', error: err.message });
    }
});

// DELETE: Agent self-deletes their own account permanently
app.delete('/api/profile/:id/delete-account', async (req, res) => {
    try {
        const { id } = req.params;
        const agent = await Profile.findByIdAndDelete(id);
        if (!agent) {
            return res.status(404).json({ message: 'Account not found' });
        }
        res.json({ message: 'Account permanently deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete account', error: err.message });
    }
});

// ADMIN AGENT ROUTES (From Profile model - for agents registered via agent-registration page)

// GET: Fetch pending agents (from Profile model)
app.get('/api/admin/pending-agents', async (req, res) => {
    try {
        const pendingAgents = await Profile.find({
            role: 'AGENT',
            status: { $in: ['PENDING', 'ON_HOLD'] }
        }).sort({ createdAt: -1 });
        res.json(pendingAgents);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch pending agents', error: err.message });
    }
});

// GET: Fetch a single agent by ID
app.get('/api/admin/agents/:id', async (req, res) => {
    try {
        const agent = await mongoose.model('Profile').findById(req.params.id);
        if (!agent) return res.status(404).json({ message: 'Agent not found' });
        res.json(agent);
    } catch (err) {
        console.error('Error fetching agent:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
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

// PUT: Place agent on hold (status = ON_HOLD)
app.put('/api/admin/agents/:id/hold', async (req, res) => {
    try {
        const { id } = req.params;
        const agent = await Profile.findById(id);
        if (!agent) {
            return res.status(404).json({ message: 'Agent not found' });
        }
        agent.status = 'ON_HOLD';
        await agent.save();
        res.json({ message: 'Agent placed on hold', agent: { name: agent.full_name, email: agent.email, status: agent.status } });
    } catch (err) {
        res.status(500).json({ message: 'Failed to place agent on hold', error: err.message });
    }
});

// DELETE: Permanently delete agent from database
app.delete('/api/admin/agents/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const agent = await Profile.findByIdAndDelete(id);
        if (!agent) {
            return res.status(404).json({ message: 'Agent not found' });
        }
        res.json({ message: 'Agent permanently deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete agent', error: err.message });
    }
});


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

        // Generate stronger temporary password
        const generateStrongTempPassword = () => {
            const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            const lower = "abcdefghijklmnopqrstuvwxyz";
            const digits = "01234567819";
            const symbols = "!@#$%^&*";
            const all = upper + lower + digits + symbols;

            let password = "";
            password += upper[Math.floor(Math.random() * upper.length)];
            password += lower[Math.floor(Math.random() * lower.length)];
            password += digits[Math.floor(Math.random() * digits.length)];
            password += symbols[Math.floor(Math.random() * symbols.length)];

            for (let i = 0; i < 4; i++) {
                password += all[Math.floor(Math.random() * all.length)];
            }
            return password.split('').sort(() => 0.5 - Math.random()).join('');
        };
        const tempPassword = generateStrongTempPassword();

        // Check if agent profile already exists
        let agentProfile = await Profile.findOne({ email: agency.email });

        if (!agentProfile) {
            // Create new agent profile
            agentProfile = new Profile({
                full_name: agency.name,
                email: agency.email.toLowerCase().trim(),
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
                email: agency.email.toLowerCase().trim(),
                status: agency.status
            },
            agentCredentials: {
                email: agency.email.toLowerCase().trim(),
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
        const { category, status, search } = req.query;
        const filter = {};
        if (category && category !== 'All') filter.category = category;
        if (status) filter.status = status;

        // Search Filter
        if (search) {
            const searchRegex = new RegExp(search, 'i');
            console.log(`Search Term: "${search}", Regex: ${searchRegex}`);
            filter.$or = [
                { title: searchRegex },
                { company: searchRegex },
                { location: searchRegex },
                { description: searchRegex },
                { requirements: { $in: [searchRegex] } }
            ];
        }

        // Use custom replacer for JSON.stringify to show Regex objects
        const replacer = (key, value) => {
            if (value instanceof RegExp) return value.toString();
            return value;
        };
        console.log('GET /api/jobs filter:', JSON.stringify(filter, replacer, 2));
        const jobs = await Job.find(filter).sort({ posted_date: -1 });
        console.log('Found jobs:', jobs.length);
        res.json(jobs);
    } catch (err) {
        console.error('Error fetching jobs:', err);
        res.status(500).json({ message: err.message });
    }
});

// POST: Create a new Job (Admin)
app.post('/api/jobs', async (req, res) => {
    try {
        const {
            title, company, location, category, salary_range,
            description, requirements, headcount, education, experience
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
            education,
            experience,
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

// GET: Agent Profile by ID
app.get('/api/agents/:id', async (req, res) => {
    try {
        const agent = await Profile.findOne({ id: req.params.id });
        if (!agent && mongoose.Types.ObjectId.isValid(req.params.id)) {
            const agentById = await Profile.findById(req.params.id);
            if (agentById) return res.json(agentById);
        }

        if (!agent) return res.status(404).json({ message: 'Agent not found' });
        res.json(agent);
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

        const previousStatus = job.status;
        job.status = status;
        await job.save();

        // NOTIFICATION LOGIC: If job opened, notify subscribers
        if (status === 'OPEN' && previousStatus !== 'OPEN') {
            // Find subscriptions by matching jobId (try both custom ID and _id)
            const subscribers = await Subscription.find({
                jobId: { $in: [job.id, job._id.toString()] }
            });

            if (subscribers.length > 0) {
                const notifications = subscribers.map(sub => ({
                    userId: sub.userId,
                    title: 'Job Alert: Position Re-opened!',
                    message: `The job "${job.title}" at ${job.company} is now accepting applications again.`,
                    type: 'JOB_ALERT',
                    metadata: { jobId: job.id }
                }));
                await Notification.insertMany(notifications);
                console.log(`Created ${notifications.length} alerts for job ${job.title}`);
            }
        }

        res.json({ message: `Job status updated to ${status}`, job });
    } catch (err) {
        console.error("Error updating job status:", err);
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
            description, requirements, vacancies, education, experience
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
            education: sanitizeInput(education),
            experience: sanitizeInput(experience),
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
            education: jobRequest.education,
            experience: jobRequest.experience,
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
app.post('/api/applications', upload.fields([
    { name: 'resume', maxCount: 1 },
    { name: 'identity', maxCount: 1 },
    { name: 'certs', maxCount: 1 },
    { name: 'pcc', maxCount: 1 },
    { name: 'goodStanding', maxCount: 1 }
]), async (req, res) => {
    try {
        const files = req.files || {};

        if (!files.resume || files.resume.length === 0) {
            return res.status(400).json({ message: 'No resume uploaded' });
        }

        const resumeFile = files.resume[0];
        const identityFile = files.identity ? files.identity[0] : null;
        const certsFile = files.certs ? files.certs[0] : null;
        const pccFile = files.pcc ? files.pcc[0] : null;
        const goodStandingFile = files.goodStanding ? files.goodStanding[0] : null;

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
            identity: identityFile ? {
                filename: identityFile.originalname,
                contentType: identityFile.mimetype,
                data: identityFile.buffer.toString('base64')
            } : undefined,
            certificates: certsFile ? {
                filename: certsFile.originalname,
                contentType: certsFile.mimetype,
                data: certsFile.buffer.toString('base64')
            } : undefined,
            pcc: pccFile ? {
                filename: pccFile.originalname,
                contentType: pccFile.mimetype,
                data: pccFile.buffer.toString('base64')
            } : undefined,
            goodStanding: goodStandingFile ? {
                filename: goodStandingFile.originalname,
                contentType: goodStandingFile.mimetype,
                data: goodStandingFile.buffer.toString('base64')
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

        // Build a list of all possible agent_id values stored for this agent
        // (some records stored MongoDB _id string, others stored UUID)
        const agentIdVariants = [agentId];
        try {
            const agentProfile = await Profile.findOne({
                $or: [
                    { id: agentId },
                    ...(mongoose.Types.ObjectId.isValid(agentId) ? [{ _id: agentId }] : [])
                ]
            }).select('id _id').lean();
            if (agentProfile) {
                if (agentProfile.id && !agentIdVariants.includes(agentProfile.id)) {
                    agentIdVariants.push(agentProfile.id);
                }
                if (agentProfile._id && !agentIdVariants.includes(agentProfile._id.toString())) {
                    agentIdVariants.push(agentProfile._id.toString());
                }
            }
        } catch (profileErr) {
            console.warn('Could not look up agent profile variants:', profileErr.message);
        }

        const applications = await Application.find({ agent_id: { $in: agentIdVariants } })
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

// GET: Fetch application documents as Base64 data URLs (for inline modal preview)
app.get('/api/applications/:id/documents', async (req, res) => {
    try {
        // Try to find by custom 'id' field first, then by MongoDB _id
        let application = await Application.findOne({ id: req.params.id });
        if (!application && mongoose.Types.ObjectId.isValid(req.params.id)) {
            application = await Application.findById(req.params.id);
        }

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        const documents = [];

        // Add Resume if exists
        if (application.resume && application.resume.data) {
            documents.push({
                type: 'resume',
                name: application.resume.filename || 'Resume',
                contentType: application.resume.contentType,
                dataUrl: `data:${application.resume.contentType};base64,${application.resume.data}`,
                size: application.resume.data.length
            });
        }

        // Add Identity Document if exists
        if (application.identity && application.identity.data) {
            documents.push({
                type: 'identity',
                name: application.identity.filename || 'Identity Document',
                contentType: application.identity.contentType,
                dataUrl: `data:${application.identity.contentType};base64,${application.identity.data}`,
                size: application.identity.data.length
            });
        }

        // Add Certificates if exists
        if (application.certificates && application.certificates.data) {
            documents.push({
                type: 'certificates',
                name: application.certificates.filename || 'Certificates',
                contentType: application.certificates.contentType,
                dataUrl: `data:${application.certificates.contentType};base64,${application.certificates.data}`,
                size: application.certificates.data.length
            });
        }

        // Add PCC (Police Clearance Certificate) if exists
        if (application.pcc && application.pcc.data) {
            documents.push({
                type: 'pcc',
                name: application.pcc.filename || 'Police Clearance Certificate',
                contentType: application.pcc.contentType,
                dataUrl: `data:${application.pcc.contentType};base64,${application.pcc.data}`,
                size: application.pcc.data.length
            });
        }

        // Add Good Standing Certificate if exists
        if (application.goodStanding && application.goodStanding.data) {
            documents.push({
                type: 'goodStanding',
                name: application.goodStanding.filename || 'Good Standing Certificate',
                contentType: application.goodStanding.contentType,
                dataUrl: `data:${application.goodStanding.contentType};base64,${application.goodStanding.data}`,
                size: application.goodStanding.data.length
            });
        }

        res.json({
            applicationId: application.id || application._id,
            candidateName: application.candidate_name,
            documents: documents
        });
    } catch (err) {
        console.error('Error fetching documents:', err);
        res.status(500).json({ message: 'Failed to fetch documents', error: err.message });
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

// ==========================================
// CANDIDATE APPLICATIONS
// ==========================================

// POST: Submit a Candidate Application (Agent → Admin)
app.post('/api/applications', upload.fields([
    { name: 'resume', maxCount: 1 },
    { name: 'identity', maxCount: 1 },
    { name: 'certs', maxCount: 1 },
    { name: 'pcc', maxCount: 1 },
    { name: 'goodStanding', maxCount: 1 }
]), async (req, res) => {
    try {
        const { agent_id, job_id, name, email, contact, nationality } = req.body;

        if (!job_id || !name || !email || !contact) {
            return res.status(400).json({ message: 'Missing required fields: job_id, name, email, contact' });
        }

        // Helper to serialize uploaded file to Base64
        const fileToBase64 = (fileArray) => {
            if (!fileArray || fileArray.length === 0) return null;
            const file = fileArray[0];
            return {
                filename: file.originalname,
                contentType: file.mimetype,
                data: file.buffer.toString('base64')
            };
        };

        const newApplication = new Application({
            job_id,
            candidate_name: name,
            email,
            contact_number: contact,
            agent_id: agent_id || null,
            nationality: nationality || '',
            resume: fileToBase64(req.files?.resume),
            identity: fileToBase64(req.files?.identity),
            certificates: fileToBase64(req.files?.certs),
            pcc: fileToBase64(req.files?.pcc),
            goodStanding: fileToBase64(req.files?.goodStanding),
            status: 'PENDING'
        });

        await newApplication.save();

        res.status(201).json({
            message: 'Candidate submitted successfully',
            application: {
                id: newApplication._id,
                candidate_name: newApplication.candidate_name,
                job_id: newApplication.job_id,
                status: newApplication.status,
                applied_at: newApplication.applied_at
            }
        });
    } catch (err) {
        console.error('Error submitting application:', err);
        res.status(500).json({ message: 'Failed to submit application', error: err.message });
    }
});

// GET: Fetch Applications (Admin view all, Agent view own)
app.get('/api/admin/applications', async (req, res) => {
    try {
        const { agent_id, job_id, status } = req.query;
        const filter = {};
        if (agent_id) filter.agent_id = agent_id;
        if (job_id) filter.job_id = job_id;
        if (status) filter.status = status;

        const applications = await Application.find(filter).sort({ applied_at: -1 });
        res.json(applications);
    } catch (err) {
        console.error('Error fetching admin applications:', err);
        res.status(500).json({ message: 'Failed to fetch applications', error: err.message });
    }
});

app.get('/api/applications', async (req, res) => {
    try {
        const { agent_id, job_id, status } = req.query;
        const filter = {};
        if (agent_id) filter.agent_id = agent_id;
        if (job_id) filter.job_id = job_id;
        if (status) filter.status = status;

        const applications = await Application.find(filter).sort({ applied_at: -1 }).lean();

        // Populate agent name manually since agent_id is a string, not an ObjectId
        const agentIds = [...new Set(applications.map(a => a.agent_id).filter(Boolean))];
        if (agentIds.length > 0) {
            const Profile = mongoose.model('Profile');
            const validObjectIdArray = agentIds.filter(id => mongoose.Types.ObjectId.isValid(id));
            const orQueries = [{ id: { $in: agentIds } }];
            if (validObjectIdArray.length > 0) {
                orQueries.push({ _id: { $in: validObjectIdArray } });
            }

            const agents = await Profile.find({ $or: orQueries }, 'id agency_name full_name');
            const agentMap = agents.reduce((acc, agent) => {
                acc[agent._id.toString()] = agent.agency_name || agent.full_name;
                if (agent.id) acc[agent.id] = agent.agency_name || agent.full_name;
                return acc;
            }, {});
            applications.forEach(app => {
                if (app.agent_id && agentMap[app.agent_id]) {
                    app.agent_name = agentMap[app.agent_id];
                }
            });
        }

        // CRITICAL: Return _id as a plain string — lean() returns BSON ObjectId which
        // serializes as {$oid:"..."} in some contexts, breaking URL construction in the frontend
        const sanitized = applications.map(app => ({
            ...app,
            _id: app._id ? app._id.toString() : undefined,
        }));

        res.json(sanitized);

    } catch (err) {
        console.error('Error fetching applications:', err);
        res.status(500).json({ message: 'Failed to fetch applications', error: err.message });
    }
});

// GET: Single Application by ID
app.get('/api/applications/:id', async (req, res) => {
    try {
        const application = await Application.findById(req.params.id);
        if (!application) return res.status(404).json({ message: 'Application not found' });
        res.json(application);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch application', error: err.message });
    }
});

// PUT: Update Application Status (Admin)
app.put('/api/applications/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['PENDING', 'REVIEWING', 'ACCEPTED', 'REJECTED', 'APPROVED', 'HOLD', 'SELECTED'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }

        let application = null;

        // Try by MongoDB _id first
        if (mongoose.Types.ObjectId.isValid(req.params.id)) {
            application = await Application.findByIdAndUpdate(
                req.params.id,
                { status },
                { new: true }
            );
        }

        // Fallback: try by custom UUID id field
        if (!application) {
            application = await Application.findOneAndUpdate(
                { id: req.params.id },
                { status },
                { new: true }
            );
        }

        if (!application) return res.status(404).json({ message: 'Application not found' });
        res.json({ message: 'Status updated', application });
    } catch (err) {
        res.status(500).json({ message: 'Failed to update status', error: err.message });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
