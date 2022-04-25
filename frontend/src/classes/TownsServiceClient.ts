import axios, { AxiosInstance, AxiosResponse } from 'axios';
import assert from 'assert';
import { ServerPlayer } from './Player';
import { ServerConversationArea } from './ConversationArea';
import { ServerComment } from './Comment';
import {  ServerFile, ServerPost } from './Post';


/**
 * The format of a request to join a Town in Covey.Town, as dispatched by the server middleware
 */
export interface TownJoinRequest {
  /** userName of the player that would like to join * */
  userName: string;
  /** ID of the town that the player would like to join * */
  coveyTownID: string;
}

/**
 * The format of a response to join a Town in Covey.Town, as returned by the handler to the server
 * middleware
 */
export interface TownJoinResponse {
  /** Unique ID that represents this player * */
  coveyUserID: string;
  /** Secret token that this player should use to authenticate
   * in future requests to this service * */
  coveySessionToken: string;
  /** Secret token that this player should use to authenticate
   * in future requests to the video service * */
  providerVideoToken: string;
  /** List of players currently in this town * */
  currentPlayers: ServerPlayer[];
  /** Friendly name of this town * */
  friendlyName: string;
  /** Is this a private town? * */
  isPubliclyListed: boolean;
  /** Names and occupants of any existing ConversationAreas */
  conversationAreas: ServerConversationArea[];
  /** Posts currently active in this town */
  posts: ServerPost[];
}

/**
 * Payload sent by client to create a Town in Covey.Town
 */
export interface TownCreateRequest {
  friendlyName: string;
  isPubliclyListed: boolean;
}

/**
 * Response from the server for a Town create request
 */
export interface TownCreateResponse {
  coveyTownID: string;
  coveyTownPassword: string;
}

/**
 * Response from the server for a Town list request
 */
export interface TownListResponse {
  towns: CoveyTownInfo[];
}

/**
 * Payload sent by the client to delete a Town
 */
export interface TownDeleteRequest {
  coveyTownID: string;
  coveyTownPassword: string;
}

/**
 * Payload sent by the client to update a Town.
 * N.B., JavaScript is terrible, so:
 * if(!isPubliclyListed) -> evaluates to true if the value is false OR undefined, use ===
 */
export interface TownUpdateRequest {
  coveyTownID: string;
  coveyTownPassword: string;
  friendlyName?: string;
  isPubliclyListed?: boolean;
}

export interface ConversationCreateRequest {
  coveyTownID: string;
  sessionToken: string;
  conversationArea: ServerConversationArea;
}

/**
 * Envelope that wraps any response from the server
 */
export interface ResponseEnvelope<T> {
  isOK: boolean;
  message?: string;
  response?: T;
}

export type CoveyTownInfo = {
  friendlyName: string;
  coveyTownID: string;
  currentOccupancy: number;
  maximumOccupancy: number
};

/**
 * Server response to request to create a post 
 */
export interface PostCreateRequest {
  coveyTownID: string,
  sessionToken: string,
  post: ServerPost,
  file?: File
}

/**
 * Server response to request to get a post 
 */
export interface PostGetRequest {
  coveyTownID: string,
  sessionToken: string,
  postID: string
}

/**
 * Server response to request to delete a post 
 */
export interface PostDeleteRequest {
  coveyTownID: string,
  sessionToken: string,
  postID: string
}

/**
 * Server response to request to get all posts in town 
 */
export interface PostGetIdInTownRequest {
  coveyTownID: string,
  sessionToken: string
}

/**
 * Server response to request to update a post 
 */
export interface PostUpdateRequest {
  coveyTownID: string,
  sessionToken: string,
  postID: string,
  post: ServerPost,
  deletePrevFile: boolean,
  file?: File,

}

/**
 * Server response to request to create a comment 
 */
export interface CommentCreateRequest {
  coveyTownID: string,
  sessionToken: string,
  comment: ServerComment,
}

/**
 * Server response to request to get a comment 
 */
export interface CommentGetRequest {
  coveyTownID: string,
  sessionToken: string,
  commentID: string
}

/**
 * Server response to request to get all comments from a post 
 */
export interface CommentsGetByPostIdRequest {
  coveyTownID: string,
  sessionToken: string,
  postID: string
}

