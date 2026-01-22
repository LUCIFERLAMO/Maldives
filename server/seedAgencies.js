import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Agency from './models/Agency.js';

// Setup environment
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/maldives-career';

const mockAgencies = [
    {
        name: "Maldives Elite Staffing",
        email: "contact@maldiveselite.com",
        contact: "+960 300 1234",
        location: "Male, Maldives",
        status: "Active",
        website: "https://maldiveselite.com",
        description: "Premium staffing for 5-star resorts."
    },
    {
        name: "Global Hospitality Recruiters",
        email: "info@ghr.com",
        contact: "+44 20 7946 0958",
        location: "London, UK",
        status: "Active",
        website: "https://ghr.com",
        description: "Connecting global talent with luxury destinations."
    },
    {
        name: "Island Careers Link",
        email: "support@islandcareers.mv",
        contact: "+960 333 5678",
        location: "Hulhumale, Maldives",
        status: "Pending",
        website: "https://islandcareers.mv",
        description: "Local talent acquisition specialists."
    },
    {
        name: "Paradise Resort Staffing",
        email: "hr@paradiseresort.com",
        contact: "+960 400 8888",
        location: "Addu City, Maldives",
        status: "Pending",
        website: "https://paradiseresort.com",
        description: "Specialists in luxury resort recruitment."
    },
    {
        name: "Azure Talent Partners",
        email: "contact@azuretalent.com",
        contact: "+971 4 555 1234",
        location: "Dubai, UAE",
        status: "Pending",
        website: "https://azuretalent.com",
        description: "International hospitality talent placement."
    }
];

const seedAgencies = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing agencies
        await Agency.deleteMany({});
        console.log('Cleared existing agencies');

        // Insert new agencies
        await Agency.insertMany(mockAgencies);
        console.log('Successfully seeded agencies!');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding agencies:', error);
        process.exit(1);
    }
};

seedAgencies();
