import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

// Import Models
import Job from './models/Job.js';
import Application from './models/Application.js';
import Profile from './models/Profile.js';
import Agency from './models/Agency.js';
import JobRequest from './models/JobRequest.js'; // Ensure this model exists if we are simulating job requests (optional here)

// Configure dotenv
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/maldives-career';

const seedDatabase = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected!');

        console.log('Clearing existing Day 8 test data (optional - mostly purely additive to avoid wrecking other data)...');
        // NOTE: I am NOT clearing collections fully to preserve other work. 
        // I will clear specific test users if they exist to avoid duplicates.
        await Profile.deleteMany({ email: { $in: ['admin@maldives.com', 'agent.smith@agency.com', 'agent.jones@agency.com', 'candidate.john@mail.com', 'candidate.jane@mail.com'] } });
        await Job.deleteMany({ title: { $in: ['Head Chef', 'Site Manager', 'Nurse', 'Senior Developer'] } }); // Be careful with this in prod!
        // We might leave orphaned applications, but that's okay for dev. 
        // Better: delete applications linked to these emails.
        await Application.deleteMany({ email: { $in: ['candidate.john@mail.com', 'candidate.jane@mail.com'] } });


        console.log('Creating Profiles...');

        // 1. Admin
        const admin = new Profile({
            full_name: 'Super Admin',
            email: 'admin@maldives.com',
            password: 'admin123', // In real app, hash this
            role: 'ADMIN',
            status: 'ACTIVE'
        });
        await admin.save();

        // 2. Agents
        const agent1 = new Profile({
            full_name: 'Agent Smith',
            email: 'agent.smith@agency.com',
            password: 'password123',
            role: 'AGENT',
            agency_name: 'Matrix Recruitment',
            contact_number: '555-0101',
            status: 'ACTIVE'
        });
        const agent1Doc = await agent1.save();

        const agent2 = new Profile({
            full_name: 'Agent Jones',
            email: 'agent.jones@agency.com',
            password: 'password123',
            role: 'AGENT',
            agency_name: 'Global Talent',
            contact_number: '555-0102',
            status: 'ACTIVE'
        });
        const agent2Doc = await agent2.save();

        // 3. Candidates
        const candidate1 = new Profile({
            full_name: 'John Doe',
            email: 'candidate.john@mail.com',
            password: 'password123',
            role: 'CANDIDATE',
            skills: ['Cooking', 'Management'],
            experience_years: 5,
            contact_number: '555-0201',
            status: 'ACTIVE'
        });
        const candidate1Doc = await candidate1.save();

        const candidate2 = new Profile({
            full_name: 'Jane Doe',
            email: 'candidate.jane@mail.com',
            password: 'password123',
            role: 'CANDIDATE',
            skills: ['Nursing', 'First Aid'],
            experience_years: 3,
            contact_number: '555-0202',
            status: 'ACTIVE'
        });
        const candidate2Doc = await candidate2.save();

        console.log('Creating Jobs...');

        // Jobs
        const job1 = new Job({
            title: 'Head Chef',
            company: 'Luxury Resort',
            location: 'Male',
            category: 'Hospitality', // Category 1
            salary_range: '$2000 - $3000',
            description: 'Looking for an experienced head chef for our luxury resort.',
            requirements: ['5+ years experience', 'Culinary degree'],
            status: 'OPEN'
        });
        const job1Doc = await job1.save();

        const job2 = new Job({
            title: 'Site Manager',
            company: 'Island Construction',
            location: 'Hulhumale',
            category: 'Construction', // Category 2
            salary_range: '$1500 - $2500',
            description: 'Oversee construction projects on the island.',
            requirements: ['Civil Engineering degree', 'Project Management'],
            status: 'OPEN'
        });
        const job2Doc = await job2.save();

        const job3 = new Job({
            title: 'Nurse',
            company: 'City Hospital',
            location: 'Male',
            category: 'Healthcare', // Category 3
            salary_range: '$1200 - $1800',
            description: 'Registered nurse for emergency department.',
            requirements: ['Nursing license', '2 years experience'],
            status: 'OPEN' // Not closed, but maybe less applicants
        });
        const job3Doc = await job3.save();


        console.log('Creating Applications...');

        // Applications
        // 1. John Doe applies to Head Chef (via Agent Smith)
        await new Application({
            job_id: job1Doc.id, // Using the custom ID string from the model (default UUID)? 
            // Wait, standard ref usually uses _id, but Application model defines job_id as String key. 
            // Let's check Job model... Job model has `id: { type: String, default: uuidv4 }`.
            // So we should use that `id` string if the app logic expects query by that ID.
            // Server.js lookups: `Job.findOne({ id: app.job_id })`. logic confirms we use the UUID string.

            candidate_name: candidate1Doc.full_name,
            email: candidate1Doc.email,
            contact_number: candidate1Doc.contact_number,
            agent_id: agent1Doc.id, // Matches `id: type: String` in Profile? Yes, UUID.
            // NOTE: Application model `agent_id` is String.
            resume: {
                filename: 'resume.pdf',
                contentType: 'application/pdf',
                data: 'VGhpcyBpcyBhIGR1bW15IHJlc3VtZSBmb3IgdGVzdGluZy4=' // "This is a dummy resume for testing."
            },
            status: 'PENDING'
        }).save();

        // 2. Jane Doe applies to Head Chef (via Agent Jones) - Same job, different agent
        await new Application({
            job_id: job1Doc.id,
            candidate_name: candidate2Doc.full_name,
            email: candidate2Doc.email,
            contact_number: candidate2Doc.contact_number,
            agent_id: agent2Doc.id,
            resume: {
                filename: 'jane_resume.pdf',
                contentType: 'application/pdf',
                data: 'VGhpcyBpcyBhIGR1bW15IHJlc3VtZSBmb3IgdGVzdGluZy4='
            },
            status: 'REVIEWING'
        }).save();

        // 3. John Doe applies to Site Manager (Direct application / No Agent - if supported, or via default agent)
        // Let's assume via Agent Smith again for his quota
        await new Application({
            job_id: job2Doc.id,
            candidate_name: candidate1Doc.full_name,
            email: candidate1Doc.email,
            contact_number: candidate1Doc.contact_number,
            agent_id: agent1Doc.id,
            resume: {
                filename: 'resume_civil.pdf',
                contentType: 'application/pdf',
                data: 'VGhpcyBpcyBhIGR1bW15IHJlc3VtZSBmb3IgdGVzdGluZy4='
            },
            status: 'ACCEPTED'
        }).save();

        console.log('Day 8 Seed Completed Successfully!');
        console.log('-----------------------------------');
        console.log('Test Credentials:');
        console.log('Admin: admin@maldives.com / admin123');
        console.log('Agent 1: agent.smith@agency.com / password123');
        console.log('Agent 2: agent.jones@agency.com / password123');
        console.log('Candidate 1: candidate.john@mail.com / password123');
        console.log('Candidate 2: candidate.jane@mail.com / password123');
        console.log('-----------------------------------');

        mongoose.disconnect();

    } catch (err) {
        console.error('Seeding failed:', err);
        mongoose.disconnect();
    }
};

seedDatabase();
