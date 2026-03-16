import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Profile from './models/Profile.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/maldives-career';

async function seedAdmin() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const email = 'admin@globalakjobs.com';
        const passwordPlain = 'Admin@GlobalAK124!';
        const hashedPassword = await bcrypt.hash(passwordPlain, 12);

        let admin = await Profile.findOne({ email });

        if (!admin) {
            admin = new Profile({
                full_name: 'Admin Developer',
                email: email,
                password: hashedPassword,
                role: 'ADMIN',
                status: 'ACTIVE'
            });
            await admin.save();
            console.log('Admin user successfully created');
        } else {
            console.log('Admin user already exists. Updating password and role...');
            admin.password = hashedPassword;
            admin.role = 'ADMIN';
            admin.status = 'ACTIVE';
            await admin.save();
            console.log('Admin user updated');
        }

        mongoose.connection.close();
    } catch (error) {
        console.error('Error seeding admin:', error);
        mongoose.connection.close();
    }
}

seedAdmin();
