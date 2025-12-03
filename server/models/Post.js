import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    text: {
        type: String,
        required: true,
        maxlength: 500
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const postSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    image: {
        type: String,
        required: true
    },
    caption: {
        type: String,
        maxlength: 1000
    },
    taggedProducts: [{
        type: Number // Product ID
    }],
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    comments: [commentSchema]
}, {
    timestamps: true
});

// Indexes for performance
postSchema.index({ user: 1 });
postSchema.index({ createdAt: -1 }); // For sorting feed by newest first
postSchema.index({ taggedProducts: 1 }); // For finding posts by product

const Post = mongoose.model('Post', postSchema);

export default Post;
