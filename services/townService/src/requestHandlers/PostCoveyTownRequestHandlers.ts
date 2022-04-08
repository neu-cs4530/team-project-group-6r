import PostCoveyTownController from "../lib/PostTown/PostCoveyTownController";
import { Post } from "../types/PostTown/post";
import { Comment } from "../types/PostTown/comment";

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

export async function postGetAllInTownHandler(_requestData : PostGetIdInTownRequest) : Promise<ResponseEnvelope<string[]>> {
    const townID = _requestData.coveyTownID;
    const result : string[] = await postTownController.getAllPostInTown();

    return {
        isOK: true,
        response: result,
        message: !result ? 'Invalid password. Please double check your town update password.' : undefined,
    };
}

export async function postDeleteHandler(_requestData : PostGetRequest) : Promise<ResponseEnvelope<Post>> {
    const postID = _requestData.postID;
    const result = await postTownController.deletePost(postID);

    return {
        isOK: true,
        response: result,
        message: !result ? 'Invalid password. Please double check your town update password.' : undefined,
    };
}

export async function postUpdateHandler(_requestData : PostUpdateRequest) : Promise<ResponseEnvelope<Post>> {
    const postID = _requestData.postID;
    const post = _requestData.post;

    const result = await postTownController.updatePost(postID, post);

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
    const result = await postTownController.deleteComment(commentID);

    return {
        isOK: true,
        response: result,
        message: !result ? 'Invalid password. Please double check your town update password.' : undefined,
    };
}

export async function commentUpdateHandler(_requestData : CommentUpdateRequest) : Promise<ResponseEnvelope<Comment>> {
    const commentID = _requestData.commentID;
    const comment = _requestData.comment;

    const result = await postTownController.updateComment(commentID, comment);

    return {
        isOK: true,
        response: result,
        message: !result ? 'Invalid password. Please double check your town update password.' : undefined,
    };
}