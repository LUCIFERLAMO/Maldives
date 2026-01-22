import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env from the same directory (server/.env)
dotenv.config({ path: path.join(__dirname, '.env') });

const MONGODB_URI = process.env.MONGODB_URI;

console.log('Testing Connection to:', MONGODB_URI);

async function checkConnection() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Successfully connected to MongoDB Atlas!');

        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('\n📂 Collections found in database:');
        collections.forEach(col => {
            console.log(` - ${col.name}`);
        });

        await mongoose.disconnect();
        console.log('\nConnection closed.');
    } catch (err) {
        console.error('❌ Connection Failed:', err.message);
    }
}

checkConnection();
