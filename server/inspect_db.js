import mongoose from 'mongoose';
import Job from './models/Job.js';
import Profile from './models/Profile.js';

const MONGODB_URI = 'mongodb://localhost:27017/maldives-career';

const inspect = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const jobs = await Job.find({});
        console.log('\n--- JOBS Collection ---');
        console.log(JSON.stringify(jobs, null, 2));

        const profiles = await Profile.find({});
        console.log('\n--- PROFILES Collection ---');
        console.log(JSON.stringify(profiles, null, 2));

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
};

inspect();
