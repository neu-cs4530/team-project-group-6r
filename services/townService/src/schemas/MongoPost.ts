import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
  title: { type: String, immutable: true },
  postContent: String,
  ownerID: { type: String, immutable: true },
  isVisible: Boolean,
  fileID: { type: String, default: '' },
  comments: { type: [String], default: [] },
  coordinates: {
    x: { type: Number, immutable: true },
    y: { type: Number, immutable: true }, 
  },
}, { timestamps: true });

export default PostSchema;