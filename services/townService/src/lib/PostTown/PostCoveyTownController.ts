import Filter from 'bad-words';
import { Post } from '../../types/PostTown/post';
import { Comment, CommentTree } from '../../types/PostTown/comment';
import * as databaseController from './DatabaseController';
import CoveyTownController from '../CoveyTownController';

export default class PostCoveyTownController extends CoveyTownController{

  private filter : Filter;

  /** The owner (creator) of this town * */
  private readonly _ownerID: string;

  /**  List of moderators that have the same privelage as the owner * */
  private readonly _moderators: string[];

  constructor(friendlyName: string, isPubliclyListed: boolean, ownerID: string) {
    super(friendlyName, isPubliclyListed);
    this._ownerID = ownerID;
    this._moderators = [];
    this.filter = new Filter();
  }

  // Add
  async createPost(post : Post) : Promise<Post> {
    // Area collision?
    // Create the post
    // Invoke the listener

    if (post.title) {
      // censor
      if(post.postContent) {
        post.postContent = this.filter.clean(post.postContent.valueOf());
      }
      post.title = this.filter.clean(post.title.valueOf());
      const result: Post = await databaseController.createPost(this.coveyTownID, post);
      this._listeners.forEach(listener => listener.onPostCreate(result));
      return result;
    }
  
    throw Error('Post must have a title!');
  }

  async getPost(postID : string) : Promise<Post> {
    const result : Post = await databaseController.getPost(this.coveyTownID, postID);

    return result;
  }

  async getAllPostInTown() : Promise<Post[]> {
    const result : Post[] = await databaseController.getAllPostInTown(this.coveyTownID);

    return result;
  }

  async deletePost(postID : string, token : string) : Promise<Post> {
    const post: Post = await databaseController.getPost(this.coveyTownID, postID);
    const playerID: string  = this.getSessionByToken(token)!.player.userName;
           
    if (post.ownerID === playerID) {
      const result : Post = await databaseController.deletePost(this.coveyTownID, postID);
      this._listeners.forEach(listener => listener.onPostDelete(result));
      await databaseController.deleteCommentsUnderPost(this.coveyTownID, postID);

      if (post.filename) {
        await databaseController.deleteFile(post.filename);
      }

      return result;
    }

    // isn't this terrible
    throw Error('Incorrect post owner/Town doesn\'t exist');
  }

  async updatePost(postID : string, post: any, token : string) : Promise<Post> {
    const postToUpdate: Post = await databaseController.getPost(this.coveyTownID, postID);
    const playerID: string  = this.getSessionByToken(token)!.player.userName;
            
    if (postToUpdate.ownerID === playerID) {
      // censor
      if(post.postContent) { 
        post.postContent = this.filter.clean(post.postContent.valueOf());
      }
      const result : Post = await databaseController.updatePost(this.coveyTownID, postID, post);
      this._listeners.forEach(listener => listener.onPostUpdate(result));

      //delete file if old post had a file that is being replaced
      const oldFileName = postToUpdate.filename;
      const newFileName = post.filename;
      if(oldFileName !== newFileName && oldFileName) {
        await databaseController.deleteFile(oldFileName);
      }

      return result;
    }

    throw Error('Incorrect post owner/ Town doesn\'t exist');
  }

  async createComment(comment : Comment) : Promise<Comment> {
    // censor
    comment.commentContent = this.filter.clean(comment.commentContent.valueOf());
    const result : Comment = await databaseController.createComment(this.coveyTownID, comment);
    // should I type cast like this, if I decide to check for string 
    // then that means the whole thing needs to be refactored
    const createdCommentID : string = result._id!;

    if (comment.parentCommentID === '') {
      await databaseController.addCommentToRootPost(this.coveyTownID, comment.rootPostID, createdCommentID);
    } else {
      await databaseController.addCommentToParentComment(this.coveyTownID, comment.parentCommentID, createdCommentID);
    }
        
    return result;
  }

  async getComment(commentID : string) : Promise<Comment> {
    const result : Comment = await databaseController.getComment(this.coveyTownID, commentID);

    return result;
  }

  private async constructCommentTree(commentIDs : string[]) : Promise<CommentTree[]> {
    const comments: Comment[] = await databaseController.getAllComments(this.coveyTownID, commentIDs);

    const commentTree = await Promise.all(comments.map(async (comment: Comment) => {
      const childCommentIDs = comment.comments!;
      const tree: CommentTree = {
        _id: comment._id,
        rootPostID: comment.rootPostID,
        parentCommentID: comment.parentCommentID,
        ownerID: comment.ownerID,
        commentContent: comment.commentContent,
        isDeleted: comment.isDeleted,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
      };
      tree.comments = await this.constructCommentTree(childCommentIDs);
      
      return tree;
    }));
      
    return commentTree;
  }

  async getCommentTree(postID : string) : Promise<CommentTree[]> {
    const post: Post = await databaseController.getPost('testID', postID);
    const comments: string[] = post.comments!;
    
    const result = await this.constructCommentTree(comments);

    return result;
  }

  async deleteComment(commentID : string, token : string) : Promise<Comment> {
    const comment: Comment = await databaseController.getComment(this.coveyTownID, commentID);
    const playerID: string  = this.getSessionByToken(token)!.player.userName;
        
    if (comment.ownerID === playerID) {
      const result : Comment = await databaseController.deleteComment(this.coveyTownID, commentID);

      return result;
    }

    // isn't this terrible
    throw Error('Incorrect post owner'); 
  }

  async updateComment(commentID : string, comment : any, token : string) : Promise<Comment> {
    const commentToUpdate: Comment = await databaseController.getComment(this.coveyTownID, commentID);
    const playerID: string  = this.getSessionByToken(token)!.player.userName;

    if (commentToUpdate.ownerID === playerID) {
    // censor
      comment.commentContent = this.filter.clean(comment.commentContent.valueOf());
      const result : Comment = await databaseController.updateComment(this.coveyTownID, commentID, comment);
            
      return result;
    }

    // isn't this terrible
    throw Error('Incorrect post owner');
  }

  async getFile(filename : string) : Promise<any> {
    return await databaseController.getFile(filename);
  }

  async deleteFile(filename : string) : Promise<any> {
    const result : any = await databaseController.deleteFile(filename);
    return result;
  }
}