import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Job from './models/Job.js';

// Configure dotenv
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/maldives-career';

// Sample Jobs Data with Categories
const sampleJobs = [
    // HOSPITALITY
    {
        title: 'Hotel Front Desk Manager',
        company: 'Paradise Resort Maldives',
        location: 'Malé, Maldives',
        category: 'Hospitality',
        salary_range: '$2,500 - $3,500/month',
        description: 'We are looking for an experienced Front Desk Manager to oversee our reception operations. The ideal candidate will have excellent customer service skills and experience in luxury hospitality.',
        requirements: ['3+ years hotel experience', 'Fluent in English', 'Customer service oriented', 'Computer proficiency'],
        status: 'OPEN'
    },
    {
        title: 'Executive Chef',
        company: 'Ocean Blue Resort',
        location: 'Addu City, Maldives',
        category: 'Hospitality',
        salary_range: '$4,000 - $6,000/month',
        description: 'Seeking a creative Executive Chef to lead our culinary team. Must have experience in international cuisine and managing kitchen operations.',
        requirements: ['5+ years as Chef', 'Culinary degree preferred', 'Menu development experience', 'Team leadership skills'],
        status: 'OPEN'
    },
    {
        title: 'Housekeeping Supervisor',
        company: 'Coral Beach Hotel',
        location: 'Hulhumalé, Maldives',
        category: 'Hospitality',
        salary_range: '$1,800 - $2,200/month',
        description: 'Looking for a dedicated Housekeeping Supervisor to maintain our high cleanliness standards and manage the housekeeping team.',
        requirements: ['2+ years supervisory experience', 'Attention to detail', 'Team management', 'Quality control'],
        status: 'OPEN'
    },

    // CONSTRUCTION
    {
        title: 'Civil Engineer',
        company: 'Maldives Construction Ltd',
        location: 'Malé, Maldives',
        category: 'Construction',
        salary_range: '$3,000 - $4,500/month',
        description: 'We need a qualified Civil Engineer for our ongoing resort development projects. Will oversee construction activities and ensure quality standards.',
        requirements: ['Engineering degree', '4+ years experience', 'AutoCAD proficiency', 'Project management skills'],
        status: 'OPEN'
    },
    {
        title: 'Construction Site Supervisor',
        company: 'Island Builders Co.',
        location: 'Addu City, Maldives',
        category: 'Construction',
        salary_range: '$2,000 - $2,800/month',
        description: 'Experienced Site Supervisor needed to manage construction workers and ensure project timelines are met safely.',
        requirements: ['5+ years construction experience', 'Safety certification', 'Team leadership', 'Blueprint reading'],
        status: 'OPEN'
    },
    {
        title: 'Electrician',
        company: 'PowerTech Solutions',
        location: 'Malé, Maldives',
        category: 'Construction',
        salary_range: '$1,500 - $2,200/month',
        description: 'Licensed electrician needed for residential and commercial projects. Must have experience with modern electrical systems.',
        requirements: ['Electrician certification', '3+ years experience', 'Knowledge of safety codes', 'Problem-solving skills'],
        status: 'OPEN'
    },

    // HEALTHCARE
    {
        title: 'Registered Nurse',
        company: 'Indira Gandhi Memorial Hospital',
        location: 'Malé, Maldives',
        category: 'Healthcare',
        salary_range: '$2,000 - $3,000/month',
        description: 'We are hiring experienced nurses for our medical wards. Must be compassionate and skilled in patient care.',
        requirements: ['Nursing degree', 'Valid nursing license', '2+ years experience', 'BLS certification'],
        status: 'OPEN'
    },
    {
        title: 'Medical Doctor - General Practitioner',
        company: 'Hulhumalé Hospital',
        location: 'Hulhumalé, Maldives',
        category: 'Healthcare',
        salary_range: '$5,000 - $8,000/month',
        description: 'Seeking a qualified General Practitioner to provide primary healthcare services to our growing community.',
        requirements: ['Medical degree', 'Valid medical license', '3+ years practice', 'Good communication skills'],
        status: 'OPEN'
    },

    // IT
    {
        title: 'Full Stack Developer',
        company: 'TechMV Solutions',
        location: 'Malé, Maldives',
        category: 'IT',
        salary_range: '$2,500 - $4,000/month',
        description: 'Looking for a talented Full Stack Developer to build and maintain web applications. Remote work options available.',
        requirements: ['3+ years development experience', 'React/Node.js', 'Database knowledge', 'Git proficiency'],
        status: 'OPEN'
    },
    {
        title: 'IT Support Specialist',
        company: 'Dhiraagu Telecom',
        location: 'Malé, Maldives',
        category: 'IT',
        salary_range: '$1,500 - $2,200/month',
        description: 'We need an IT Support Specialist to provide technical assistance and troubleshooting for our customers.',
        requirements: ['IT diploma/degree', 'Hardware/software knowledge', 'Customer service skills', 'Networking basics'],
        status: 'OPEN'
    },

    // TOURISM
    {
        title: 'Tour Guide',
        company: 'Maldives Adventures',
        location: 'Malé, Maldives',
        category: 'Tourism',
        salary_range: '$1,200 - $1,800/month',
        description: 'Enthusiastic Tour Guide needed to lead tourists on island excursions and underwater adventures.',
        requirements: ['Fluent in English', 'Knowledge of Maldives history', 'Swimming ability', 'First aid certification'],
        status: 'OPEN'
    },
    {
        title: 'Dive Instructor',
        company: 'Blue Lagoon Diving',
        location: 'Baa Atoll, Maldives',
        category: 'Tourism',
        salary_range: '$2,000 - $3,000/month',
        description: 'PADI certified Dive Instructor needed to lead diving expeditions and teach courses.',
        requirements: ['PADI certification', '2+ years diving experience', 'First aid/CPR', 'Equipment maintenance'],
        status: 'OPEN'
    },

    // FISHING
    {
        title: 'Fishing Boat Captain',
        company: 'Ocean Harvest Fisheries',
        location: 'Addu City, Maldives',
        category: 'Fishing',
        salary_range: '$1,800 - $2,500/month',
        description: 'Experienced Boat Captain needed to lead fishing expeditions. Must have deep sea fishing experience.',
        requirements: ['Boat captain license', '5+ years fishing experience', 'Navigation skills', 'Team leadership'],
        status: 'OPEN'
    },

    // RETAIL
    {
        title: 'Store Manager',
        company: 'STO Supermarket',
        location: 'Malé, Maldives',
        category: 'Retail',
        salary_range: '$1,500 - $2,000/month',
        description: 'We are looking for a Store Manager to oversee daily operations, staff, and inventory management.',
        requirements: ['3+ years retail experience', 'Leadership skills', 'Inventory management', 'Customer service'],
        status: 'OPEN'
    },

    // EDUCATION
    {
        title: 'English Teacher',
        company: 'Maldives National University',
        location: 'Malé, Maldives',
        category: 'Education',
        salary_range: '$2,000 - $2,800/month',
        description: 'Qualified English Teacher needed for our language programs. Must be able to teach all levels.',
        requirements: ['Teaching degree', 'TEFL/TESOL certification', '2+ years teaching experience', 'Native English speaker preferred'],
        status: 'OPEN'
    }
];

async function seedJobs() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // Optional: Clear existing jobs first
        // await Job.deleteMany({});
        // console.log('Cleared existing jobs');

        // Check for existing jobs
        const existingCount = await Job.countDocuments();
        console.log(`Existing jobs in database: ${existingCount}`);

        // Insert sample jobs
        const result = await Job.insertMany(sampleJobs);
        console.log(`Successfully inserted ${result.length} sample jobs!`);

        // Display job counts by category
        const categories = await Job.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);
        console.log('\nJobs by Category:');
        categories.forEach(cat => {
            console.log(`  ${cat._id}: ${cat.count}`);
        });

        console.log('\n✅ Database seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

seedJobs();
