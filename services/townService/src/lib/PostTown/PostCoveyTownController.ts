import { nanoid } from 'nanoid';
import CoveyTownController from '../CoveyTownController';
import {Post} from "../../types/PostTown/post";
import DatabaseController from './DatabaseController';

export default class PostCoveyTownController extends CoveyTownController {
    // Owner
    // private _owner: string;
    // Administrators
    // private _administrators: string[];


    constructor(friendlyName: string, isPubliclyListed: boolean) {
        super(friendlyName, isPubliclyListed);
    }

    // Add
    async createPost(post : Post) : Promise<Post> {
        // Area collision?
        // Create the post
        // Invoke the listener
        const databaseController = DatabaseController.getInstance();
        const result = await databaseController.createPost(this.coveyTownID, post);

        return result;
    }

    async getPost(postID : string) : Promise<Post> {
        const databaseController = DatabaseController.getInstance();
        const result : Post = await databaseController.getPost(this.coveyTownID, postID);

        return result;
    }

    async getAllPostInTown() : Promise<string[]> {
        const databaseController = DatabaseController.getInstance();
        const result : string[] = await databaseController.getAllPostInTown(this.coveyTownID);

        return result;
    }

    async deletePost(postID : string) : Promise<Post> {
        const databaseController = DatabaseController.getInstance();
        const result : Post = await databaseController.deletePost(this.coveyTownID, postID);

        return result;
    }

    async updatePost(postID : string, post : Post) : Promise<Post> {
        const databaseController = DatabaseController.getInstance();
        const result : Post = await databaseController.updatePost(this.coveyTownID, postID, post);

        return result;
    }

    async createComment(comment : Comment) : Promise<Comment> {
        const databaseController = DatabaseController.getInstance();
        const result:Comment = await databaseController.createComment(this.coveyTownID, comment);

        return result;
    }
}