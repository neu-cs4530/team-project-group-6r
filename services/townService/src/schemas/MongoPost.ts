import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    title: String,
    postContent: String,
    ownerID: String,
    isVisible: Boolean,
    comments: { type: [String], default: [] },
    coordinates: {
        x: Number,
        y: Number 
    }
}, { timestamps: true });

export { PostSchema }