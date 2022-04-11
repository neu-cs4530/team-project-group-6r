import { Post } from "../../types/PostTown/post";
import { Comment } from "../../types/PostTown/comment";
import mongoose from 'mongoose';
import { PostSchema } from "../../schemas/MongoPost";
import { CommentSchema } from "../../schemas/MongoComment";
import { gfs, gridfsBucket } from "../../server";

export default class DatabaseController {
    private static _instance : DatabaseController;
    
    /**
     * Checks to see if an instance of this class has already been created, and if not, creates a new instance
     * @returns an instance of this class
     */
    static getInstance() : DatabaseController {
        if (DatabaseController._instance === undefined) {
            DatabaseController._instance = new DatabaseController();
        }

        return DatabaseController._instance;
    }

    /**
     * Creates the post schema for mongo
     * @param coveyTownID The id of the town we're making a post in
     * @param post The post we're uploading to mongo
     * @returns The result of the upload to mongo
     */
    async createPost(coveyTownID : string, post : Post) : Promise<Post> {
        const model = mongoose.model("post", PostSchema, coveyTownID);
        const insertPost = new model(post);

        return await insertPost.save();
    }

    /**
     * Gets the post from mongo
     * @param coveyTownID The id of the town we want to get the post from
     * @param postID The post we're trying to pull from mongo
     * @returns The result of pulling the post from mongo
     */
    async getPost(coveyTownID : string, postID : string) : Promise<any> {
        const model = mongoose.model("post", PostSchema, coveyTownID);
        return await model.findById(postID);
    }

    /**
     * Gets all the posts of a town from mongo
     * @param coveyTownID The id of the town we're pulling posts from
     * @returns The result of pulling all posts from mongo
     */
    async getAllPostInTown(coveyTownID : string) : Promise<any> {
        const model = mongoose.model("post", PostSchema, coveyTownID);
        console.log(coveyTownID)
        return await model.find({});
    }

    /**
     * Deletes a post of a town from mongo
     * @param coveyTownID The id of the town we're deleting a post from
     * @param postID The id of the post we're deleting
     * @returns The result of deleting the post from mongo
     */
    async deletePost(coveyTownID : string, postID : string) : Promise<any> {
        const model = mongoose.model("post", PostSchema, coveyTownID);
        return await model.findByIdAndDelete(postID);
    }

    /**
     * Updates a post in the mongo db
     * @param coveyTownID The id of the town we're updating a post in
     * @param postID The id of the post we're updating
     * @param post The updated version of the post
     * @returns The result of updating the post in mongo
     */
    async updatePost(coveyTownID : string, postID : string, post : Post) : Promise<any> {
        const model = mongoose.model("post", PostSchema, coveyTownID);
        return await model.findByIdAndUpdate(postID, post, {new : true});
    }

    /**
     * Adds a comment linked to a post in mongo
     * @param coveyTownID The id of the town we're adding a comment to
     * @param rootPostID The post we're attaching a comment to
     * @param createdCommentID The id of the comment we're attaching to a post
     * @returns The result of linking a comment to a post
     */
    async addCommentToRootPost(coveyTownID : string, rootPostID : string, createdCommentID : string) {
        const model = mongoose.model("post", PostSchema, coveyTownID);
        return await model.findByIdAndUpdate(rootPostID, { $push: {comments: createdCommentID}} );
    }

    /**
     * Creates a comment in the mongo db
     * @param coveyTownID The id of the town we're adding the comment to
     * @param comment The comment we're adding
     * @returns The result of adding the comment to the db
     */
    async createComment(coveyTownID : string, comment : Comment) : Promise<Comment> {
        const model = mongoose.model("comment", CommentSchema, coveyTownID);
        const insertComment = new model(comment);

        return await insertComment.save();
    }

    /**
     * Gets a comment from mongo
     * @param coveyTownID The id of the town we're pulling a comment from
     * @param commentID The id of the comment we're pulling
     * @returns The result of pulling a comment from mongo
     */
    async getComment(coveyTownID : string, commentID : string) : Promise<any> {
        const model = mongoose.model("comment", CommentSchema, coveyTownID);
        return await model.findById(commentID);
    }

    /**
     * Deletes a comment from mongo
     * @param coveyTownID The id of the town we're deleting a comment from
     * @param commentID The id of the comment we're deleting
     * @returns The result of deleting the comment from mongo
     */
    async deleteComment(coveyTownID : string, commentID : string) : Promise<any> {
        const model = mongoose.model("comment", CommentSchema, coveyTownID);
        return await model.findByIdAndUpdate(commentID, { $set: {isDeleted: true} }, {new: true});
    }

    /**
     * Deletes all comments from a post in mongo
     * @param coveyTownID The id of the town we're updating
     * @param postID The post we want all comments deleted from
     * @returns The result of deleting all the comments linked to a post from mongo
     */
    async deleteCommentsUnderPost(coveyTownID : string, postID : string) : Promise<any> {
        const model = mongoose.model("comment", CommentSchema, coveyTownID);
        return await model.deleteMany({ rootPostID: postID })
    }

    /**
     * Updates a comment in the mongo db
     * @param coveyTownID The id of the town we're updating a comment in
     * @param commentID The id of the comment we're updating
     * @param comment The updated version of the comment
     * @returns The result of updating the comment in mongo
     */
    async updateComment(coveyTownID : string, commentID : string, comment : Comment) : Promise<any> {
        const model = mongoose.model("comment", CommentSchema, coveyTownID);
        return await model.findByIdAndUpdate(commentID, comment, {new: true});
    }

    /**
     * Links a comment to another comment in mongo
     * @param coveyTownID The id of the town we're updating
     * @param parentCommentID The parent comment
     * @param createdCommentID The child comment we want to link to the parent
     * @returns The result of linking the comments together
     */
    async addCommentToParentComment(coveyTownID : string, parentCommentID : string, createdCommentID : string) {
        const model = mongoose.model("comment", CommentSchema, coveyTownID);
        return await model.findByIdAndUpdate(parentCommentID, { $push: {comments: createdCommentID}} );
    }

    /**
     * Gets the actual file linked to a post
     * @param fileID The id of the file we want
     * @returns The result of getting the file
     */
    async getFile(fileID: string) {
        const obj_id = new mongoose.Types.ObjectId(fileID);
        return await gfs.files.findOne({_id: obj_id});
    }

    /**
     * Deletes a file linked to a post
     * @param fileID The id of the file we want to get rid of
     * @returns The result of deleting the file
     */
    async deleteFile(fileID: string) {
        const obj_id = new mongoose.Types.ObjectId(fileID);
        return await gridfsBucket.delete(obj_id);
    }
}