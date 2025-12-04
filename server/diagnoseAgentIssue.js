import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Agent from './models/Agent.js';
import Order from './models/Order.js';

dotenv.config();

const diagnose = async () => {
    try {
        await mongoose.connect('mongodb://localhost/yuvax');
        console.log('✅ MongoDB Connected\n');

        // 1. Check all agents
        console.log('📋 CHECKING AGENTS IN DATABASE:');
        console.log('='.repeat(60));
        const agents = await Agent.find({});
        console.log(`Total agents: ${agents.length}\n`);

        agents.forEach((agent, idx) => {
            console.log(`Agent ${idx + 1}:`);
            console.log(`  Name: ${agent.name}`);
            console.log(`  Email: ${agent.email}`);
            console.log(`  Active: ${agent.isActive}`);
            console.log(`  Pincodes: ${agent.pinCodes.join(', ')}`);
            console.log(`  Pincode Types: ${agent.pinCodes.map(p => typeof p).join(', ')}`);
            console.log(`  Assigned Orders: ${agent.assignedOrders}`);
            console.log(`  Completed Orders: ${agent.completedOrders}`);
            console.log('');
        });

        // 2. Check recent orders
        console.log('📦 CHECKING RECENT ORDERS:');
        console.log('='.repeat(60));
        const orders = await Order.find({}).sort({ createdAt: -1 }).limit(5);
        console.log(`Total orders in DB: ${await Order.countDocuments()}`);
        console.log(`Showing last 5 orders:\n`);

        orders.forEach((order, idx) => {
            console.log(`Order ${idx + 1}:`);
            console.log(`  ID: ${order._id}`);
            console.log(`  Postal Code: ${order.shippingAddress.postalCode} (type: ${typeof order.shippingAddress.postalCode})`);
            console.log(`  Assigned Agent: ${order.assignedAgent || 'NONE'}`);
            console.log(`  Status: ${order.status}`);
            console.log(`  Created: ${order.createdAt}`);
            console.log('');
        });

        // 3. Test pincode matching
        console.log('🔍 TESTING PINCODE MATCHING:');
        console.log('='.repeat(60));

        const testPincodes = ['110001', 110001, '500003', 500003];

        for (const pincode of testPincodes) {
            console.log(`\nSearching for pincode: ${pincode} (type: ${typeof pincode})`);
            const matchingAgents = await Agent.find({
                pinCodes: pincode,
                isActive: true
            });
            console.log(`  Found ${matchingAgents.length} agent(s)`);
            matchingAgents.forEach(a => {
                console.log(`    - ${a.name} (${a.email})`);
            });
        }

        // 4. Check for data inconsistencies
        console.log('\n⚠️  CHECKING FOR ISSUES:');
        console.log('='.repeat(60));

        const inactiveAgents = await Agent.find({ isActive: false });
        if (inactiveAgents.length > 0) {
            console.log(`⚠️  Found ${inactiveAgents.length} inactive agent(s)`);
        }

        const agentsWithNoPincodes = await Agent.find({ pinCodes: { $size: 0 } });
        if (agentsWithNoPincodes.length > 0) {
            console.log(`⚠️  Found ${agentsWithNoPincodes.length} agent(s) with no pincodes`);
        }

        const ordersWithoutAgent = await Order.find({ assignedAgent: null });
        console.log(`⚠️  Found ${ordersWithoutAgent.length} order(s) without assigned agent`);

        if (ordersWithoutAgent.length > 0) {
            console.log('\n   Orders without agents:');
            ordersWithoutAgent.forEach(o => {
                console.log(`   - Order ${o._id}: Pincode ${o.shippingAddress.postalCode} (type: ${typeof o.shippingAddress.postalCode})`);
            });
        }

        console.log('\n✅ Diagnosis complete!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

diagnose();
