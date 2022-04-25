import mongoose from 'mongoose';

/**
 * The mongo schema of a comment on a post
 */
const CommentSchema = new mongoose.Schema({
  rootPostID: { type: String, immutable: true },
  parentCommentID: { type: String, immutable: true },
  ownerID: String,
  commentContent: String,
  isDeleted: Boolean,
  comments: { type: [String], default: [] },
}, { timestamps: true });

export default CommentSchema; 