import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

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
    },
    password: {
        type: String,
        required: true
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpire: {
        type: Date
    },
    mustChangePassword: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

agentSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

agentSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Indexes for performance
agentSchema.index({ pinCodes: 1 });
agentSchema.index({ isActive: 1 });
agentSchema.index({ city: 1 });

const Agent = mongoose.model('Agent', agentSchema);

export default Agent;
