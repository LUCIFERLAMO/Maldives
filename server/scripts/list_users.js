import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Profile from './models/Profile.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/maldives-career';

mongoose.connect(MONGODB_URI)
    .then(async () => {
        console.log('Connected to DB');
        const users = await Profile.find({});
        console.log('--- ALL USERS ---');
        users.forEach(u => {
            console.log(`Email: ${u.email}, Role: ${u.role}, Password: ${u.password}`);
        });
        console.log('-----------------');
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
