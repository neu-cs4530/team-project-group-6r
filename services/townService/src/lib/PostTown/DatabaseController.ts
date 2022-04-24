import mongoose from 'mongoose';
import { Post } from '../../types/PostTown/post';
import { Comment } from '../../types/PostTown/comment';
import PostSchema from '../../schemas/MongoPost';
import CommentSchema from '../../schemas/MongoComment';
import FileConnection from '../../connection';

export async function createPost(coveyTownID: string, post : Post) : Promise<Post> {
  const Model = mongoose.model('post', PostSchema, coveyTownID);
  const insertPost = new Model(post);

  return insertPost.save();
}

export async function getPost(coveyTownID : string, postID : string) : Promise<any> {
  const model = mongoose.model('post', PostSchema, coveyTownID);
  return model.findById(postID);
}

export async function getAllPostInTown(coveyTownID : string) : Promise<Post[]> {
  const model = mongoose.model('post', PostSchema, coveyTownID);
  return model.find();
}

export async function deletePost(coveyTownID : string, postID : string) : Promise<any> {
  const model = mongoose.model('post', PostSchema, coveyTownID);
  return model.findByIdAndDelete(postID);
}

export async function updatePost(coveyTownID : string, postID : string, post : any) : Promise<any> {
  const model = mongoose.model('post', PostSchema, coveyTownID);
  return model.findByIdAndUpdate(postID, { $set: post }, { new : true });
}

export async function addCommentToRootPost(coveyTownID : string, rootPostID : string, createdCommentID : string) {
  const model = mongoose.model('post', PostSchema, coveyTownID);
  return model.findByIdAndUpdate(rootPostID, { $push: { comments: createdCommentID } } );
}

export async function createComment(coveyTownID : string, comment : Comment) : Promise<Comment> {
  const Model = mongoose.model('comment', CommentSchema, coveyTownID);
  const insertComment = new Model(comment);

  return insertComment.save();
}

export async function addTimeToPostTTL(coveyTownID : string, rootPostID : string) {
	const model = mongoose.model('post', PostSchema, coveyTownID);
  return model.findByIdAndUpdate({ _id: rootPostID, timeToLive: { $lte: 90000 } }, { $inc: { timeToLive: 30000 } });
}

export async function getComment(coveyTownID : string, commentID : string) : Promise<any> {
  const model = mongoose.model('comment', CommentSchema, coveyTownID);
  return model.findById(commentID);
}

export async function getAllComments(coveyTownID : string, commentIDs : string[]) : Promise<Comment[]> {
  const model = mongoose.model('comment', CommentSchema, coveyTownID);
  return model.find({ _id: { $in: commentIDs } });
}

export async function deleteComment(coveyTownID : string, commentID : string) : Promise<any> {
  const model = mongoose.model('comment', CommentSchema, coveyTownID);
  return model.findByIdAndUpdate(commentID, { $set: { isDeleted: true, commentContent: '[removed]', ownerID: '[deleted]'} }, { new: true, timestamps: false });
}

export async function deleteCommentsUnderPost(coveyTownID : string, postID : string) : Promise<any> {
  const model = mongoose.model('comment', CommentSchema, coveyTownID);
  return model.deleteMany({ rootPostID: postID });
}

export async function updateComment(coveyTownID : string, commentID : string, comment : any) : Promise<any> {
  const model = mongoose.model('comment', CommentSchema, coveyTownID);
  return model.findByIdAndUpdate(commentID, { $set: comment }, { new: true });
}

export async function addCommentToParentComment(coveyTownID : string, parentCommentID : string, createdCommentID : string) {
  const model = mongoose.model('comment', CommentSchema, coveyTownID);
  return model.findByIdAndUpdate(parentCommentID, { $push: { comments: createdCommentID }}, {timestamps:false});
}

export async function getFile(filename: string) : Promise<any> {
  const { gfs } = FileConnection.getInstance();
  return gfs.files.findOne({ filename: filename });
}

export async function deleteFile(filename: string): Promise<any> {
  const { gfs, gridfsBucket } = FileConnection.getInstance();
  gfs.files.findOne({ filename: filename }, (err, result) => {
    if(err) {
      throw Error('Can\'t find file')
    }

    if(result?._id) {
      return gridfsBucket.delete(result?._id);
    } else{
      throw Error('Can\'t find file id')
    }
  });
}
