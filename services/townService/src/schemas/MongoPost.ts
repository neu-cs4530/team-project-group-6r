import mongoose from 'mongoose';

/**
 * The mongo schema of a post
 */
const PostSchema = new mongoose.Schema({
  title: { type: String, immutable: true },
  postContent: String,
  ownerID: { type: String, immutable: true },
  isVisible: Boolean,
  file: {
    filename: { type: String, default: ''},
    contentType: { type: String, default: ''}
  },
  comments: { type: [String], default: [] },
  coordinates: {
    x: Number,
    y: Number
  },
}, { timestamps: true });

export default PostSchema;