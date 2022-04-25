/**
 * Comment is piece of text that can be posted by a player in response to a post, or another comment
 */
export interface Comment {
  _id?: string,
  rootPostID: string,
  parentCommentID: string,
  ownerID: string,
  commentContent: string,
  isDeleted: boolean,
  comments?: string[],
  createdAt? : Date,
  updatedAt? : Date
}

/**
 * A CommentTree is a list of comments, with structure corresponding to root comments and replies
 */
export interface CommentTree {
  _id?: string,
  rootPostID: string,
  parentCommentID: string,
  ownerID: string,
  commentContent: string,
  isDeleted: boolean,
  comments?: CommentTree[],
  createdAt? : Date,
  updatedAt? : Date
}