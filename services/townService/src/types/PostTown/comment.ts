/**
 * A Comment is a feature, based off a post, the allows a user to comment on the content of a root post
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
};