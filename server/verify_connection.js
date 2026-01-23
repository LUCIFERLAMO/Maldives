import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
const envPath = path.join(__dirname, '../.env');
console.log('Loading .env from:', envPath);
dotenv.config({ path: envPath });

const MONGODB_URI = process.env.MONGODB_URI;

console.log('---------------------------------------------------');
console.log('MongoDB Connection Verification');
console.log('---------------------------------------------------');
console.log('URI configured:', MONGODB_URI ? 'YES' : 'NO');
if (MONGODB_URI) {
    // Mask the password for display if present
    const maskedURI = MONGODB_URI.replace(/:([^:@]+)@/, ':****@');
    console.log('URI:', maskedURI);
}

if (!MONGODB_URI) {
    console.error('ERROR: MONGODB_URI is not defined in .env');
    process.exit(1);
}

async function verifyConnection() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connection SUCCESSFUL!');

        const connection = mongoose.connection;
        console.log('Host:', connection.host);
        console.log('Port:', connection.port);
        console.log('Database Name:', connection.name);

        console.log('\nList of Collections:');
        const collections = await connection.db.listCollections().toArray();
        if (collections.length === 0) {
            console.log('(No collections found)');
        } else {
            collections.forEach(col => {
                console.log(` - ${col.name}`);
            });
        }

        console.log('\nStats:');
        const stats = await connection.db.stats();
        console.log(` - Objects: ${stats.objects}`);
        console.log(` - Data Size: ${(stats.dataSize / 1024 / 1024).toFixed(2)} MB`);

    } catch (error) {
        console.error('❌ Connection FAILED');
        console.error('Error:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('---------------------------------------------------');
    }
}

verifyConnection();
