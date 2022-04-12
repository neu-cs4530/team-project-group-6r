import { Post } from "../../types/PostTown/post";
import { Comment } from "../../types/PostTown/comment";
import mongoose from 'mongoose';
import { PostSchema } from "../../schemas/MongoPost";
import { CommentSchema } from "../../schemas/MongoComment";
import { gfs, gridfsBucket } from "../../server";
import { DeleteResult } from "mongodb";

export default class DatabaseController {
    private static _instance : DatabaseController;

    static getInstance() : DatabaseController {
        if (DatabaseController._instance === undefined) {
            DatabaseController._instance = new DatabaseController();
        }

        return DatabaseController._instance;
    }

    async createPost(coveyTownID : string, post : Post) : Promise<Post> {
        const model = mongoose.model("post", PostSchema, coveyTownID);
        const insertPost = new model(post);

        return await insertPost.save();
    }

    async getPost(coveyTownID : string, postID : string) : Promise<any> {
        const model = mongoose.model("post", PostSchema, coveyTownID);
        return await model.findById(postID);
    }

    async getAllPostInTown(coveyTownID : string) : Promise<Post[]> {
        const model = mongoose.model("post", PostSchema, coveyTownID);
        return await model.find({});
    }

    async deletePost(coveyTownID : string, postID : string) : Promise<any> {
        const model = mongoose.model("post", PostSchema, coveyTownID);
        return await model.findByIdAndDelete(postID);
    }

    async updatePost(coveyTownID : string, postID : string, post : Post) : Promise<any> {
        const model = mongoose.model("post", PostSchema, coveyTownID);
        return await model.findByIdAndUpdate(postID, post, {new : true});
    }

    async addCommentToRootPost(coveyTownID : string, rootPostID : string, createdCommentID : string) {
        const model = mongoose.model("post", PostSchema, coveyTownID);
        return await model.findByIdAndUpdate(rootPostID, { $push: {comments: createdCommentID}} );
    }

    async createComment(coveyTownID : string, comment : Comment) : Promise<Comment> {
        const model = mongoose.model("comment", CommentSchema, coveyTownID);
        const insertComment = new model(comment);

        return await insertComment.save();
    }

    async getComment(coveyTownID : string, commentID : string) : Promise<any> {
        const model = mongoose.model("comment", CommentSchema, coveyTownID);
        return await model.findById(commentID);
    }

    async getAllComments(coveyTownID : string, commentIDs : string[]) : Promise<Comment[]> {
        const model = mongoose.model("comment", CommentSchema, coveyTownID);
        return await model.find({_id: {$in: commentIDs}});
    }

    async deleteComment(coveyTownID : string, commentID : string) : Promise<any> {
        const model = mongoose.model("comment", CommentSchema, coveyTownID);
        return await model.findByIdAndUpdate(commentID, { $set: {isDeleted: true} }, {new: true});
    }

    async deleteCommentsUnderPost(coveyTownID : string, postID : string) : Promise<any> {
        const model = mongoose.model("comment", CommentSchema, coveyTownID);
        return await model.deleteMany({ rootPostID: postID });
    }

    async updateComment(coveyTownID : string, commentID : string, comment : Comment) : Promise<any> {
        const model = mongoose.model("comment", CommentSchema, coveyTownID);
        return await model.findByIdAndUpdate(commentID, comment, {new: true});
    }

    async addCommentToParentComment(coveyTownID : string, parentCommentID : string, createdCommentID : string) {
        const model = mongoose.model("comment", CommentSchema, coveyTownID);
        return await model.findByIdAndUpdate(parentCommentID, { $push: {comments: createdCommentID}} );
    }

    async getFile(fileID: string) : Promise<any> {
        const obj_id = new mongoose.Types.ObjectId(fileID);
        return await gfs.files.findOne({_id: obj_id});
    }

    async deleteFile(fileID: string): Promise<any> {
        const obj_id = new mongoose.Types.ObjectId(fileID);
        return await gridfsBucket.delete(obj_id);
    }
}