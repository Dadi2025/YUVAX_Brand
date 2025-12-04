import mongoose from 'mongoose';

const spinWheelSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    lastSpinDate: {
        type: Date
    },
    totalSpins: {
        type: Number,
        default: 0
    },
    currentStreak: {
        type: Number,
        default: 0
    },
    longestStreak: {
        type: Number,
        default: 0
    },
    rewards: [{
        type: {
            type: String,
            enum: ['discount', 'free_shipping', 'points', 'mystery_gift']
        },
        value: Number,
        code: String,
        expiresAt: Date,
        used: {
            type: Boolean,
            default: false
        },
        usedAt: Date,
        spunAt: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

// Check if user can spin today
spinWheelSchema.methods.canSpinToday = function () {
    if (!this.lastSpinDate) return true;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastSpin = new Date(this.lastSpinDate);
    lastSpin.setHours(0, 0, 0, 0);

    return today > lastSpin;
};

// Update streak
spinWheelSchema.methods.updateStreak = function () {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!this.lastSpinDate) {
        this.currentStreak = 1;
    } else {
        const lastSpin = new Date(this.lastSpinDate);
        lastSpin.setHours(0, 0, 0, 0);

        const daysDiff = Math.floor((today - lastSpin) / (1000 * 60 * 60 * 24));

        if (daysDiff === 1) {
            this.currentStreak += 1;
        } else if (daysDiff > 1) {
            this.currentStreak = 1;
        }
    }

    if (this.currentStreak > this.longestStreak) {
        this.longestStreak = this.currentStreak;
    }

    this.lastSpinDate = new Date();
    this.totalSpins += 1;
};

const SpinWheel = mongoose.model('SpinWheel', spinWheelSchema);

export default SpinWheel;
