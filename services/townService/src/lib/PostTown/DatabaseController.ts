import mongoose from 'mongoose';
import { Post } from '../../types/PostTown/post';
import { Comment } from '../../types/PostTown/comment';
import PostSchema from '../../schemas/MongoPost';
import CommentSchema from '../../schemas/MongoComment';
import { gfs, gridfsBucket } from '../../connection';

export default class DatabaseController {
  private static _instance : DatabaseController;

  static getInstance() : DatabaseController {
    if (DatabaseController._instance === undefined) {
      DatabaseController._instance = new DatabaseController();
    }

    return DatabaseController._instance;
  }

  async createPost(coveyTownID: string, post : Post) : Promise<any> {
    const Model = mongoose.model('post', PostSchema, coveyTownID);
    const insertPost = new Model(post);

    return insertPost.save();
  }

  async getPost(coveyTownID : string, postID : string) : Promise<any> {
    const model = mongoose.model('post', PostSchema, coveyTownID);
    return model.findById(postID);
  }

  async getAllPostInTown(coveyTownID : string) : Promise<Post[]> {
    const model = mongoose.model('post', PostSchema, coveyTownID);
    return model.find({});
  }

  async deletePost(coveyTownID : string, postID : string) : Promise<any> {
    const model = mongoose.model('post', PostSchema, coveyTownID);
    return model.findByIdAndDelete(postID);
  }

  async updatePost(coveyTownID : string, postID : string, post : Post) : Promise<any> {
    const model = mongoose.model('post', PostSchema, coveyTownID);
    return model.findByIdAndUpdate(postID, post, { new : true });
  }

  async addCommentToRootPost(coveyTownID : string, rootPostID : string, createdCommentID : string) {
    const model = mongoose.model('post', PostSchema, coveyTownID);
    return model.findByIdAndUpdate(rootPostID, { $push: { comments: createdCommentID } } );
  }

  async createComment(coveyTownID : string, comment : Comment) : Promise<Comment> {
    const Model = mongoose.model('comment', CommentSchema, coveyTownID);
    const insertComment = new Model(comment);

    return insertComment.save();
  }

  async getComment(coveyTownID : string, commentID : string) : Promise<any> {
    const model = mongoose.model('comment', CommentSchema, coveyTownID);
    return model.findById(commentID);
  }

  async getAllComments(coveyTownID : string, commentIDs : string[]) : Promise<Comment[]> {
    const model = mongoose.model('comment', CommentSchema, coveyTownID);
    return model.find({ _id: { $in: commentIDs } });
  }

  async deleteComment(coveyTownID : string, commentID : string) : Promise<any> {
    const model = mongoose.model('comment', CommentSchema, coveyTownID);
    return model.findByIdAndUpdate(commentID, { $set: { isDeleted: true } }, { new: true });
  }

  async deleteCommentsUnderPost(coveyTownID : string, postID : string) : Promise<any> {
    const model = mongoose.model('comment', CommentSchema, coveyTownID);
    return model.deleteMany({ rootPostID: postID });
  }

  async updateComment(coveyTownID : string, commentID : string, comment : Comment) : Promise<any> {
    const model = mongoose.model('comment', CommentSchema, coveyTownID);
    return model.findByIdAndUpdate(commentID, comment, { new: true });
  }

  async addCommentToParentComment(coveyTownID : string, parentCommentID : string, createdCommentID : string) {
    const model = mongoose.model('comment', CommentSchema, coveyTownID);
    return model.findByIdAndUpdate(parentCommentID, { $push: { comments: createdCommentID } } );
  }

  async getFile(fileID: string) : Promise<any> {
    const objId = new mongoose.Types.ObjectId(fileID);
    return gfs.files.findOne({ _id: objId });
  }

  async deleteFile(fileID: string): Promise<any> {
    const objId = new mongoose.Types.ObjectId(fileID);
    return gridfsBucket.delete(objId);
  }
}