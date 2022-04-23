/**
 * A comment is a response to a post; this is how the server stores it
 */
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
 * The UI representation of a comment on a post
 */
type Comment = {
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

export default Comment;