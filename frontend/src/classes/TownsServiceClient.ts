import axios, { AxiosInstance, AxiosResponse } from 'axios';
import assert from 'assert';
import { ServerPlayer } from './Player';
import { ServerConversationArea } from './ConversationArea';
import { Coordinate } from './Post';

export type ServerPost = {
  _id?: string,
  title: string,
  postContent: string,
  ownerID: string,
  fileID?: string,
  isVisible: boolean,
  comments?: string[],
  coordinates: Coordinate,
  createdAt?: Date,
  updatedAt?: Date
}

export type ServerComment = {
  _id?: string,
  rootPostID: string,
  parentCommentID: string,
  ownerID: string,
  commentContent: string,
  isDeleted: boolean,
  comments?: ServerComment[],
  createdAt? : Date,
  updatedAt? : Date
}


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

export interface PostCreateRequest {
  coveyTownID: string,
  sessionToken: string,
  post: ServerPost,
}

export interface PostGetRequest {
  coveyTownID: string,
  sessionToken: string,
  postID: string
}

export interface PostDeleteRequest {
  coveyTownID: string,
  sessionToken: string,
  postID: string
}

export interface PostGetIdInTownRequest {
  coveyTownID: string,
  sessionToken: string
}

export interface PostUpdateRequest {
  coveyTownID: string,
  sessionToken: string,
  postID: string,
  post: ServerPost,
}

export interface CommentCreateRequest {
  coveyTownID: string,
  sessionToken: string,
  comment: ServerComment,
}

export interface CommentGetRequest {
  coveyTownID: string,
  sessionToken: string,
  commentID: string
}

export interface CommentsGetByPostIdRequest {
  coveyTownID: string,
  sessionToken: string,
  postID: string
}

export interface CommentDeleteRequest {
  coveyTownID: string,
  sessionToken: string,
  commentID: string
}

export interface CommentUpdateRequest {
  coveyTownID: string,
  sessionToken: string,
  commentID: string,
  comment: ServerComment,
}

export interface FileUploadRequest {
  file: File,
}

export interface FileUploadResponse {
  fileName: string,
  size: number,
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

  // TODO: Session Token
  async createPost(requestData: PostCreateRequest): Promise<ServerPost> {
    const responseWrapper = await this._axios.post(`/towns/${requestData.coveyTownID}/post`, requestData);
    return TownsServiceClient.unwrapOrThrowError(responseWrapper);
  }

  // TODO: Session Token
  async getAllPostIds(requestData: PostGetIdInTownRequest): Promise<void> {
    const responseWrapper = await this._axios.get(`/towns/${requestData.coveyTownID}/posts`);
    return TownsServiceClient.unwrapOrThrowError(responseWrapper);
  }

  // TODO: Session Token
  async getPostById(requestData: PostGetRequest): Promise<void> {
    const responseWrapper = await this._axios.get(`/towns/${requestData.coveyTownID}/post/${requestData.postID}`);
    return TownsServiceClient.unwrapOrThrowError(responseWrapper);
  }

  // TODO: Session Token
  async deletePostById(requestData: PostDeleteRequest): Promise<void> {
    const deleteBody = {data: {sessionToken: requestData.sessionToken}}
    const responseWrapper = await this._axios.delete(`/towns/${requestData.coveyTownID}/post/${requestData.postID}`, deleteBody);
    return TownsServiceClient.unwrapOrThrowError(responseWrapper);
  }

  // TODO: Session Token
  async editPost(requestData: PostUpdateRequest): Promise<void> {
    const responseWrapper = await this._axios.patch(`/towns/${requestData.coveyTownID}/post/${requestData.postID}`, requestData);
    return TownsServiceClient.unwrapOrThrowError(responseWrapper);
  }

  // TODO: Session Token
  async createComment(requestData: CommentCreateRequest): Promise<ServerComment> {
    const responseWrapper = await this._axios.post(`/towns/${requestData.coveyTownID}/comment`, requestData);
    return TownsServiceClient.unwrapOrThrowError(responseWrapper);
  }

  // TODO: Session Token
  async getCommentById(requestData: CommentGetRequest): Promise<void> {
    const responseWrapper = await this._axios.get(`/towns/${requestData.coveyTownID}/comment/${requestData.commentID}`);
    return TownsServiceClient.unwrapOrThrowError(responseWrapper);
  }

  // TODO: Session Token
  async deleteCommentById(requestData: CommentDeleteRequest): Promise<void> {
    const deleteBody = {data: {sessionToken: requestData.sessionToken}}
    const responseWrapper = await this._axios.delete(`/towns/${requestData.coveyTownID}/comment/${requestData.commentID}`, deleteBody);
    return TownsServiceClient.unwrapOrThrowError(responseWrapper);
  }

  // TODO: Session Token
  async editComment(requestData: CommentUpdateRequest): Promise<void> {
    const responseWrapper = await this._axios.patch(`/towns/${requestData.coveyTownID}/comment/${requestData.commentID}`, requestData);
    return TownsServiceClient.unwrapOrThrowError(responseWrapper);
  }

  // TODO: Session Token
  async getCommentsByPostID(requestData: CommentsGetByPostIdRequest): Promise<ServerComment[]> {
    const responseWrapper = await this._axios.get(`/towns/${requestData.coveyTownID}/post/${requestData.postID}/commentTree`);
    return TownsServiceClient.unwrapOrThrowError(responseWrapper);
  }

  // TODO: Session Token
  async createFile(requestData: FileUploadRequest): Promise<FileUploadResponse> {
    const formData = new FormData();
    formData.append('file', requestData.file);
    const responseWrapper = await this._axios.post(`/upload`, formData);
    return TownsServiceClient.unwrapOrThrowError(responseWrapper);
  }

}
