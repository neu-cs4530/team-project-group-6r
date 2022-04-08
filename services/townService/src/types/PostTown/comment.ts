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