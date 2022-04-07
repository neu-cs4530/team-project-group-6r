import PostCoveyTownController from "../lib/PostTown/PostCoveyTownController";
import {Post} from "../types/PostTown/post";

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

export interface PostCreateResponse {
    postID: Post;
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

export async function postGetIdInTownHandler(_requestData : PostGetIdInTownRequest) : Promise<ResponseEnvelope<string[]>> {
    const townID = _requestData.coveyTownID;
    const result : string[] = await postTownController.getPostIdInTown();

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