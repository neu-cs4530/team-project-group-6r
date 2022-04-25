import Filter from 'bad-words';
import { Post, PostSkin } from '../../types/PostTown/post';
import { Comment, CommentTree } from '../../types/PostTown/comment';
import * as databaseController from './DatabaseController';
import CoveyTownController from '../CoveyTownController';
import { emitCommentUpdate } from '../../requestHandlers/CoveyTownRequestHandlers';


/**
 * Controls communication between mongodb and coveytown
 */
export default class PostCoveyTownController extends CoveyTownController{

  /** the text filter used to prevent bad words from being put in a post */  
  private filter : Filter;

  /** The owner (creator) of this town * */
  private readonly _ownerID: string;

  /**  List of moderators that have the same privelage as the owner * */
  private readonly _moderators: string[];

	private _expireTimer: ReturnType<typeof setInterval>;

  /**
   * Creates an instnace of a PostController, which serves as the middleman between coveytown and
   * our database
   * @param friendlyName The name of the town we're using
   * @param isPubliclyListed Whether or not the town is public or private
   * @param ownerID The town owner's id
   */
   constructor(friendlyName: string, isPubliclyListed: boolean, ownerID: string) {
    super(friendlyName, isPubliclyListed);
    this._ownerID = ownerID;
    this._moderators = [];
    this.filter = new Filter();
		this._expireTimer = setInterval(() => this.checkExpired(), 5000);
  }

	clearInterval(): void {
		clearInterval(this._expireTimer);
	}

	private async deletePostCascade(post: Post, postID: string): Promise<Post> {
		const result : Post = await databaseController.deletePost(this.coveyTownID, postID);
    this._listeners.forEach(listener => listener.onPostDelete(result));
		await databaseController.deleteCommentsUnderPost(this.coveyTownID, postID);

		if (post.file?.filename) {
			await databaseController.deleteFile(post.file.filename);
		}

		return result;
	}
 
	private async checkExpired(): Promise<Post[]> {
		const postList: Post[] = await this.getAllPostInTown();
		//console.log(postList)
		const expiredPosts: Post[] = postList.filter(post => {
			const createdAt: Date = post.createdAt!;
			const now: Date = new Date();
			return now.getTime() > createdAt.getTime() + post.timeToLive;
		})

		//console.log(expiredPosts.length)

		expiredPosts.forEach(async post => {
			const postID: string = post._id!;
			await this.deletePostCascade(post, postID);
		})
		
		return expiredPosts;
	}

	private async didPostNotCollide(newX: number, newY: number): Promise<boolean> {
		const postsInTown: Post[] = await this.getAllPostInTown();
		const didCollide: Post | undefined = postsInTown.find(post => post.coordinates.x == newX && post.coordinates.y == newY)

		return didCollide === undefined ? true : false;
	}

  // Add
  /**
   * Creates a post in this coveytown
   * @param post The post being created by a user
   * @returns The post that was created
   */
  async createPost(post : Post) : Promise<Post> {
    // Area collision?
    // Create the post
    // Invoke the listener

		// if title is not null and there is no collision
    if (post.title && this.didPostNotCollide(post.coordinates.x, post.coordinates.y)) {
      // censor
      if(post.postContent) {
        post.postContent = this.filter.clean(post.postContent.valueOf());
      }
      post.title = this.filter.clean(post.title.valueOf());

			const minTTL: number = 60000;
			const maxTTL: number = 1800000;
			post.timeToLive = post.timeToLive < minTTL || post.timeToLive > maxTTL ? 300000 : post.timeToLive;
      const result: Post = await databaseController.createPost(this.coveyTownID, post);
      this._listeners.forEach(listener => listener.onPostCreate(result));
      return result;
    }
  
    throw Error('Post must have a title!');
  }

  /**
   * Gets a post in this coveytown
   * @param postID The id of the post we want to get
   * @returns The post in question
   */
  async getPost(postID : string) : Promise<Post> {
    const result : Post = await databaseController.getPost(this.coveyTownID, postID);

    return result;
  }

  /**
   * Gets all posts in this town
   * @returns All posts in this town
   */
  async getAllPostInTown() : Promise<Post[]> {
    const result : Post[] = await databaseController.getAllPostInTown(this.coveyTownID);

    return result;
  }

  /**
   * Deletes a post from this town
   * @param postID The id of the post we want to delete
   * @param token The player's (who is trying to delete the post) session token
   * @returns The deleted post
   */
  async deletePost(postID : string, token : string) : Promise<Post> {
    const post: Post = await databaseController.getPost(this.coveyTownID, postID);
    const playerID: string  = this.getSessionByToken(token)!.player.userName;
           
    if (post.ownerID === playerID) {
			const result = await this.deletePostCascade(post, post._id!);
      return result;
    }

    // isn't this terrible
    throw Error('Incorrect post owner/Town doesn\'t exist');
  }

