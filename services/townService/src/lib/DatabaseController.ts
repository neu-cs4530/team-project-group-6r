import mongoose from 'mongoose';

import TownPost from "../types/TownPost";
import PostSchema from "../types/PostSchema";
import PlayerSession from '../types/PlayerSession';

export default class DatabaseController {
    connection;

    constructor() {
        this.connection = mongoose.connection;

        try {
            this.connection.on('error', console.error.bind(console, 'MongoDB error'))
        } catch (err) {
            if (err instanceof Error) {
                console.log(err.message);
            }
        }
    }

    async addPost(townPost: TownPost): Promise<string> {
        const townID = townPost.townID;
        try {
            const postModel = mongoose.model(townID, PostSchema);
            const post = new postModel(townPost);
            post.save();
            return 'addPost';
        } catch (err) {
            if (err instanceof Error) {
                return err.message;
            } else {
                return 'Unexpected error';
            }
        }
    }

    async getPost(townPost: TownPost): Promise<string[]> {
        const townID: string = townPost.townID;
        const postID: string = townPost.postID;

        try {
            const model = mongoose.model(townID, PostSchema);
            let posts = await model.find({ postID: postID }, 'postID - _id').exec();
            posts = posts.map(post => { return post.postID });
            return posts;
        } catch (err) {
            if (err instanceof Error) {
                console.log(err.message);
            } else {
                console.log('Unexpected error');
            }
        }
    }

    async getAllPostIDs(townPost: TownPost): Promise<string[]> {
        const townID: string = townPost.townID;
        try {
            const model = mongoose.model(townID, PostSchema);
            let posts = await model.find({}, 'postID - _id').exec();
            posts = posts.map(post => { return post.postID });
            return posts;
        } catch (err) {
            if (err instanceof Error) {
                console.log(err.message);
            } else {
                console.log('Unexpected error');
            }
        }
    }

    // async addComment(post: Post, comment: Comment): Promise<string> {

    // }
}