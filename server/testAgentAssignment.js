import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { assignAgentByPinCode } from './utils/agentAssignment.js';

dotenv.config();

const testAssignment = async () => {
    try {
        await mongoose.connect('mongodb://localhost/yuvax');
        console.log('MongoDB Connected');

        const pinCode = 110001;
        console.log(`Testing assignment for pincode: ${pinCode} (type: ${typeof pinCode})`);

        const agent = await assignAgentByPinCode(pinCode);

        if (agent) {
            console.log(`✅ SUCCESS: Assigned to agent ${agent.name} (${agent.email})`);
        } else {
            console.log('❌ FAILURE: No agent assigned');
        }

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

testAssignment();
