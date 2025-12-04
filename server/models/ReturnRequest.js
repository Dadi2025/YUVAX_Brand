import mongoose from 'mongoose';

const returnRequestSchema = mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [{
        product: {
            type: Number,
            required: true
        },
        productName: String,
        quantity: {
            type: Number,
            required: true
        },
        price: Number,
        reason: {
            type: String,
            required: true,
            enum: ['wrong_size', 'wrong_item', 'defective', 'not_as_described', 'changed_mind', 'other']
        },
        reasonDetails: String,
        images: [String]
    }],
    returnType: {
        type: String,
        enum: ['refund', 'exchange'],
        required: true,
        default: 'refund'
    },
    status: {
        type: String,
        enum: ['requested', 'approved', 'rejected', 'picked_up', 'received', 'inspected', 'completed', 'cancelled'],
        default: 'requested'
    },
    pickupAddress: {
        street: String,
        city: String,
        state: String,
        zip: String,
        country: String,
        phone: String
    },
    pickupDate: Date,
    pickupTimeSlot: String,
    refundAmount: Number,
    refundMethod: {
        type: String,
        enum: ['original_payment', 'wallet', 'bank_transfer']
    },
    refundStatus: {
        type: String,
        enum: ['pending', 'processing', 'completed', 'failed']
    },
    refundedAt: Date,
    exchangeOrderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    },
    adminNotes: String,
    trackingNumber: String,
    statusHistory: [{
        status: String,
        updatedAt: {
            type: Date,
            default: Date.now
        },
        updatedBy: String,
        notes: String
    }]
}, {
    timestamps: true
});

// Index for faster queries
returnRequestSchema.index({ user: 1, createdAt: -1 });
returnRequestSchema.index({ order: 1 });
returnRequestSchema.index({ status: 1 });

const ReturnRequest = mongoose.model('ReturnRequest', returnRequestSchema);

export default ReturnRequest;
