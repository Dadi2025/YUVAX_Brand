import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Order from './models/Order.js';
import User from './models/User.js';
import Agent from './models/Agent.js';
import generateToken from './utils/generateToken.js';

dotenv.config({ path: 'server/.env' });

const debugDelivery = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // 1. Get Test User and Test Agent
        const user = await User.findOne({ email: 'testuser_98765@example.com' }); // Ensure this user exists from previous tests or create one
        let agent = await Agent.findOne({ email: 'agent@test.com' });

        if (!user) {
            console.log("Creating temp user");
            // Create temp user if not exists
        }
        if (!agent) {
            console.error('Agent not found');
            process.exit(1);
        }

        // 2. Create a specific test order for COD Delivery
        const order = await Order.create({
            user: user._id,
            orderItems: [{
                name: "Test Delivery Item",
                qty: 1,
                image: "/test.jpg",
                price: 500,
                product: new mongoose.Types.ObjectId()
            }],
            shippingAddress: {
                address: "Test Addr",
                city: "Test City",
                postalCode: "110001",
                country: "India"
            },
            paymentMethod: "cod",
            totalPrice: 500,
            status: "Out for Delivery",
            isPaid: false, // COD starts as unpaid
            assignedAgent: agent._id
        });

        console.log(`Created Order ${order._id} for COD Delivery Test`);

        // 3. Simulate Agent API Call
        const token = generateToken(agent._id);
        console.log('Generated Token for Agent');

        const response = await fetch(`http://localhost:5010/api/agents/orders/${order._id}/deliver`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log(`API Status: ${response.status}`);
        const data = await response.json();
        console.log('API Response:', data);

        // 4. Verify Database State
        const updatedOrder = await Order.findById(order._id);
        console.log('Updated Order State:');
        console.log(`- Status: ${updatedOrder.status}`);
        console.log(`- IsPaid: ${updatedOrder.isPaid}`);
        console.log(`- PaidAt: ${updatedOrder.paidAt}`);

        if (updatedOrder.isPaid === true && updatedOrder.status === 'Delivered') {
            console.log('SUCCESS: COD Order marked as Delivered and Paid!');
        } else {
            console.error('FAILURE: Order state incorrect.');
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

debugDelivery();
