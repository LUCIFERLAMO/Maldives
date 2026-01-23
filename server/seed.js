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
        category: "Hospitality",
        salary_range: "$5000 - $8000",
        status: "OPEN",
        description: "Oversee daily operations of our 5-star luxury resort. Ensure guest satisfaction and manage staff performance.",
        requirements: ["5+ years experience in luxury hospitality", "Fluent in English", "Leadership skills"]
    },
    {
        title: "Scuba Diving Instructor",
        company: "Deep Blue Dive Center",
        location: "Ari Atoll, Maldives",
        category: "Tourism",
        salary_range: "$2500 - $3500",
        status: "OPEN",
        description: "Lead diving excursions and certify new divers. Must be PADI certified.",
        requirements: ["PADI Open Water Scuba Instructor", "First Aid certification", "Experience in tropical waters"]
    },
    {
        title: "Executive Chef",
        company: "Sunset Villas",
        location: "Baa Atoll, Maldives",
        category: "Hospitality",
        salary_range: "$4000 - $6000",
        status: "OPEN",
        description: "Create world-class culinary experiences for our guests. Manage kitchen staff and inventory.",
        requirements: ["Culinary degree", "Experience in fine dining", "Creativity"]
    },
    {
        title: "IT Systems Administrator",
        company: "Maldives Tech Solutions",
        location: "Malé, Maldives",
        category: "IT",
        salary_range: "$3000 - $4500",
        status: "OPEN",
        description: "Manage IT infrastructure for multiple resort properties.",
        requirements: ["3+ years IT experience", "Network administration", "Cloud services"]
    },
    {
        title: "Registered Nurse",
        company: "Island Medical Center",
        location: "Hulhumalé, Maldives",
        category: "Healthcare",
        salary_range: "$2800 - $3800",
        status: "OPEN",
        description: "Provide medical care at our island clinic.",
        requirements: ["Valid nursing license", "Emergency care experience", "English fluency"]
    },
    {
        title: "Construction Site Manager",
        company: "Maldives Builders Ltd",
        location: "Addu City, Maldives",
        category: "Construction",
        salary_range: "$4500 - $6000",
        status: "OPEN",
        description: "Oversee resort construction projects.",
        requirements: ["Civil engineering degree", "Project management", "5+ years experience"]
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
