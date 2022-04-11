import mongoose from "mongoose";

/**
 * This is the mongo representation of the Post object type
 */
const PostSchema = new mongoose.Schema({
    title: String,
    postContent: String,
    ownerID: String,
    isVisible: Boolean,
    fileID: { type: String, default: ''},
    comments: { type: [String], default: [] },
    coordinates: {
        x: Number,
        y: Number 
    }
}, { timestamps: true });

export { PostSchema }