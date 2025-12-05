import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { protect } from '../middleware/auth.js';
import { paymentLimiter } from '../middleware/rateLimiter.js';

dotenv.config();

const router = express.Router();

// Validate Razorpay configuration
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    console.warn('WARNING: Razorpay keys not configured. Online payments will not work.');
}

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret'
});

// @desc    Get Razorpay Key
// @route   GET /api/payment/razorpay-key
// @access  Private
router.get('/razorpay-key', protect, (req, res) => {
    res.json({ keyId: process.env.RAZORPAY_KEY_ID });
});

// @desc    Create Razorpay Order
// @route   POST /api/payment/create-razorpay-order
// @access  Private
router.post('/create-razorpay-order', protect, paymentLimiter, async (req, res) => {
    try {
        const { amount } = req.body;
        console.log(`[Razorpay] Creating order for amount: ${amount}`);

        if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
            console.error('[Razorpay] Keys missing in environment');
            return res.status(500).json({ message: 'Server configuration error: Razorpay keys missing' });
        }

        const options = {
            amount: Math.round(Number(amount) * 100), // Amount in paise (integer)
            currency: 'INR',
            receipt: `receipt_${Date.now()}`
        };
        console.log('[Razorpay] Order options:', options);

        const order = await razorpay.orders.create(options);
        console.log('[Razorpay] Order created:', order);

        res.json(order);
    } catch (error) {
        console.error('[Razorpay] Order Creation Error:', error);
        res.status(500).json({ message: 'Failed to create Razorpay order', error: error.message });
    }
});

// @desc    Verify Razorpay Payment
// @route   POST /api/payment/verify-payment
// @access  Private
router.post('/verify-payment', protect, paymentLimiter, async (req, res) => {
    try {
        console.log('[Razorpay] Verifying payment:', req.body);
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const sign = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret')
            .update(sign.toString())
            .digest('hex');

        console.log(`[Razorpay] Expected Signature: ${expectedSign}`);
        console.log(`[Razorpay] Received Signature: ${razorpay_signature}`);

        if (razorpay_signature === expectedSign) {
            console.log('[Razorpay] Payment verified successfully');
            res.json({ message: 'Payment verified successfully' });
        } else {
            console.error('[Razorpay] Signature mismatch');
            res.status(400).json({ message: 'Invalid signature sent!' });
        }
    } catch (error) {
        console.error('[Razorpay] Payment Verification Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

export default router;
