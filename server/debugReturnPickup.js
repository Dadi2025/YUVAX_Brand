import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Order from './models/Order.js';
import User from './models/User.js';
import Agent from './models/Agent.js';
import generateToken from './utils/generateToken.js';

dotenv.config({ path: 'server/.env' });

const debugReturnPickup = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // 1. Get Test User and Test Agent
        const user = await User.findOne({ email: 'testuser_98765@example.com' });
        const agent = await Agent.findOne({ email: 'agent@test.com' });

        if (!user || !agent) {
            console.error('User or Agent not found');
            process.exit(1);
        }

        // 2. Create a specific test order for Return
        const order = await Order.create({
            user: user._id,
            orderItems: [{
                name: "Test Return Item",
                qty: 1,
                image: "/test.jpg",
                price: 100,
                product: new mongoose.Types.ObjectId()
            }],
            shippingAddress: {
                address: "Test Addr",
                city: "Test City",
                postalCode: "110001", // Matches agent
                country: "India"
            },
            paymentMethod: "cod",
            totalPrice: 100,
            status: "Delivered",
            isDelivered: true,
            deliveredAt: Date.now(),
            assignedAgent: agent._id,
            returnStatus: "Approved", // Approved return
            returnReason: "Defective"
        });

        console.log(`Created Order ${order._id} with Return Approved`);

        // 3. Simulate Agent API Call
        console.log('--- Simulating Route Logic ---');

        const token = generateToken(agent._id);
        console.log('Generated Token for Agent');

        const response = await fetch(`http://localhost:5010/api/agents/orders/${order._id}/return-pickup`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log(`API Status: ${response.status}`);
        const data = await response.json();
        console.log('API Response:', data);

        // 4. Verify Refund Status
        const updatedOrder = await Order.findById(order._id);
        console.log(`Updated Order ReturnStatus: ${updatedOrder.returnStatus}`);
        console.log(`Updated Order RefundStatus: ${updatedOrder.refundStatus}`);

        if (updatedOrder.refundStatus === 'Pending') {
            console.log("SUCCESS: Refund Status set to Pending!");
        } else {
            console.error("FAILURE: Refund Status NOT set to Pending.");
        }

        // Cleanup
        await Order.findByIdAndDelete(order._id);
        console.log('Cleanup complete');

        process.exit(0);

    } catch (error) {
        console.error('CRASHED:', error);
        process.exit(1);
    }
};

debugReturnPickup();
