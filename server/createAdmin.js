import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const createAdminUser = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/yuvax');
        console.log('MongoDB Connected');

        // Admin user details
        const adminData = {
            name: 'Admin User',
            email: 'admin@yuvax.com',
            password: 'admin123', // This will be hashed automatically by the User model
            phone: '9999999999',
            isAdmin: true
        };

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: adminData.email });

        if (existingAdmin) {
            console.log('Admin user already exists!');
            console.log('Email:', adminData.email);
            console.log('You can login with this account.');

            // Update to ensure isAdmin is true
            existingAdmin.isAdmin = true;
            await existingAdmin.save();
            console.log('Updated isAdmin status to true');
        } else {
            // Create new admin user
            const admin = await User.create(adminData);
            console.log('✅ Admin user created successfully!');
            console.log('Email:', admin.email);
            console.log('Password: admin123');
            console.log('You can now login at /admin/login');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error creating admin user:', error);
        process.exit(1);
    }
};

createAdminUser();
