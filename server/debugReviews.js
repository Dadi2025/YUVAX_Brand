import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Order from './models/Order.js';
import User from './models/User.js';
import Product from './models/Product.js';
import Review from './models/Review.js';
import generateToken from './utils/generateToken.js';

dotenv.config({ path: 'server/.env' });

const debugReviews = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // 1. Get Test User
        const user = await User.findOne({ email: 'testuser_98765@example.com' });
        if (!user) { console.error('User not found'); process.exit(1); }

        // 2. Get a Test Product
        const product = await Product.findOne();
        if (!product) { console.error('Product not found'); process.exit(1); }

        console.log(`Testing with Product ID (Numeric): ${product.id}`);
        console.log(`Testing with Product _id: ${product._id}`);

        // 3. Clear existing reviews for this product/user to avoid "Already reviewed" error
        await Review.deleteMany({ user: user._id, product: product._id });
        console.log('Cleared existing reviews for test');

        // 4. Test Create Review API (Mocking fetch)
        console.log('--- Simulating POST /api/reviews ---');
        const token = generateToken(user._id);

        // We will call the API endpoints using fetch
        // We will call the API endpoints using fetch
        const port = 5010; // Hardcoded to match running test server
        const baseUrl = `http://localhost:${port}/api/reviews`;

        const reviewData = {
            product: product.id, // Sending numeric ID to simulate frontend
            rating: 5,
            comment: "This is a test review from debug script!"
        };

        const res1 = await fetch(baseUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reviewData)
        });

        const data1 = await res1.json();
        console.log(`Create Review Status: ${res1.status}`);
        console.log('Response:', data1);

        if (res1.status !== 201) {
            console.error('FAILED to create review');
        } else {
            console.log('SUCCESS: Review created');
        }

        // 5. Verify Product Stats Updated
        const updatedProduct = await Product.findById(product._id);
        console.log(`Updated Product Rating: ${updatedProduct.rating}`);
        console.log(`Updated Product NumReviews: ${updatedProduct.numReviews}`);

        if (updatedProduct.numReviews > 0) {
            console.log('SUCCESS: Product stats updated');
        } else {
            console.error('FAILURE: Product stats NOT updated');
        }

        // 6. Test Get Reviews
        console.log(`--- Simulating GET /api/reviews/product/${product.id} ---`);
        const res2 = await fetch(`${baseUrl}/product/${product.id}`);
        const data2 = await res2.json();
        console.log(`Get Reviews Status: ${res2.status}`);
        console.log(`Fetched ${data2.length} reviews`);

        if (data2.length > 0 && data2[0].comment === reviewData.comment) {
            console.log('SUCCESS: Reviews fetched correctly');
        } else {
            console.error('FAILURE: Reviews fetch mismatch');
        }

        // Cleanup
        await Review.findByIdAndDelete(data1._id);
        // Revert product stats (approximate)
        await Product.updateOne({ _id: product._id }, {
            $inc: { numReviews: -1 },
            // rating: reset logic complex, ignoring for debug
        });

        console.log('Cleanup complete');
        process.exit(0);

    } catch (error) {
        console.error('CRASHED:', error);
        process.exit(1);
    }
};

debugReviews();
