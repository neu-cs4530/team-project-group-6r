import { Post } from "../../types/PostTown/post";
import mongoose from 'mongoose';
import { PostSchema } from "../../schemas/MongoPost";
import { CommentSchema } from "../../schemas/MongoComment";

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

    async getAllPostInTown(coveyTownID : string) : Promise<any> {
        const model = mongoose.model("post", PostSchema, coveyTownID);
        console.log(coveyTownID)
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

    async createComment(coveyTownID : string, comment : Comment) : Promise<Comment> {
        const model = mongoose.model("comment", CommentSchema, coveyTownID);
        const insertComment = new model(comment);

        return await insertComment.save();
    }

    async deletePost(coveyTownID : string, postID : string) : Promise<any> {
        const model = mongoose.model("post", PostSchema, coveyTownID);
        return await model.findByIdAndDelete(postID);
    }

    async updatePost(coveyTownID : string, postID : string, post : Post) : Promise<any> {
        const model = mongoose.model("post", PostSchema, coveyTownID);
        return await model.findByIdAndUpdate(postID, post, {new : true});
    }
}