import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
    rootPostID: String,
    parentCommentID: String,
    ownerID: String,
    commentContent: String,
    isDeleted: Boolean,
    comments: { type: [String], default: [] }
}, { timestamps: true });


export { CommentSchema }; 