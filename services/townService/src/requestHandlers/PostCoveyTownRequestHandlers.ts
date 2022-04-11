import PostCoveyTownController from "../lib/PostTown/PostCoveyTownController";
import { Post } from "../types/PostTown/post";
import { Comment } from "../types/PostTown/comment";
import PlayerSession from "../types/PlayerSession";
import CoveyTownsStore from "../lib/CoveyTownsStore";
import Player from "../types/Player";

//always put your global field at the top of the class
const postTownController = new PostCoveyTownController("testTown", true);
postTownController.addPlayer(new Player('test'));

/**
 * Envelope that wraps any response from the server
 */
export interface ResponseEnvelope<T> {
    isOK: boolean;
    message?: string;
    response?: T;
}

/**
 * Structure to create a post in the server
 */
export interface PostCreateRequest {
    coveyTownID : string,
    sessionToken : string,
    post : Post
}

/**
 * Structure to get a post from the server
 */
export interface PostGetRequest {
    coveyTownID : string,
    sessionToken : string,
    postID : string
}

/**
 * Structure to get a post's id from the server
 */
export interface PostGetIdInTownRequest {
    coveyTownID : string,
    sessionToken : string
}

/**
 * Structure to update a post in the server
 */
export interface PostUpdateRequest {
    coveyTownID : string,
    sessionToken : string,
    postID : string,
    post : Post
}

/**
 * Structure to create a comment in the server
 */
export interface CommentCreateRequest {
    coveyTownID: string,
    sessionToken: string,
    comment : Comment
}

/**
 * Structure to get a comment from the server
 */
export interface CommentGetRequest {
    coveyTownID : string,
    sessionToken : string,
    commentID : string
}

/**
 * Structure to update a comment in the server
 */
export interface CommentUpdateRequest {
    coveyTownID : string,
    sessionToken : string,
    commentID : string,
    comment : Comment
}

/**
 * Returns the default response to the town password being entered
 * @param result What covey returns if the password is correct or incorrect
 * @returns The response to the user if the password is correct or incorrect
 */
function postHandlerPWResponse(result:any):ResponseEnvelope<any> {
    return {
        isOK: true,
        response: result,
        message: !result ? 'Invalid password. Please double check your town update password.' : undefined,
    };
}


/**
 * Creates a response handler for when a post is created
 * @param _requestData The towns data
 * @returns The result of the handler
 */
export async function postCreateHandler(_requestData : PostCreateRequest): Promise<ResponseEnvelope<Post>> {
    // const townsStore = PostCoveyTownStore.getInstance();
    // const townController = townsStore.getControllerForTown(_requestData.coveyTownID);

    // if (!townController) {
    //     return {
    //         isOK: false,
    //         response: undefined,
    //         message: 'Unable to create post' 
    //     }
    // }

    const post = _requestData.post;
    const result = await postTownController.createPost(post);
    return postHandlerPWResponse(result);
}

/**
 * Creates a response handler for when a post needs to be pulled
 * @param _requestData The towns data
 * @returns The result of the handler
 */
export async function postGetHandler(_requestData : PostGetRequest) : Promise<ResponseEnvelope<Post>> {
    
    const postID = _requestData.postID;
    const result = await postTownController.getPost(postID);

    return postHandlerPWResponse(result);
}

/**
 * Creates a response handler for when all posts are pulled
 * @param _requestData The towns data
 * @returns The result of the handler
 */
export async function postGetAllIDInTownHandler(_requestData : PostGetIdInTownRequest) : Promise<ResponseEnvelope<string[]>> {
    const result : string[] = await postTownController.getAllPostInTown();

    return postHandlerPWResponse(result);
}

/**
 * Creates a response handler for when a post is deleted
 * @param _requestData The towns data
 * @returns The result of the handler
 */
export async function postDeleteHandler(_requestData : PostGetRequest) : Promise<ResponseEnvelope<Post>> {
    if (!postTownController?.getSessionByToken(_requestData.sessionToken)){
        return {
          isOK: false, 
          response: undefined, 
          message: `Unable to delete post with post ID ${_requestData.postID} in town ${_requestData.coveyTownID}`,
        };
    }

    const postID: string = _requestData.postID;
    const result = await postTownController.deletePost(postID, _requestData.sessionToken);

    return postHandlerPWResponse(result);
}

/**
 * Creates a response handler for when a post is updated
 * @param _requestData The towns data
 * @returns The result of the handler
 */
export async function postUpdateHandler(_requestData : PostUpdateRequest) : Promise<ResponseEnvelope<Post>> {
    const postID = _requestData.postID;
    const post = _requestData.post;

    const result = await postTownController.updatePost(postID, post, _requestData.sessionToken);

    return postHandlerPWResponse(result);
}

/**
 * Creates a response handler for when a comment is created
 * @param _requestData The towns data
 * @returns The result of the handler
 */
export async function commentCreateHandler(_requestData : CommentCreateRequest): Promise<ResponseEnvelope<Comment>> {
    const comment = _requestData.comment;
    const result = await postTownController.createComment(comment);
    return postHandlerPWResponse(result);
}

/**
 * Creates a response handler for when a comment is pulled
 * @param _requestData The towns data
 * @returns The result of the handler
 */
export async function commentGetHandler(_requestData : CommentGetRequest) : Promise<ResponseEnvelope<Comment>> {
    
    const commentID = _requestData.commentID;
    const result = await postTownController.getComment(commentID);

    return postHandlerPWResponse(result);

}

/**
 * Creates a response handler for when a comment is deleted
 * @param _requestData The towns data
 * @returns The result of the handler
 */
export async function commentDeleteHandler(_requestData : CommentGetRequest) : Promise<ResponseEnvelope<Comment>> {
    const commentID = _requestData.commentID;
    const result = await postTownController.deleteComment(commentID, _requestData.sessionToken);

    return postHandlerPWResponse(result);

}

/**
 * Creates a response handler for when a comment is updated
 * @param _requestData The towns data
 * @returns The result of the handler
 */
export async function commentUpdateHandler(_requestData : CommentUpdateRequest) : Promise<ResponseEnvelope<Comment>> {
    const commentID = _requestData.commentID;
    const comment = _requestData.comment;

    const result = await postTownController.updateComment(commentID, comment, _requestData.sessionToken);

    return postHandlerPWResponse(result);

}

/**
 * Creates a response handler for when a file is pulled
 * @param _requestData The towns data
 * @returns The result of the handler
 */
export async function fileGetHandler(_requestData : PostGetRequest) : Promise<ResponseEnvelope<any>> {
    const postID = _requestData.postID;
    const result = await postTownController.getFile(postID);

    return postHandlerPWResponse(result);

}

/**
 * Creates a response handler for when a file is deleted
 * @param _requestData The towns data
 * @returns The result of the handler
 */
export async function fileDeleteHandler(_requestData : PostGetRequest) : Promise<ResponseEnvelope<any>> {
    const postID = _requestData.postID;
    const result = await postTownController.deleteFile(postID, _requestData.sessionToken);

    return postHandlerPWResponse(result);

}