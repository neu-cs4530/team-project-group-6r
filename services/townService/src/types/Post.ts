import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    postID: String,
    title: String,
    postContent: String,
    ownerID: String,
    townID: String,
    isVisible: Boolean,
    postTime: Date,
    updateTime: Date,
    expirationTime: Date,
    coordinates: {
        x: Number,
        y: Number 
    },
    comments: [String]
});

const Post = mongoose.model("Post", PostSchema);

export { Post };