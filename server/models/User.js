import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    isAdmin: { type: Boolean, required: true, default: false },
    addresses: [{
        street: String,
        city: String,
        state: String,
        zip: String,
        country: String
    }],
    wishlist: [{
        productId: { type: Number, required: true },
        priceWhenAdded: { type: Number },
        addedAt: { type: Date, default: Date.now },
        notifiedAt: { type: Date }
    }],
    points: {
        type: Number,
        default: 0
    },
    // Loyalty Program Fields
    loyaltyPoints: {
        type: Number,
        default: 0
    },
    loyaltyTier: {
        type: String,
        enum: ['Bronze', 'Silver', 'Gold'],
        default: 'Bronze'
    },
    totalSpent: {
        type: Number,
        default: 0
    },
    // Referral Program Fields
    referralCode: {
        type: String,
        unique: true,
        sparse: true
    },
    referredBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    referralStats: {
        totalReferrals: { type: Number, default: 0 },
        successfulReferrals: { type: Number, default: 0 },
        referralEarnings: { type: Number, default: 0 },
        referralRank: { type: Number, default: 0 }
    },
    walletBalance: {
        type: Number,
        default: 0
    },
    referralEarnings: {
        type: Number,
        default: 0
    },
    priceAlertsEnabled: {
        type: Boolean,
        default: true
    },
    // Birthday for special offers
    birthday: {
        type: Date
    },
    lastBirthdayReward: {
        type: Date
    }
}, {
    timestamps: true
});

// Indexes for performance
userSchema.index({ email: 1 });
userSchema.index({ phone: 1 });

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre('save', async function (next) {
    // Generate referral code for new users
    if (this.isNew && !this.referralCode) {
        this.referralCode = generateReferralCode();
    }

    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Helper function to generate unique referral code
function generateReferralCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

const User = mongoose.model('User', userSchema);

export default User;