/**
 * Server response to request to delete a comment 
 */
export interface CommentDeleteRequest {
  coveyTownID: string,
  sessionToken: string,
  commentID: string
}

/**
 * Server response to request to update a comment 
 */
export interface CommentUpdateRequest {
  coveyTownID: string,
  sessionToken: string,
  commentID: string,
  comment: ServerComment,
}

/**
 * Server response to request to upload a file 
 */
export interface FileUploadRequest {
  file: File,
}

/**
 * Server response to request to upload a file with a certain size 
 */
export interface FileUploadResponse {
  file: ServerFile,
  size: number,
}

/**
 * Server response to request to get a file 
 */
export interface FileGetRequest {
  filename?: string,
}


export default class TownsServiceClient {
  private _axios: AxiosInstance;

  /**
   * Construct a new Towns Service API client. Specify a serviceURL for testing, or otherwise
   * defaults to the URL at the environmental variable REACT_APP_ROOMS_SERVICE_URL
   * @param serviceURL
   */
  constructor(serviceURL?: string) {
    const baseURL = serviceURL || process.env.REACT_APP_TOWNS_SERVICE_URL;
    assert(baseURL);
    this._axios = axios.create({ baseURL });
  }

  static unwrapOrThrowError<T>(response: AxiosResponse<ResponseEnvelope<T>>, ignoreResponse = false): T {
    if (response.data.isOK) {
      if (ignoreResponse) {
        return {} as T;
      }
      assert(response.data.response);
      return response.data.response;
    }
    throw new Error(`Error processing request: ${response.data.message}`);
  }

  async createTown(requestData: TownCreateRequest): Promise<TownCreateResponse> {
    const responseWrapper = await this._axios.post<ResponseEnvelope<TownCreateResponse>>('/towns', requestData);
    return TownsServiceClient.unwrapOrThrowError(responseWrapper);
  }

  async updateTown(requestData: TownUpdateRequest): Promise<void> {
    const responseWrapper = await this._axios.patch<ResponseEnvelope<void>>(`/towns/${requestData.coveyTownID}`, requestData);
    return TownsServiceClient.unwrapOrThrowError(responseWrapper, true);
  }

  async deleteTown(requestData: TownDeleteRequest): Promise<void> {
    const responseWrapper = await this._axios.delete<ResponseEnvelope<void>>(`/towns/${requestData.coveyTownID}/${requestData.coveyTownPassword}`);
    return TownsServiceClient.unwrapOrThrowError(responseWrapper, true);
  }

  async listTowns(): Promise<TownListResponse> {
    const responseWrapper = await this._axios.get<ResponseEnvelope<TownListResponse>>('/towns');
    return TownsServiceClient.unwrapOrThrowError(responseWrapper);
  }

  async joinTown(requestData: TownJoinRequest): Promise<TownJoinResponse> {
    const responseWrapper = await this._axios.post('/sessions', requestData);
    return TownsServiceClient.unwrapOrThrowError(responseWrapper);
  }

  async createConversation(requestData: ConversationCreateRequest): Promise<void> {
    const responseWrapper = await this._axios.post(`/towns/${requestData.coveyTownID}/conversationAreas`, requestData);
    return TownsServiceClient.unwrapOrThrowError(responseWrapper);
  }

