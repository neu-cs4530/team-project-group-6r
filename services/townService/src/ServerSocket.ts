import { Server } from 'socket.io';
import { CommentTree } from './types/PostTown/comment';

export default class ServerSocket {
  private static _instance: ServerSocket;

  private _serverSocket: Server;

  constructor(server: Server) {
    this._serverSocket = server;
  }

  static createInstance(server: Server): void {
    if (ServerSocket._instance === undefined) {
      ServerSocket._instance = new ServerSocket(server);
    }
  }

  static getInstance(): ServerSocket {
    if (ServerSocket._instance !== undefined) {
      return this._instance;
    }
    throw (Error('Server socket error'));
  }

  get serverSocket(): Server {
    return this._serverSocket;
  }

  /**
   * Adapter designed to let server know when comments have been updated
   * @param postID The id of the post the comment is attached to
   * @param comments The comments being updated
   */
  emitCommentUpdate(postID: string, comments: CommentTree[]): void {
    this.serverSocket.to(`Post: ${postID}`).emit('commentUpdate', comments);
  }
}