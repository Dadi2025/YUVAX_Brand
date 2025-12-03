import mongoose from 'mongoose';
import dotenv from 'dotenv';
import ServiceablePincode from '../models/ServiceablePincode.js';
import connectDB from '../config/db.js';

dotenv.config();

const pincodes = [
    // Metro Cities
    { pincode: '110001', city: 'New Delhi', state: 'Delhi', deliveryDays: 2, isCodAvailable: true },
    { pincode: '400001', city: 'Mumbai', state: 'Maharashtra', deliveryDays: 2, isCodAvailable: true },
    { pincode: '560001', city: 'Bangalore', state: 'Karnataka', deliveryDays: 2, isCodAvailable: true },
    { pincode: '600001', city: 'Chennai', state: 'Tamil Nadu', deliveryDays: 3, isCodAvailable: true },
    { pincode: '700001', city: 'Kolkata', state: 'West Bengal', deliveryDays: 3, isCodAvailable: true },
    { pincode: '500001', city: 'Hyderabad', state: 'Telangana', deliveryDays: 2, isCodAvailable: true },

    // Tier 1 Cities
    { pincode: '411001', city: 'Pune', state: 'Maharashtra', deliveryDays: 3, isCodAvailable: true },
    { pincode: '380001', city: 'Ahmedabad', state: 'Gujarat', deliveryDays: 3, isCodAvailable: true },
    { pincode: '302001', city: 'Jaipur', state: 'Rajasthan', deliveryDays: 3, isCodAvailable: true },
    { pincode: '226001', city: 'Lucknow', state: 'Uttar Pradesh', deliveryDays: 4, isCodAvailable: true },

    // Tier 2 Cities
    { pincode: '141001', city: 'Ludhiana', state: 'Punjab', deliveryDays: 4, isCodAvailable: true },
    { pincode: '452001', city: 'Indore', state: 'Madhya Pradesh', deliveryDays: 4, isCodAvailable: true },
    { pincode: '682001', city: 'Kochi', state: 'Kerala', deliveryDays: 4, isCodAvailable: true },
    { pincode: '800001', city: 'Patna', state: 'Bihar', deliveryDays: 5, isCodAvailable: false }, // No COD example
    { pincode: '781001', city: 'Guwahati', state: 'Assam', deliveryDays: 6, isCodAvailable: true },

    // Sample User Pincode
    { pincode: '530041', city: 'Visakhapatnam', state: 'Andhra Pradesh', deliveryDays: 4, isCodAvailable: true }
];

const importData = async () => {
    try {
        await connectDB();

        await ServiceablePincode.deleteMany();

        await ServiceablePincode.insertMany(pincodes);

        console.log('Pincodes Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await connectDB();

        await ServiceablePincode.deleteMany();

        console.log('Pincodes Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
