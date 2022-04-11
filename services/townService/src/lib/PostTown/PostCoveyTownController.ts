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
    private databaseController:DatabaseController;

    constructor(friendlyName: string, isPubliclyListed: boolean) {
        super(friendlyName, isPubliclyListed);
        this.filter = new Filter();
        this.databaseController = DatabaseController.getInstance();

    }

    // Add
    /**
     * Creates a post in covey town
     * @param post The post we want to make
     * @returns The result of adding the post to our database
     */
    async createPost(post : Post) : Promise<Post> {
        // Area collision?
        // Create the post
        // Invoke the listener

        //censor
        post.postContent = this.filter.clean(post.postContent.valueOf());
        post.title = this.filter.clean(post.title.valueOf());
        const result = await this.databaseController.createPost(this.coveyTownID, post);

        return result;
    }

    //this function and a few others can just be one liners
    /**
     * Gets a post from coveytown
     * @param postID The id of the post we want to get
     * @returns The result of pulling the post from our database
     */
    async getPost(postID : string) : Promise<Post> {
       // const result : Post = await this.databaseController.getPost(this.coveyTownID, postID);

        return await this.databaseController.getPost(this.coveyTownID, postID);
    }

    /**
     * Gets all the posts from coveytown
     * @returns The result of pulling all posts from our database
     */
    async getAllPostInTown() : Promise<string[]> {
       // const result : string[] = await this.databaseController.getAllPostInTown(this.coveyTownID);

        return await this.databaseController.getAllPostInTown(this.coveyTownID);
    }

    /**
     * Deletes a post from coveytown
     * @param postID The id of the post we want to delete
     * @param token The playersession token of the player who wants to delete their post
     * @returns The result of deleting the post from our database
     */
    async deletePost(postID : string, token : string) : Promise<Post> {
        const post: Post = await this.databaseController.getPost(this.coveyTownID, postID);
        
        const playerID: string = this.getSessionByToken(token)!.player.userName;
        
        if (post.ownerID === playerID) {
            const result : Post = await this.databaseController.deletePost(this.coveyTownID, postID);
            await this.databaseController.deleteCommentsUnderPost(this.coveyTownID, postID);

            if (post.fileID) {
                await this.databaseController.deleteFile(post.fileID);
            }

            return result;
        }

        //isn't this terrible
        throw Error('Incorrect post owner');
    }

    /**
     * Updates a post in coveytown
     * @param postID The id of the post we're updating
     * @param post The updated version of the post
     * @param token the player token of the player updating their post
     * @returns The result of updating the post in the database
     */
    async updatePost(postID : string, post : Post, token : string) : Promise<Post> {
        const postToUpdate: Post = await this.databaseController.getPost(this.coveyTownID, postID);

        const playerID: string = this.getSessionByToken(token)!.player.userName;
        
        if (postToUpdate.ownerID === playerID) {
            //censor
            post.postContent = this.filter.clean(post.postContent.valueOf());
            post.title = this.filter.clean(post.title.valueOf());
            const result : Post = await this.databaseController.updatePost(this.coveyTownID, postID, post);

            return result;
        }

        throw Error('Incorrect post owner');
    }

    /**
     * Creates a comment in covey town
     * @param comment The comment we want to make
     * @returns The result of adding the comment to our database
     */
    async createComment(comment : Comment) : Promise<Comment> {

        //censor
        comment.commentContent = this.filter.clean(comment.commentContent.valueOf());
        const result : Comment = await this.databaseController.createComment(this.coveyTownID, comment);
        //should I type cast like this, if I decide to check for string 
        //then that means the whole thing needs to be refactored
        const createdCommentID : string = result._id!;

        if (comment.parentCommentID === '') {
            await this.databaseController.addCommentToRootPost(this.coveyTownID, comment.rootPostID, createdCommentID);
        } else {
            await this.databaseController.addCommentToParentComment(this.coveyTownID, comment.parentCommentID, createdCommentID);
        }
        
        return result;
    }

    /**
     * Gets a comment from coveytown
     * @param commentID The id of the comment we want to get
     * @returns The result of pulling the comment from our database
     */
    async getComment(commentID : string) : Promise<Comment> {
        //const result : Comment = await this.databaseController.getComment(this.coveyTownID, commentID);

        return await this.databaseController.getComment(this.coveyTownID, commentID);
    }

    /**
     * Deletes a comment from coveytown
     * @param commentID The id of the comment we want to delete
     * @param token The playersession token of the player who wants to delete their comment
     * @returns The result of deleting the comment from our database
     */
    async deleteComment(commentID : string, token : string) : Promise<Comment> {
        const comment: Comment = await this.databaseController.getComment(this.coveyTownID, commentID);
        
        const playerID: string = this.getSessionByToken(token)!.player.userName;
        
        if (comment.ownerID === playerID) {
            // const result : Comment = await this.databaseController.deleteComment(this.coveyTownID, commentID);

            return await this.databaseController.deleteComment(this.coveyTownID, commentID);
        }

        //isn't this terrible
        throw Error('Incorrect post owner'); 
    }

    /**
     * Updates a comment in coveytown
     * @param commentID The id of the comment we're updating
     * @param comment The updated version of the comment
     * @param token the player token of the player updating their comment
     * @returns The result of updating the comment in the database
     */
    async updateComment(commentID : string, comment : Comment, token : string) : Promise<Comment> {
        const commentToUpdate: Comment = await this.databaseController.getComment(this.coveyTownID, commentID);

        const playerID: string = this.getSessionByToken(token)!.player.userName;
        
        if (commentToUpdate.ownerID === playerID) {
            //censor
            comment.commentContent = this.filter.clean(comment.commentContent.valueOf());
            // const result : Comment = await this.databaseController.updateComment(this.coveyTownID, commentID, comment);
            
            return await this.databaseController.updateComment(this.coveyTownID, commentID, comment);
        }

        //isn't this terrible
        throw Error('Incorrect post owner');
    }

    /**
     * Gets the file attached to a post
     * @param postID The id of the post we want the file from
     * @returns The result of getting the file from our database
     */
    async getFile(postID : string) : Promise<any> {
        //const result : any = await this.databaseController.getFile(postID)
        return await this.databaseController.getFile(postID);
    }

    /**
     * Deletes a file attached to a post
     * @param postID The id of the post we want to delete the file from
     * @param token The playertoken of the player who wants to delete their file
     * @returns The result of deleting the file from our database
     */
    async deleteFile(postID : string, token: string) : Promise<any> {
        const post : Post = await this.databaseController.getPost(this.coveyTownID, postID);
        const playerID: string = this.getSessionByToken(token)!.player.userName;

        if (post.ownerID === playerID && post.fileID) {
            //const result : any = await this.databaseController.deleteFile(post.fileID);
            return await this.databaseController.deleteFile(post.fileID);
        }

        throw Error('Incorrect post owner/No file found');
    }
}