import mongoose from 'mongoose';

const orderSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    orderItems: [{
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        product: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Product'
        },
        size: { type: String },
        color: { type: String }
    }],
    shippingAddress: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true }
    },
    billingAddress: {
        address: { type: String },
        city: { type: String },
        postalCode: { type: String },
        country: { type: String }
    },
    paymentMethod: {
        type: String,
        required: true
    },
    paymentResult: {
        id: { type: String },
        status: { type: String },
        update_time: { type: String },
        email_address: { type: String }
    },
    taxPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    shippingPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    isPaid: {
        type: Boolean,
        required: true,
        default: false
    },
    paidAt: {
        type: Date
    },
    isDelivered: {
        type: Boolean,
        required: true,
        default: false
    },
    deliveredAt: {
        type: Date
    },
    returnStatus: {
        type: String,
        enum: ['None', 'Requested', 'Approved', 'Rejected', 'Picked Up', 'Completed'],
        default: 'None'
    },
    returnReason: {
        type: String
    },
    exchangeStatus: {
        type: String,
        enum: ['None', 'Requested', 'Approved', 'Rejected', 'Completed'],
        default: 'None'
    },
    exchangeReason: {
        type: String
    },
    refundStatus: {
        type: String,
        enum: ['None', 'Pending', 'Completed', 'Failed'],
        default: 'None'
    },
    refundAmount: {
        type: Number,
        default: 0.0
    },
    refundedAt: {
        type: Date
    },
    status: {
        type: String,
        default: 'Processing'
    },
    assignedAgent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Agent'
    },
    deliveryPinCode: {
        type: String
    },
    agentAssignedAt: {
        type: Date
    }
}, {
    timestamps: true
});

// Indexes for performance
orderSchema.index({ user: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 }); // For sorting by date

const Order = mongoose.model('Order', orderSchema);

export default Order;
