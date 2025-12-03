// Quick script to create a test delivery agent
// Run this with: node createTestAgent.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Agent from './models/Agent.js';

dotenv.config();

const createTestAgent = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Check if agent already exists
        const existingAgent = await Agent.findOne({ email: 'agent@test.com' });

        if (existingAgent) {
            console.log('Test agent already exists!');
            console.log('Email: agent@test.com');
            console.log('Password: password123');
            process.exit(0);
        }

        // Create new agent
        const agent = await Agent.create({
            name: 'Test Agent',
            email: 'agent@test.com',
            phone: '9876543210',
            pinCodes: ['110001', '110002', '110003'], // Delhi pincodes
            city: 'Delhi',
            address: '123 Test Street, Delhi',
            password: 'password123' // Will be hashed by pre-save hook
        });

        console.log('✅ Test agent created successfully!');
        console.log('-----------------------------------');
        console.log('Email: agent@test.com');
        console.log('Password: password123');
        console.log('Serviceable Pincodes:', agent.pinCodes.join(', '));
        console.log('-----------------------------------');
        console.log('You can now login at /delivery/login');

        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
};

createTestAgent();