  /**
   * Request handler to process players request to create a post
   * @param requestData An object representing the players request
   * @returns The server's respopnse to the request to create a post
   */
  async createPost(requestData: PostCreateRequest): Promise<ServerPost> {
    const formData = new FormData();
    if (requestData.file) formData.append('file', requestData.file);
    formData.append('post', JSON.stringify({
      sessionToken: requestData.sessionToken,
      post: requestData.post,
    }));
    const responseWrapper = await this._axios.post(`/towns/${requestData.coveyTownID}/post`, formData);
    return TownsServiceClient.unwrapOrThrowError(responseWrapper);
  }

/**
 * Request handler to process players request to get all posts
 * @param requestData An object representing the players request
 * @returns The server's respopnse to the request to get all posts
 */
  async getAllPostIds(requestData: PostGetIdInTownRequest): Promise<void> {
    const responseWrapper = await this._axios.get(`/towns/${requestData.coveyTownID}/posts`);
    return TownsServiceClient.unwrapOrThrowError(responseWrapper);
  }

/**
 * Request handler to process players request to get a post
 * @param requestData An object representing the players request
 * @returns The server's respopnse to the request to get a post
 */  
async getPostById(requestData: PostGetRequest): Promise<void> {
    const responseWrapper = await this._axios.get(`/towns/${requestData.coveyTownID}/post/${requestData.postID}`);
    return TownsServiceClient.unwrapOrThrowError(responseWrapper);
  }

/**
 * Request handler to process players request to delete a post
 * @param requestData An object representing the players request
 * @returns The server's respopnse to the request to delete a post
 */  
async deletePostById(requestData: PostDeleteRequest): Promise<void> {
    const deleteBody = {data: {sessionToken: requestData.sessionToken}}
    const responseWrapper = await this._axios.delete(`/towns/${requestData.coveyTownID}/post/${requestData.postID}`, deleteBody);
    return TownsServiceClient.unwrapOrThrowError(responseWrapper);
  }
  
  /**
 * Request handler to process players request to edit a post
 * @param requestData An object representing the players request
 * @returns The server's respopnse to the request to edit a post
 */  
async editPost(requestData: PostUpdateRequest): Promise<void> {
    // Leave the file
    // Change the file
    // Remove the file
    const formData = new FormData();
    if (requestData.file) formData.append('file', requestData.file);
    formData.append('post', JSON.stringify({
      sessionToken: requestData.sessionToken,
      post: requestData.post,
      deletePrevFile: requestData.deletePrevFile
    }));
    const responseWrapper = await this._axios.patch(`/towns/${requestData.coveyTownID}/post/${requestData.postID}`, formData);
    return TownsServiceClient.unwrapOrThrowError(responseWrapper);
  }

/**
 * Request handler to process players request to create a comment
 * @param requestData An object representing the players request
 * @returns The server's respopnse to the request to create a comment
 */  
async createComment(requestData: CommentCreateRequest): Promise<ServerComment> {
    const responseWrapper = await this._axios.post(`/towns/${requestData.coveyTownID}/comment`, requestData);
    return TownsServiceClient.unwrapOrThrowError(responseWrapper);
  }

/**
 * Request handler to process players request to get a comment
 * @param requestData An object representing the players request
 * @returns The server's respopnse to the request to get a comment
 */    
async getCommentById(requestData: CommentGetRequest): Promise<void> {
    const responseWrapper = await this._axios.get(`/towns/${requestData.coveyTownID}/comment/${requestData.commentID}`);
    return TownsServiceClient.unwrapOrThrowError(responseWrapper);
  }

/**
 * Request handler to process players request to delete a comment
 * @param requestData An object representing the players request
 * @returns The server's respopnse to the request to delete a comment
 */  
  async deleteCommentById(requestData: CommentDeleteRequest): Promise<void> {
    const deleteBody = {data: {sessionToken: requestData.sessionToken}}
    const responseWrapper = await this._axios.delete(`/towns/${requestData.coveyTownID}/comment/${requestData.commentID}`, deleteBody);
    return TownsServiceClient.unwrapOrThrowError(responseWrapper);
  }

/**
 * Request handler to process players request to edit a comment
 * @param requestData An object representing the players request
 * @returns The server's respopnse to the request to edit a comment
 */  
  async editComment(requestData: CommentUpdateRequest): Promise<void> {
    const responseWrapper = await this._axios.patch(`/towns/${requestData.coveyTownID}/comment/${requestData.commentID}`, requestData);
    return TownsServiceClient.unwrapOrThrowError(responseWrapper);
  }

/**
 * Request handler to process players request to get all comments under a post
 * @param requestData An object representing the players request
 * @returns The server's respopnse to the request to get all comments under a post
 */  
  async getCommentsByPostID(requestData: CommentsGetByPostIdRequest): Promise<ServerComment[]> {
    const responseWrapper = await this._axios.get(`/towns/${requestData.coveyTownID}/post/${requestData.postID}/commentTree`);
    return TownsServiceClient.unwrapOrThrowError(responseWrapper);
  }
}
