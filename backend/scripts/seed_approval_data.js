
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Profile from './models/Profile.js';
import JobRequest from './models/JobRequest.js'; // Ensure this model exists and matches schema

// Configure dotenv
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/maldives-career';

const seedData = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB...');

        // 1. Create or Find an Agent Profile
        const agentEmail = 'rakshita.agent@example.com';
        let agent = await Profile.findOne({ email: agentEmail });

        if (!agent) {
            console.log('Creating sample agent...');
            agent = new Profile({
                full_name: 'Rakshita Agent',
                email: agentEmail,
                password: 'password123', // In a real app, hash this!
                role: 'AGENT',
                contact_number: '+960 1234567',
                agency_name: 'Maldives Elite Staffing',
                status: 'ACTIVE',
                requiresPasswordChange: false
            });
            await agent.save();
            console.log('Agent created:', agent.email);
        } else {
            console.log('Agent already exists:', agent.email);
        }

        // 2. Clear existing Job Requests for this agent (for clean slate)
        await JobRequest.deleteMany({ agent_id: agent.id });
        console.log('Cleared old job requests for this agent.');

        // 3. Create Sample Job Requests
        const jobRequests = [
            {
                agent_id: agent.id,
                agent_name: agent.full_name,
                agent_email: agent.email,
                agency_name: agent.agency_name,
                title: 'Senior Sous Chef',
                company: 'Grand Resort Maldives',
                location: 'Male, Maldives',
                category: 'Hospitality',
                salary_range: '$2000 - $3000/month',
                description: 'Looking for an experienced Sous Chef to lead our kitchen team. Must have 5+ years of experience in luxury resorts.',
                requirements: ['5+ years experience', 'Culinary degree', 'Team leadership skills'],
                vacancies: 2,
                status: 'PENDING'
            },
            {
                agent_id: agent.id,
                agent_name: agent.full_name,
                agent_email: agent.email,
                agency_name: agent.agency_name,
                title: 'Construction Project Manager',
                company: 'Island Builders Ltd',
                location: 'Hulhumale',
                category: 'Construction',
                salary_range: '$3500 - $4500/month',
                description: 'Project manager needed for a new resort construction project. Must verify safety protocols and timeline.',
                requirements: ['PMP Certification', '10+ years in construction', 'Safety officer certified'],
                vacancies: 1,
                status: 'PENDING'
            },
            {
                agent_id: agent.id,
                agent_name: agent.full_name,
                agent_email: agent.email,
                agency_name: agent.agency_name,
                title: 'Marine Biologist',
                company: 'EcoDivers Maldives',
                location: 'Baa Atoll',
                category: 'Tourism',
                salary_range: '$1500 - $2500/month',
                description: 'Guide tourists and conduct reef monitoring. PADI Dive Master required.',
                requirements: ['Marine Biology Degree', 'PADI Dive Master', 'Swimming skills'],
                vacancies: 3,
                status: 'APPROVED', // Already approved example
                reviewed_by: 'Admin User',
                review_notes: 'Looks good',
                reviewed_at: new Date()
            },
            {
                agent_id: agent.id,
                agent_name: agent.full_name,
                agent_email: agent.email,
                agency_name: agent.agency_name,
                title: 'Unqualified Application',
                company: 'Fake Company',
                location: 'Nowhere',
                category: 'Other',
                salary_range: '$100',
                description: 'Spam request',
                requirements: [],
                vacancies: 1,
                status: 'REJECTED', // Rejected example
                reviewed_by: 'Admin User',
                review_notes: 'Incomplete information',
                reviewed_at: new Date()
            }
        ];

        await JobRequest.insertMany(jobRequests);
        console.log(`Successfully seeded ${jobRequests.length} job requests.`);

        console.log('Database seeding complete!');
        process.exit(0);
    } catch (err) {
        console.error('Seeding error:', err);
        process.exit(1);
    }
};

seedData();
