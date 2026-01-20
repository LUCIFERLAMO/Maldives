import mongoose from 'mongoose';
import Job from './models/Job.js';
import Profile from './models/Profile.js';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/maldives-career';

mongoose.connect(MONGODB_URI)
    .then(() => console.log('Connected to MongoDB for seeding'))
    .catch(err => {
        console.error('Could not connect to MongoDB:', err);
        process.exit(1);
    });

const seedJobs = [
    {
        title: "Luxury Resort Manager",
        company: "Paradise Island Resorts",
        location: "Malé Atoll, Maldives",
        salary_range: "$5000 - $8000",
        status: "OPEN",
        description: "Oversee daily operations of our 5-star luxury resort. Ensure guest satisfaction and manage staff performance.",
        requirements: ["5+ years experience in luxury hospitality", "Fluent in English", "Leadership skills"]
    },
    {
        title: "Scuba Diving Instructor",
        company: "Deep Blue Dive Center",
        location: "Ari Atoll, Maldives",
        salary_range: "$2500 - $3500",
        status: "OPEN",
        description: "Lead diving excursions and certify new divers. Must be PADI certified.",
        requirements: ["PADI Open Water Scuba Instructor", "First Aid certification", "Experience in tropical waters"]
    },
    {
        title: "Executive Chef",
        company: "Sunset Villas",
        location: "Baa Atoll, Maldives",
        salary_range: "$4000 - $6000",
        status: "CLOSED",
        description: "Create world-class culinary experiences for our guests. Manage kitchen staff and inventory.",
        requirements: ["Culinary degree", "Experience in fine dining", "Creativity"]
    }
];

const seedProfiles = [
    {
        role: "ADMIN",
        full_name: "System Admin",
        email: "admin@maldives.com",
        password: "securepassword123", // In a real app, hash this!
        status: "ACTIVE"
    },
    {
        role: "AGENT",
        full_name: "Rithik (Agent)",
        email: "rithik.agent@maldives.com",
        password: "agentpassword123",
        agency_name: "Maldives Elite Recruitment",
        contact_number: "+960 123 4567",
        status: "ACTIVE"
    },
    {
        role: "CANDIDATE",
        full_name: "John Doe",
        email: "john.doe@example.com",
        password: "candidatepassword123",
        skills: ["Hospitality", "Customer Service", "Swimming"],
        experience_years: 5,
        status: "ACTIVE"
    }
];

const seedDB = async () => {
    try {
        // Clear existing data
        await Job.deleteMany({});
        await Profile.deleteMany({});
        console.log('Cleared existing jobs and profiles');

        // Insert new data
        await Job.insertMany(seedJobs);
        console.log('Added seed jobs');

        await Profile.insertMany(seedProfiles);
        console.log('Added seed profiles');

        mongoose.connection.close();
        console.log('Database seeded successfully');
    } catch (err) {
        console.error('Error seeding database:', err);
        mongoose.connection.close();
    }
};

seedDB();
