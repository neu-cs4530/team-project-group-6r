import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    postID: String,
    title: String,
    postContent: String,
    ownerID: String,
    isVisible: Boolean,
    postTime: Date,
    updateTime: Date,
    expirationTime: Date,
    coordinates: {
        x: Number,
        y: Number 
    }

});

PostSchema.add({
    posts: [PostSchema]
})

const Post = mongoose.model("Post", PostSchema);

export { Post };