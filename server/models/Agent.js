import mongoose from 'mongoose';

const agentSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true
    },
    pinCodes: [{
        type: String,
        required: true
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    assignedOrders: {
        type: Number,
        default: 0
    },
    completedOrders: {
        type: Number,
        default: 0
    },
    rating: {
        type: Number,
        default: 5.0,
        min: 0,
        max: 5
    },
    city: {
        type: String
    },
    address: {
        type: String
    }
}, {
    timestamps: true
});

// Indexes for performance
agentSchema.index({ pinCodes: 1 });
agentSchema.index({ isActive: 1 });
agentSchema.index({ city: 1 });

const Agent = mongoose.model('Agent', agentSchema);

export default Agent;
