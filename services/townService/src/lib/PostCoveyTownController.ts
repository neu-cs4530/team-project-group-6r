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

    async addPost(session: PlayerSession, post: Post): Promise<boolean> {
        // Area collision?
    }

    async addComment(session: PlayerSession, post: Post, comment: Comment): Promise<boolean> {

    }

    async hidePost(session: PlayerSession, post: Post): Promise<boolean> {
        // Access Control
    }

    async hideComment(session: PlayerSession, comment: Comment): Promise<boolean> {
        // 
    }

    // Edit

    // Remove

    addAdministrator(player: Player): boolean {

    }

    static postsOverlap(): boolean {

    }


} 