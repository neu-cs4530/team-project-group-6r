import CoveyTownController from '../CoveyTownController';
import { Post } from "../../types/PostTown/post";
import { Comment } from "../../types/PostTown/comment";
import DatabaseController from './DatabaseController';
import Filter from 'bad-words';

export default class PostCoveyTownController extends CoveyTownController {
    // Owner
    // private _owner: string;
    // Administrators
    // private _administrators: string[];

    private filter : Filter;

    constructor(friendlyName: string, isPubliclyListed: boolean) {
        super(friendlyName, isPubliclyListed);
        this.filter = new Filter();
    }

    // Add
    async createPost(post : Post) : Promise<Post> {
        // Area collision?
        // Create the post
        // Invoke the listener
        const databaseController = DatabaseController.getInstance();

        //censor
        post.postContent = this.filter.clean(post.postContent.valueOf());
        post.title = this.filter.clean(post.title.valueOf());
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

        //censor
        post.postContent = this.filter.clean(post.postContent.valueOf());
        post.title = this.filter.clean(post.title.valueOf());
        const result : Post = await databaseController.updatePost(this.coveyTownID, postID, post);

        return result;
    }

    async createComment(comment : Comment) : Promise<Comment> {
        const databaseController = DatabaseController.getInstance();

        //censor
        comment.commentContent = this.filter.clean(comment.commentContent.valueOf());
        const result : Comment = await databaseController.createComment(this.coveyTownID, comment);

        return result;
    }

    async getComment(commentID : string) : Promise<Comment> {
        const databaseController = DatabaseController.getInstance();
        const result : Comment = await databaseController.getComment(this.coveyTownID, commentID);

        return result;
    }

    async deleteComment(commentID : string) : Promise<Comment> {
        const databaseController = DatabaseController.getInstance();
        const result : Comment = await databaseController.deleteComment(this.coveyTownID, commentID);

        return result;
    }

    async updateComment(commentID : string, comment : Comment) : Promise<Comment> {
        const databaseController = DatabaseController.getInstance();

        //censor
        comment.commentContent = this.filter.clean(comment.commentContent.valueOf());
        const result : Comment = await databaseController.updateComment(this.coveyTownID, commentID, comment);

        return result;
    }
}