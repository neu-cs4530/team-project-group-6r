import CoveyTownController from '../CoveyTownController';
import { Post } from "../../types/PostTown/post";
import { Comment, CommentTree } from "../../types/PostTown/comment";
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

    async deletePost(postID : string, token : string) : Promise<Post> {
        const databaseController: DatabaseController = DatabaseController.getInstance();
        const post: Post = await databaseController.getPost(this.coveyTownID, postID);
        
        const playerID: string = this.getSessionByToken(token)!.player.userName;
        
        if (post.ownerID === playerID) {
            const result : Post = await databaseController.deletePost(this.coveyTownID, postID);
            await databaseController.deleteCommentsUnderPost(this.coveyTownID, postID);

            if (post.fileID) {
                await databaseController.deleteFile(post.fileID);
            }

            return result;
        }

        //isn't this terrible
        throw Error('Incorrect post owner');
    }

    async updatePost(postID : string, post : Post, token : string) : Promise<Post> {
        const databaseController: DatabaseController = DatabaseController.getInstance();
        const postToUpdate: Post = await databaseController.getPost(this.coveyTownID, postID);

        const playerID: string = this.getSessionByToken(token)!.player.userName;
        
        if (postToUpdate.ownerID === playerID) {
            //censor
            post.postContent = this.filter.clean(post.postContent.valueOf());
            post.title = this.filter.clean(post.title.valueOf());
            const result : Post = await databaseController.updatePost(this.coveyTownID, postID, post);

            return result;
        }

        throw Error('Incorrect post owner');
    }

    async createComment(comment : Comment) : Promise<Comment> {
        const databaseController = DatabaseController.getInstance();

        //censor
        comment.commentContent = this.filter.clean(comment.commentContent.valueOf());
        const result : Comment = await databaseController.createComment(this.coveyTownID, comment);
        //should I type cast like this, if I decide to check for string 
        //then that means the whole thing needs to be refactored
        const createdCommentID : string = result._id!;

        if (comment.parentCommentID === '') {
            await databaseController.addCommentToRootPost(this.coveyTownID, comment.rootPostID, createdCommentID);
        } else {
            await databaseController.addCommentToParentComment(this.coveyTownID, comment.parentCommentID, createdCommentID);
        }
        
        return result;
    }

    async getComment(commentID : string) : Promise<Comment> {
        const databaseController = DatabaseController.getInstance();
        const result : Comment = await databaseController.getComment(this.coveyTownID, commentID);

        return result;
    }

    private async constructCommentTree(commentIDs : string[]) : Promise<CommentTree[]> {
        const databaseController = DatabaseController.getInstance();
        const comments: Comment[] = await databaseController.getAllComments(this.coveyTownID, commentIDs);

        const commentTree = await Promise.all(comments.map(async (comment: Comment) => {
          // const comment: Comment = await db.getComment('testID', id);
          // const ids: string[] = comment.comments!;
          
          // const comments: CommentTree[] = await constructTree(ids, db);
      
          // const tree: CommentTree = {
          //   comment: comment,
          //   comments: comments
          // }
            
          const commentIDs = comment.comments!;
          const tree: CommentTree = {
            _id: comment._id,
            rootPostID: comment.rootPostID,
            parentCommentID: comment.parentCommentID,
            ownerID: comment.ownerID,
            commentContent: comment.commentContent,
            isDeleted: comment.isDeleted,
            createdAt: comment.createdAt,
            updatedAt: comment.updatedAt
          }
          tree.comments = await this.constructCommentTree(commentIDs);
      
          return tree;
        }))
      
        return commentTree;
    }

    async getCommentTree(postID : string) : Promise<CommentTree[]> {
        const databaseController = DatabaseController.getInstance();

        const post: Post = await databaseController.getPost('testID', postID);
        const comments: string[] = post.comments!;
    
        const result = await this.constructCommentTree(comments);

        return result
    }

    async deleteComment(commentID : string, token : string) : Promise<Comment> {
        const databaseController: DatabaseController = DatabaseController.getInstance();
        const comment: Comment = await databaseController.getComment(this.coveyTownID, commentID);
        
        const playerID: string = this.getSessionByToken(token)!.player.userName;
        
        if (comment.ownerID === playerID) {
            const result : Comment = await databaseController.deleteComment(this.coveyTownID, commentID);

            return result;
        }

        //isn't this terrible
        throw Error('Incorrect post owner'); 
    }

    async updateComment(commentID : string, comment : Comment, token : string) : Promise<Comment> {
        const databaseController: DatabaseController = DatabaseController.getInstance();
        const commentToUpdate: Comment = await databaseController.getComment(this.coveyTownID, commentID);

        const playerID: string = this.getSessionByToken(token)!.player.userName;
        
        if (commentToUpdate.ownerID === playerID) {
            //censor
            comment.commentContent = this.filter.clean(comment.commentContent.valueOf());
            const result : Comment = await databaseController.updateComment(this.coveyTownID, commentID, comment);
            
            return result;
        }

        //isn't this terrible
        throw Error('Incorrect post owner');
    }

    async getFile(postID : string) : Promise<any> {
        const databaseController = DatabaseController.getInstance();
        const result : any = await databaseController.getFile(postID)

        return result;
    }

    async deleteFile(postID : string, token: string) : Promise<any> {
        const databaseController = DatabaseController.getInstance();
        const post : Post = await databaseController.getPost(this.coveyTownID, postID);
        const playerID: string = this.getSessionByToken(token)!.player.userName;

        if (post.ownerID === playerID && post.fileID) {
            const result : any = await databaseController.deleteFile(post.fileID);
            return result;
        }

        throw Error('Incorrect post owner/No file found');
    }
}