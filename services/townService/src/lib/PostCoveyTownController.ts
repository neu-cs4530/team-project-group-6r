import PlayerSession from '../types/PlayerSession';
import Player from '../types/Player';
import CoveyTownController from './CoveyTownController';
import PostController from './PostController';
import Post from '../types/Post';
import Comment from '../types/Comment';

export default class PostCoveyTownController extends CoveyTownController {
    // Owner
    private _owner: string;
    // Administrators
    private _administrators: string[];
    // Post Controller
    private _postController: PostController;
    // TODO: set up a setinterval that deletes the expired posts

    // Add
    async addPost(session: PlayerSession, post: Post): Promise<boolean> {
        // Area collision?
        // Create the post
        // Invoke the listener
    }

    async addComment(session: PlayerSession, post: Post, comment: Comment): Promise<boolean> {
        // Create the comment
        // Link to the post
        // Invoke the listener
    }

    // Remove
    async removePost(session: PlayerSession, post: Post): Promise<boolean> {
        // Check Access Control
        // Remove the post
        // Invoke the listener
    }

    async removeComment(session: PlayerSession, post: Post): Promise<boolean>  {
        // Check Access Control
        // Remove the comment
        // Invoke the listener
    }

    // Edit
    async editPost(session: PlayerSession, post: Post): Promise<boolean> {
        // Check access control
        // Edit the post
        // Invoke the listener
    }

    async editComment(session: PlayerSession, comment: Comment): Promise<boolean> {
        // Check access control
        // Edit the comment
        // Invoke the listener
    }

    // Get
    async getPost(): Promise<String[]> {
        // Find all post ids
        // Return all post ids
    }

    async getPostContent(postId: String): Promise<Post> {
        // Get all content for a post
        // Return post content
    }


    addAdministrator(session: PlayerSession, player: Player): boolean {
        // Access control
        // Add adminstrator
        // Invoke
    }

    static postsOverlap(): boolean {

    }

    
}