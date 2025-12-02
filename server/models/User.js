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
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

export default User;
