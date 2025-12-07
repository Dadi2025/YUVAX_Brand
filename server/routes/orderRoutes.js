import express from 'express';
import { body } from 'express-validator';
import { protect, admin } from '../middleware/auth.js';
import {
    getOrders,
    getMyOrders,
    updateOrderStatus,
    simulateCourier,
    getOrderAnalytics,
    getOrderById,
    createOrder,
    requestReturn,
    updateReturnStatus,
    requestExchange,
    updateExchangeStatus,
    processRefund,
    manualRefund,
    getAdvancedAnalytics
} from '../controllers/orderController.js';

const router = express.Router();

// Validation rules
const orderValidation = [
    body('orderItems')
        .isArray({ min: 1 })
        .withMessage('Order must have at least one item'),
    body('shippingAddress.address')
        .trim()
        .notEmpty()
        .withMessage('Address is required'),
];

// @desc    Get all orders / Create new order
router.route('/')
    .get(protect, admin, getOrders)
    .post(protect, orderValidation, createOrder);

// @desc    Get logged in user orders
router.route('/myorders/:userId').get(protect, getMyOrders);

// @desc    Simulate Courier Updates
router.route('/simulate-courier').post(protect, admin, simulateCourier);

// @desc    Get order analytics
// NOTE: This route MUST be before /:id route to avoid matching 'analytics' as an ID
router.route('/analytics').get(protect, admin, getOrderAnalytics);
router.route('/analytics/advanced').get(protect, admin, getAdvancedAnalytics);

// @desc    Get order by ID
router.route('/:id').get(getOrderById);

// @desc    Update order status
router.route('/:id/status').put(protect, admin, updateOrderStatus);

// @desc    Return management
router.route('/:id/return').put(protect, requestReturn);
router.route('/:id/return-status').put(protect, admin, updateReturnStatus);

// @desc    Exchange management
router.route('/:id/exchange').put(protect, requestExchange);
router.route('/:id/exchange-status').put(protect, admin, updateExchangeStatus);

// @desc    Refund management
router.route('/:id/process-refund').put(protect, admin, processRefund);
router.route('/:id/refund').put(protect, admin, manualRefund);

export default router;
