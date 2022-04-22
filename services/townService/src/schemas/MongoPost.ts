import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
  title: { type: String, immutable: true },
  postContent: String,
  ownerID: { type: String, immutable: true },
  isVisible: Boolean,
  timeToLive: { type: Number, default: 300000 },
  filename: { type: String, default: '' },
  comments: { type: [String], default: [] },
  coordinates: {
    x: Number,
    y: Number
  },
}, { timestamps: true });

export default PostSchema;