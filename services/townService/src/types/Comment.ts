import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
    commentID: String,
    postID: String,
    townID: String,
    ownerID: String,
    commentContent: String,
    comments: [String]
});

const File = mongoose.model("Comment", CommentSchema);

export { File };