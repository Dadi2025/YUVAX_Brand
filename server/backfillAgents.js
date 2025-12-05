import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Agent from './models/Agent.js';

dotenv.config();

const backfillAgents = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // 1. Ensure 'Test Agent' covers 110001, 110002, 110003
        const testAgent = await Agent.findOne({ email: 'agent@test.com' });
        if (testAgent) {
            const desiredPins = ['110001', '110002', '110003'];
            let modified = false;
            desiredPins.forEach(pin => {
                if (!testAgent.pinCodes.includes(pin)) {
                    testAgent.pinCodes.push(pin);
                    modified = true;
                }
            });
            if (modified) {
                await testAgent.save();
                console.log('Updated Test Agent pincodes.');
            } else {
                console.log('Test Agent already covers 110001.');
            }
        }

        // 2. Ensure coverage for 516001 (User Request)
        // We'll add this to a new agent or existing one
        const kadapaPincode = '516001';
        let kadapaAgent = await Agent.findOne({ pinCodes: kadapaPincode });

        if (!kadapaAgent) {
            console.log(`No agent found explicitly for ${kadapaPincode}. Assigning to 'Andhra Agent'.`);

            // Check if 'Andhra Agent' exists by email
            kadapaAgent = await Agent.findOne({ email: 'andhra@test.com' });

            if (kadapaAgent) {
                if (!kadapaAgent.pinCodes.includes(kadapaPincode)) {
                    kadapaAgent.pinCodes.push(kadapaPincode);
                    await kadapaAgent.save();
                    console.log(`Updated Andhra Agent to cover ${kadapaPincode}`);
                }
            } else {
                // Create new agent
                kadapaAgent = await Agent.create({
                    name: 'Andhra Agent',
                    email: 'andhra@test.com',
                    password: 'password123', // Hashed in pre-save hook usually
                    phone: '9876543212',
                    role: 'delivery_agent',
                    pinCodes: [kadapaPincode],
                    isActive: true
                });
                console.log(`Created new agent 'Andhra Agent' for ${kadapaPincode}`);
            }
        } else {
            console.log(`Agent '${kadapaAgent.name}' already covers ${kadapaPincode}`);
        }

        console.log('Backfill complete.');
        process.exit(0);
    } catch (error) {
        console.error('Backfill error:', error);
        process.exit(1);
    }
};

backfillAgents();
