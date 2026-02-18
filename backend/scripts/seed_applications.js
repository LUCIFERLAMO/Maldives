import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Application from './models/Application.js';
import Job from './models/Job.js';

// Configure dotenv
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/maldives-career';

// Sample resume base64 (tiny 1x1 pixel PDF or just a text string for testing)
const sampleBase64 = "JVBERi0xLjcKCjEgMCBvYmogICUgZW50cnkgcG9pbnQKPDwKICAvVHlwZSAvQ2F0YWxvZwogIC9QYWdlcyAyIDAgUgo+PgplbmRvYmoKCjIgMCBvYmoKPDwKICAvVHlwZSAvUGFnZXwKICAvTWVkaWFCb3ggWyAwIDAgMjAwIDIwMCBdCiAgL0NvdW50IDEKICAvS2lkcyBbIDMgMCBSIF0KPj4KZW5kb2JqCgozIDAgb2JqCjw8CiAgL1R5cGUgL1BhZ2UKICAvUGFyZW50IDIgMCBSC4gIC9SZXNvdXJjZXMgPDwKICAgIC9Gb250IDw8CiAgICAgIC9FMSA0IDAgUgogICAgPj4KICA+PgogIC9Db250ZW50cyA1IDAgUgo+PgplbmRvYmoKCjQgMCBvYmoKPDwKICAvVHlwZSAvRm9udAogIC9TdWJ0eXBlIC9UeXBlMQogIC9CYXNlRm9udCAvSGVsdmV0aWNhCj4+CmVuZG9iagoKNSAwIG9iago8PAogIC9MZW5ndGggMjIKPj4Kc3RyZWFtCkJUCi9FMSAxMiBUZgoxMCAxMCBUZAooSGVsbG8gV29ybGQpIFRqCkVUCmVuZHN0cmVhbQplbmRvYmoKCnhyZWYKMCA2CjAwMDAwMDAwMDAgNjU1MzUgZgoKMDAwMDAwMDAxMCAwMDAwMCBuIAowMDAwMDAwMDYwIDAwMDAwIG4gCjAwMDAwMDAxNTcgMDAwMDAgbiAKMDAwMDAwMDI1OCAwMDAwMCBuIAowMDAwMDAwMzQ1IDAwMDAwIG4gCnRyYWlsZXIKPDwKICAvU2l6ZSA2CiAgL1Jvb3QgMSAwIFIKPj4Kc3RhcnR4cmVmCjQxNgolJUVPRgo=";

const seedApplications = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // Get a job to link to
        const job = await Job.findOne();
        if (!job) {
            console.log('No jobs found. Please run job seeder first.');
            process.exit(1);
        }

        console.log(`Linking applications to Job: ${job.title} (${job.id})`);

        // Sample Applications
        const applications = [
            {
                job_id: job.id,
                candidate_name: "Jennita Candidate",
                email: "jennita@example.com", // Assuming this is Jennita's test email
                contact_number: "+960 1234567",
                resume: {
                    filename: "jennita_resume.pdf",
                    contentType: "application/pdf",
                    data: sampleBase64
                },
                status: "PENDING",
                applied_at: new Date(Date.now() - 86400000) // 1 day ago
            },
            {
                job_id: job.id,
                candidate_name: "Rakshita Agent Candidate",
                email: "rakshita.candidate@example.com",
                contact_number: "+960 7654321",
                agent_id: "agent-123", // Mock agent ID
                resume: {
                    filename: "rakshita_candidate_cv.pdf",
                    contentType: "application/pdf",
                    data: sampleBase64
                },
                status: "REVIEWING",
                applied_at: new Date(Date.now() - 172800000) // 2 days ago
            }
        ];

        // Clear existing test applications for these emails
        await Application.deleteMany({ email: { $in: ["jennita@example.com", "rakshita.candidate@example.com"] } });

        await Application.insertMany(applications);
        console.log('✅ Seeded 2 sample applications!');

        process.exit(0);
    } catch (error) {
        console.error('Seeding error:', error);
        process.exit(1);
    }
};

seedApplications();
