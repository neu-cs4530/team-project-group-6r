import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    title: String,
    postContent: String,
    ownerID: String,
    isVisible: Boolean,
    coordinates: {
        x: Number,
        y: Number 
    }
});

export { PostSchema }