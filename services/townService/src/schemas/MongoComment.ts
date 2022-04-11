import mongoose from "mongoose";

/**
 * This is the mongo representation of the Comment object type
 */
const CommentSchema = new mongoose.Schema({
    rootPostID: String,
    parentCommentID: String,
    ownerID: String,
    commentContent: String,
    isDeleted: Boolean,
    comments: { type: [String], default: [] }
}, { timestamps: true });

export { CommentSchema }; 