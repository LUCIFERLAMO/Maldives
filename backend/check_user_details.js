import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Profile from './models/Profile.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/maldives-career';

async function checkUser() {
    try {
        await mongoose.connect(MONGODB_URI);
        const email = 'rithik@gmail.com'; // From user screenshot
        const user = await Profile.findOne({ email });

        console.log('--- User Data ---');
        if (user) {
            console.log(JSON.stringify(user, null, 2));
        } else {
            console.log('User not found');
        }

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

checkUser();
