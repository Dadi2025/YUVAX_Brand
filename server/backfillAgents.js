import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Order from './models/Order.js';
import { assignAgentByPinCode } from './utils/agentAssignment.js';

dotenv.config();

const backfillAgents = async () => {
    try {
        await mongoose.connect('mongodb://localhost/yuvax');
        console.log('✅ MongoDB Connected\n');

        // Find all orders without assigned agents
        const ordersWithoutAgents = await Order.find({ assignedAgent: null });

        console.log(`📦 Found ${ordersWithoutAgents.length} orders without assigned agents\n`);

        if (ordersWithoutAgents.length === 0) {
            console.log('✅ All orders already have agents assigned!');
            process.exit(0);
        }

        let successCount = 0;
        let failCount = 0;

        console.log('🔄 Starting backfill process...\n');

        for (const order of ordersWithoutAgents) {
            const pinCode = String(order.shippingAddress.postalCode);
            console.log(`Processing Order ${order._id} (Pincode: ${pinCode})...`);

            const agent = await assignAgentByPinCode(pinCode);

            if (agent) {
                order.assignedAgent = agent._id;
                order.agentAssignedAt = Date.now();
                await order.save();
                console.log(`  ✅ Assigned to: ${agent.name} (${agent.email})\n`);
                successCount++;
            } else {
                console.log(`  ⚠️  No agent available for pincode ${pinCode}\n`);
                failCount++;
            }
        }

        console.log('='.repeat(60));
        console.log('📊 BACKFILL SUMMARY:');
        console.log(`  Total orders processed: ${ordersWithoutAgents.length}`);
        console.log(`  ✅ Successfully assigned: ${successCount}`);
        console.log(`  ⚠️  No agent available: ${failCount}`);
        console.log('='.repeat(60));

        console.log('\n✅ Backfill complete!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

backfillAgents();
