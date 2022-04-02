import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    postID: {
        type: String
    },
});

const Post = mongoose.model("Post", PostSchema);

export { Post };