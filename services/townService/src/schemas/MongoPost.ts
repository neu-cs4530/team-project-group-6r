import mongoose from 'mongoose';
import { PostSkin } from '../types/PostTown/post';

const postSkins = Object.values(PostSkin);

/**
 * The mongo schema of a post
 */
const PostSchema = new mongoose.Schema({
  title: { type: String, immutable: true },
  postContent: String,
  ownerID: { type: String, immutable: true },
  isVisible: Boolean,
  timeToLive: { type: Number, default: 50000 },
  numberOfComments: { type: Number, default: 0 },
  file: {
    filename: { type: String, default: ''},
    contentType: { type: String, default: ''}
  },
  comments: { type: [String], default: [] },
  postSkin: { type: String, default: 'POST', enum: postSkins, immutable: true },
  coordinates: {
    x: Number,
    y: Number
  },
}, { timestamps: true });

export default PostSchema;