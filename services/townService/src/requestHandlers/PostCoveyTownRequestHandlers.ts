import PostCoveyTownController from '../lib/PostTown/PostCoveyTownController';
import { Post } from '../types/PostTown/post';
import { Comment, CommentTree } from '../types/PostTown/comment';
import PlayerSession from '../types/PlayerSession';
import CoveyTownsStore from '../lib/CoveyTownsStore';
import Player from '../types/Player';

/**
 * Envelope that wraps any response from the server
 */
export interface ResponseEnvelope<T> {
  isOK: boolean;
  message?: string;
  response?: T;
}

/**
 * Server response to request to create a post 
 */
export interface PostCreateRequest {
  coveyTownID : string,
  sessionToken : string,
  post : Post
}

/**
 * Server response to request to get a post
 */
export interface PostGetRequest {
  coveyTownID : string,
  sessionToken : string,
  postID : string
}

/**
 * Server response to request to get all posts in a town
 */
export interface PostGetAllInTownRequest {
  coveyTownID : string,
  sessionToken : string
}

/**
 * Server response to request to update a post
 */
export interface PostUpdateRequest {
  coveyTownID : string,
  sessionToken : string,
  postID : string,
  post : Post,
  deletePrevFile: boolean
}

/**
 * Server response to request to create a comment
 */
export interface CommentCreateRequest {
  coveyTownID: string,
  sessionToken: string,
  comment : Comment
}

/**
 * Server response to request to get a comment
 */
export interface CommentGetRequest {
  coveyTownID : string,
  sessionToken : string,
  commentID : string
}

/**
 * Server response to request to update a comment
 */
export interface CommentUpdateRequest {
  coveyTownID : string,
  sessionToken : string,
  commentID : string,
  comment : Comment
}

/**
 * Request handler to process players request to create a post
 * @param _requestData An object representing the players request
 * @returns The server's respopnse to the request to create a post
 */
export async function postCreateHandler(_requestData : PostCreateRequest): Promise<ResponseEnvelope<Post | unknown>> {
  const townsStore = CoveyTownsStore.getInstance();
  const postTownController = townsStore.getControllerForTown(_requestData.coveyTownID);

  if (!postTownController) {
    return {
      isOK: false, 
      response: {}, 
      message: 'Unable to create post',
    };
  }

  const { post } = _requestData;
  const result = await postTownController.createPost(post);
  return {
    isOK: true,
    response: result,
    message: !result ? 'Invalid password. Please double check your town update password.' : undefined,
  };
}

/**
 * Request handler to process players request to get a post
 * @param _requestData An object representing the players request
 * @returns The server's respopnse to the request to get a post
 */
export async function postGetHandler(_requestData : PostGetRequest) : Promise<ResponseEnvelope<Post | unknown>> {

  const townsStore = CoveyTownsStore.getInstance();
  const postTownController = townsStore.getControllerForTown(_requestData.coveyTownID);
  const { postID } = _requestData;

  if (!postTownController) {
    return {
      isOK: false,
      response: {},
      message: 'Unable to get post.',
    };
  }

  const result = await postTownController.getPost(postID);
  return {
    isOK: true,
    response: result,
    message: !result ? 'Invalid password. Please double check your town update password.' : undefined,
  };

}

/**
 * Request handler to process players request to get all posts in a town
 * @param _requestData An object representing the players request
 * @returns The server's respopnse to the request to get all posts
 */
export async function postGetAllIDInTownHandler(_requestData : PostGetAllInTownRequest) : Promise<ResponseEnvelope<Post[] | unknown>> {
  const townsStore = CoveyTownsStore.getInstance();
  const postTownController = townsStore.getControllerForTown(_requestData.coveyTownID);

  if (!postTownController) {
    return {
      isOK: false,
      response: {},
      message: 'Unable to get all Posts in Town.',
    };
  }
  const result : Post[] = await postTownController.getAllPostInTown();

  return {
    isOK: true,
    response: result,
    message: !result ? 'Invalid password. Please double check your town update password.' : undefined,
  };
}