  /**
   * Updates a post in this town
   * @param postID The id of the post we're updating
   * @param post The updated version of the post
   * @param token The player's (who is trying to update the post) session token
   * @returns The updated post
   */
  async updatePost(postID : string, post: any, deletePrevFile: boolean, token : string) : Promise<Post> {
    const postToUpdate: Post = await databaseController.getPost(this.coveyTownID, postID);

		// sanitize input
    delete post.comments;
		delete post.timeToLive;
		delete post.numberOfComments;
		
    const playerID: string  = this.getSessionByToken(token)!.player.userName;
            
    if (postToUpdate.ownerID === playerID) {
      // censor
      if(post.postContent) { 
        post.postContent = this.filter.clean(post.postContent.valueOf());
      }
      const result : Post = await databaseController.updatePost(this.coveyTownID, postID, post);
      this._listeners.forEach(listener => listener.onPostUpdate(result));

      //delete file if old post had a file that is being replaced
      if (deletePrevFile && postToUpdate.file?.filename) {
        await databaseController.deleteFile(postToUpdate.file.filename);
      }

      return result;
    }

    throw Error('Incorrect post owner/ Town doesn\'t exist');
  }

  /**
   * Creates a comment on a post in this town
   * @param comment The comment we're creating
   * @returns The comment created
   */
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

		// add 1 minute to time to live for the root post, max time to live is 1.5 minutes
		await databaseController.addTimeToPostTTL(this.coveyTownID, comment.rootPostID);
		const updatedPost = await databaseController.incrementNumberOfComments(this.coveyTownID, comment.rootPostID);
		this._listeners.forEach(listener => listener.onPostUpdate(updatedPost));
		
    // TODO: remove the cheese
    const comments: CommentTree[] = await this.getCommentTree(result.rootPostID);
    emitCommentUpdate(comment.rootPostID, comments);
        
    return result;
  }

  /**
   * Gets a comment from this town
   * @param commentID The id of the comment we want
   * @returns The comment in question
   */
  async getComment(commentID : string) : Promise<Comment> {
    const result : Comment = await databaseController.getComment(this.coveyTownID, commentID);

    return result;
  }

  /**
   * Creates the structure of multiple comments on a post (a chain of comments)
   * @param commentIDs The list of comments we want in this chain
   * @returns The structure of the comments, and the comments themselves
   */
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

  /**
   * Gets the structure of the comments from a certain post
   * @param postID The post we want the structure from
   * @returns The comments and their structure
   */
  async getCommentTree(postID : string) : Promise<CommentTree[]> {
    const post: Post = await databaseController.getPost(this.coveyTownID, postID);
    const comments: string[] = post.comments!;
    
    const result = await this.constructCommentTree(comments);

    return result;
  }

  /**
   * Deletes a comment from this town
   * @param commentID The id of the comment we want to delete
   * @param token The session token of the player deleting the comment
   * @returns The deleted comment
   */
  async deleteComment(commentID : string, token : string) : Promise<Comment> {
    const comment: Comment = await databaseController.getComment(this.coveyTownID, commentID);
    const playerID: string  = this.getSessionByToken(token)!.player.userName;
        
    if (comment.ownerID === playerID) {
      const result : Comment = await databaseController.deleteComment(this.coveyTownID, commentID);
      // TODO: remove the cheese
      const comments: CommentTree[] = await this.getCommentTree(result.rootPostID);
      emitCommentUpdate(comment.rootPostID, comments);
      return result;
    }

    // isn't this terrible
    throw Error('Incorrect post owner'); 
  }

  /**
   * Updates a comment in this town
   * @param commentID The id of the comment we're updating
   * @param comment The updated comment
   * @param token The session token of the player updating the comment
   * @returns The updated comment
   */
  async updateComment(commentID : string, comment : any, token : string) : Promise<Comment> {
    const commentToUpdate: Comment = await databaseController.getComment(this.coveyTownID, commentID);
    const playerID: string  = this.getSessionByToken(token)!.player.userName;

    if (commentToUpdate.ownerID === playerID) {
    // censor
      comment.commentContent = this.filter.clean(comment.commentContent.valueOf());
      const result : Comment = await databaseController.updateComment(this.coveyTownID, commentID, comment);
      // TODO: remove the cheese
      const comments: CommentTree[] = await this.getCommentTree(result.rootPostID);
      emitCommentUpdate(comment.rootPostID, comments);
      return result;
    }

    // isn't this terrible
    throw Error('Incorrect post owner');
  }

  /**
   * Gets a file from this town
   * @param filename The name of the file we want
   * @returns The file in question
   */
  async getFile(filename : string) : Promise<any> {
    return await databaseController.getFile(filename);
  }

  /**
   * Deletes a file from this town
   * @param filename The name of the file we want to delete
   * @returns The deleted file
   */
  async deleteFile(filename : string) : Promise<any> {
    const result : any = await databaseController.deleteFile(filename);
    return result;
  }
}