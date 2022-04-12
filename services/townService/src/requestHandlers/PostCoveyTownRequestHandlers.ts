import PostCoveyTownController from "../lib/PostTown/PostCoveyTownController";
import { Post } from "../types/PostTown/post";
import { Comment, CommentTree } from "../types/PostTown/comment";
import PlayerSession from "../types/PlayerSession";
import CoveyTownsStore from "../lib/CoveyTownsStore";
import Player from "../types/Player";

/**
 * Envelope that wraps any response from the server
 */
export interface ResponseEnvelope<T> {
    isOK: boolean;
    message?: string;
    response?: T;
}

export interface PostCreateRequest {
    coveyTownID : string,
    sessionToken : string,
    post : Post
}

export interface PostGetRequest {
    coveyTownID : string,
    sessionToken : string,
    postID : string
}

export interface PostGetIdInTownRequest {
    coveyTownID : string,
    sessionToken : string
}

export interface PostUpdateRequest {
    coveyTownID : string,
    sessionToken : string,
    postID : string,
    post : Post
}

export interface CommentCreateRequest {
    coveyTownID: string,
    sessionToken: string,
    comment : Comment
}

export interface CommentGetRequest {
    coveyTownID : string,
    sessionToken : string,
    commentID : string
}

export interface CommentUpdateRequest {
    coveyTownID : string,
    sessionToken : string,
    commentID : string,
    comment : Comment
}

const postTownController = new PostCoveyTownController("testTown", true);
postTownController.addPlayer(new Player('test'));

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
    return {
        isOK: true,
        response: result,
        message: !result ? 'Invalid password. Please double check your town update password.' : undefined,
    };
}

export async function postGetHandler(_requestData : PostGetRequest) : Promise<ResponseEnvelope<Post>> {
    
    const postID = _requestData.postID;
    const result = await postTownController.getPost(postID);

    return {
        isOK: true,
        response: result,
        message: !result ? 'Invalid password. Please double check your town update password.' : undefined,
    };
}

export async function postGetAllIDInTownHandler(_requestData : PostGetIdInTownRequest) : Promise<ResponseEnvelope<string[]>> {
    const result : string[] = await postTownController.getAllPostInTown();

    return {
        isOK: true,
        response: result,
        message: !result ? 'Invalid password. Please double check your town update password.' : undefined,
    };
}

export async function postGetCommentTreeHandler(_requestData : PostGetRequest) : Promise<ResponseEnvelope<CommentTree[]>> {
    const result: CommentTree[] = await postTownController.getCommentTree(_requestData.postID);

    return {
        isOK: true,
        response: result,
        message: !result ? 'Unable to grab comment tree' : undefined,
    }
}

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

    return {
        isOK: true,
        response: result,
        message: !result ? 'Invalid password. Please double check your town update password.' : undefined,
    };
}

export async function postUpdateHandler(_requestData : PostUpdateRequest) : Promise<ResponseEnvelope<Post>> {
    const postID = _requestData.postID;
    const post = _requestData.post;

    const result = await postTownController.updatePost(postID, post, _requestData.sessionToken);

    return {
        isOK: true,
        response: result,
        message: !result ? 'Invalid password. Please double check your town update password.' : undefined,
    };
}

export async function commentCreateHandler(_requestData : CommentCreateRequest): Promise<ResponseEnvelope<Comment>> {
    const comment = _requestData.comment;
    const result = await postTownController.createComment(comment);
    return {
        isOK: true,
        response: result,
        message: !result ? 'Invalid password. Please double check your town update password.' : undefined,
    };
}

export async function commentGetHandler(_requestData : CommentGetRequest) : Promise<ResponseEnvelope<Comment>> {
    
    const commentID = _requestData.commentID;
    const result = await postTownController.getComment(commentID);

    return {
        isOK: true,
        response: result,
        message: !result ? 'Invalid password. Please double check your town update password.' : undefined,
    };
}

export async function commentDeleteHandler(_requestData : CommentGetRequest) : Promise<ResponseEnvelope<Comment>> {
    const commentID = _requestData.commentID;
    const result = await postTownController.deleteComment(commentID, _requestData.sessionToken);

    return {
        isOK: true,
        response: result,
        message: !result ? 'Invalid password. Please double check your town update password.' : undefined,
    };
}

export async function commentUpdateHandler(_requestData : CommentUpdateRequest) : Promise<ResponseEnvelope<Comment>> {
    const commentID = _requestData.commentID;
    const comment = _requestData.comment;

    const result = await postTownController.updateComment(commentID, comment, _requestData.sessionToken);

    return {
        isOK: true,
        response: result,
        message: !result ? 'Invalid password. Please double check your town update password.' : undefined,
    };
}

export async function fileGetHandler(_requestData : PostGetRequest) : Promise<ResponseEnvelope<any>> {
    const postID = _requestData.postID;
    const result = await postTownController.getFile(postID);

    return {
        isOK: true,
        response: result,
        message: !result ? 'Invalid password. Please double check your town update password.' : undefined,
    };
}

export async function fileDeleteHandler(_requestData : PostGetRequest) : Promise<ResponseEnvelope<any>> {
    const postID = _requestData.postID;
    const result = await postTownController.deleteFile(postID, _requestData.sessionToken);

    return {
        isOK: true,
        response: result,
        message: !result ? 'Invalid password. Please double check your town update password.' : undefined,
    };
}