/**
 * Request handler to process request to get the comment structure
 * @param _requestData An object representing the players request
 * @returns The server's respopnse to the request to get the comment structure
 */
export async function postGetCommentTreeHandler(_requestData : PostGetRequest) : Promise<ResponseEnvelope<CommentTree[] | unknown>> {
  const townsStore = CoveyTownsStore.getInstance();
  const postTownController = townsStore.getControllerForTown(_requestData.coveyTownID);

  if (!postTownController){
    return {
      isOK: false, 
      response: {}, 
      message: `Unable to delete post with post ID ${_requestData.postID} in town ${_requestData.coveyTownID}`,
    };
  }
  const result: CommentTree[] = await postTownController.getCommentTree(_requestData.postID);

  return {
    isOK: true,
    response: result,
    message: !result ? 'Unable to grab comment tree' : undefined,
  };
}

/**
 * Request handler to process players request to delete a post
 * @param _requestData An object representing the players request
 * @returns The server's respopnse to the request to delete a post
 */
export async function postDeleteHandler(_requestData : PostGetRequest) : Promise<ResponseEnvelope<Post | unknown>> {
  const townsStore = CoveyTownsStore.getInstance();
  const postTownController = townsStore.getControllerForTown(_requestData.coveyTownID);


  if (!postTownController?.getSessionByToken(_requestData.sessionToken)){
    return {
      isOK: false, 
      response: {}, 
      message: `Unable to delete post with post ID ${_requestData.postID} in town ${_requestData.coveyTownID}`,
    };
  }

  const { postID } = _requestData;
  const result = await postTownController.deletePost(postID, _requestData.sessionToken);

  return {
    isOK: true,
    response: result,
    message: !result ? 'Invalid password. Please double check your town update password.' : undefined,
  };
}

/**
 * Request handler to process players request to update a post
 * @param _requestData An object representing the players request
 * @returns The server's respopnse to the request to update a post
 */
export async function postUpdateHandler(_requestData : PostUpdateRequest) : Promise<ResponseEnvelope<Post | unknown>> {
  const { postID, post } = _requestData;
  const townsStore = CoveyTownsStore.getInstance();
  const postTownController = townsStore.getControllerForTown(_requestData.coveyTownID);

  if (!postTownController?.getSessionByToken(_requestData.sessionToken)){
    return {
      isOK: false, 
      response: {}, 
      message: `Unable to update post with post ID ${_requestData.postID} in town ${_requestData.coveyTownID}`,
    };
  }

  const result = await postTownController.updatePost(postID, post, _requestData.deletePrevFile, _requestData.sessionToken);

  return {
    isOK: true,
    response: result,
    message: !result ? 'Invalid password. Please double check your town update password.' : undefined,
  };
}

/**
 * Request handler to process players request to create a comment
 * @param _requestData An object representing the players request
 * @returns The server's respopnse to the request to create a comment
 */
export async function commentCreateHandler(_requestData : CommentCreateRequest): Promise<ResponseEnvelope<Comment | unknown>> {
  const { comment } = _requestData;
  const townsStore = CoveyTownsStore.getInstance();
  const postTownController = townsStore.getControllerForTown(_requestData.coveyTownID);

  if (!postTownController){
    return {
      isOK: false, 
      response: {}, 
      message: 'Unable to create comment',
    };
  }
  const result = await postTownController.createComment(comment);
    
  return {
    isOK: true,
    response: result,
    message: !result ? 'Invalid password. Please double check your town update password.' : undefined,
  };
}

/**
 * Request handler to process players request to get a comment
 * @param _requestData An object representing the players request
 * @returns The server's respopnse to the request to get a comment
 */
