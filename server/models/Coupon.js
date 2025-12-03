import mongoose from 'mongoose';

const couponSchema = mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true
    },
    discount: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    type: {
        type: String,
        enum: ['percentage', 'freeShipping'],
        default: 'percentage'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    isUsed: {
        type: Boolean,
        default: false
    },
    expiresAt: {
        type: Date,
        required: true
    },
    wonAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for faster queries
couponSchema.index({ user: 1, isUsed: 1 });
couponSchema.index({ code: 1 });

const Coupon = mongoose.model('Coupon', couponSchema);

export default Coupon;
