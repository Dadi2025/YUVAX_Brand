import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { assignAgentByPinCode } from './utils/agentAssignment.js';

dotenv.config();

const testAssignment = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        console.log('Testing assignment for 516001...');
        const agent = await assignAgentByPinCode('516001');

        if (agent) {
            console.log('Found agent:', agent.name);
        } else {
            console.log('No agent found (Expected for new pincode). Function returned null correctly.');
        }

        process.exit(0);
    } catch (error) {
        console.error('CRASHED:', error);
        process.exit(1);
    }
};

testAssignment();
