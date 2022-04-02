import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
    commentID: String,
    postID: String,
    townID: String,
    ownerID: String,
    commentContent: String,
    comments: [String]
});

const Comment = mongoose.model("Comment", CommentSchema);

export { Comment };