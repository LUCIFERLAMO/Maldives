import mongoose from 'mongoose';
import Job from '../models/Job.js';

const MONGODB_URI = 'mongodb://localhost:27017/maldives-career';

async function checkJobs() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to DB');
        const jobs = await Job.find({});
        console.log('Job count:', jobs.length);
        console.log('Jobs:', JSON.stringify(jobs, null, 2));
        process.exit();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

checkJobs();