export async function commentGetHandler(_requestData : CommentGetRequest) : Promise<ResponseEnvelope<Comment | unknown>> {
    
  const { commentID } = _requestData;
  const townsStore = CoveyTownsStore.getInstance();
  const postTownController = townsStore.getControllerForTown(_requestData.coveyTownID);

  if (!postTownController){
    return {
      isOK: false, 
      response: {}, 
      message: 'Unable to get comment',
    };
  }
  const result = await postTownController.getComment(commentID);

  return {
    isOK: true,
    response: result,
    message: !result ? 'Invalid password. Please double check your town update password.' : undefined,
  };
}

/**
 * Request handler to process players request to delete a comment
 * @param _requestData An object representing the players request
 * @returns The server's respopnse to the request to delete a comment
 */
export async function commentDeleteHandler(_requestData : CommentGetRequest) : Promise<ResponseEnvelope<Comment | unknown>> {
  const { commentID } = _requestData;
  const townsStore = CoveyTownsStore.getInstance();
  const postTownController = townsStore.getControllerForTown(_requestData.coveyTownID);

  if (!postTownController?.getSessionByToken(_requestData.sessionToken)){
    return {
      isOK: false, 
      response: {}, 
      message: `Unable to delete comment with comment ID ${_requestData.commentID} in town ${_requestData.coveyTownID}`,
    };
  }
  const result = await postTownController.deleteComment(commentID, _requestData.sessionToken);

  return {
    isOK: true,
    response: result,
    message: !result ? 'Invalid password. Please double check your town update password.' : undefined,
  };
}

/**
 * Request handler to process players request to update a comment
 * @param _requestData An object representing the players request
 * @returns The server's respopnse to the request to update a comment
 */
export async function commentUpdateHandler(_requestData : CommentUpdateRequest) : Promise<ResponseEnvelope<Comment | unknown>> {
  const { commentID } = _requestData;
  const { comment } = _requestData;
  const townsStore = CoveyTownsStore.getInstance();
  const postTownController = townsStore.getControllerForTown(_requestData.coveyTownID);

  if (!postTownController?.getSessionByToken(_requestData.sessionToken)){
    return {
      isOK: false, 
      response: {}, 
      message: `Unable to update comment with comment ID ${_requestData.commentID} in town ${_requestData.coveyTownID}`,
    };
  }

  const result = await postTownController.updateComment(commentID, comment, _requestData.sessionToken);

  return {
    isOK: true,
    response: result,
    message: !result ? 'Invalid password. Please double check your town update password.' : undefined,
  };
}

/**
 * Request handler to process players request to get a file
 * @param _requestData An object representing the players request
 * @returns The server's respopnse to the request to get a file
 */
export async function fileGetHandler(_requestData : PostGetRequest) : Promise<ResponseEnvelope<any>> {
  const { postID } = _requestData;
  const townsStore = CoveyTownsStore.getInstance();
  const postTownController = townsStore.getControllerForTown(_requestData.coveyTownID);

  if (!postTownController){
    return {
      isOK: false, 
      response: {}, 
      message: 'Unable to get file',
    };
  }
  const result = await postTownController.getFile(postID);

  return {
    isOK: true,
    response: result,
    message: !result ? 'Invalid password. Please double check your town update password.' : undefined,
  };
}

/**
 * Request handler to process players request to delete a file
 * @param _requestData An object representing the players request
 * @returns The server's respopnse to the request to delete a file
 */
export async function fileDeleteHandler(_requestData : PostGetRequest) : Promise<ResponseEnvelope<any>> {
  const { postID } = _requestData;
  const townsStore = CoveyTownsStore.getInstance();
  const postTownController = townsStore.getControllerForTown(_requestData.coveyTownID);

  if (!postTownController?.getSessionByToken(_requestData.sessionToken)){
    return {
      isOK: false, 
      response: {}, 
      message: `Unable to delete file with filename ${_requestData.postID} in town ${_requestData.coveyTownID}`,
    };
  }

  const result = await postTownController.deleteFile(postID);

  return {
    isOK: true,
    response: result,
    message: !result ? 'Invalid password. Please double check your town update password.' : undefined,
  };
}