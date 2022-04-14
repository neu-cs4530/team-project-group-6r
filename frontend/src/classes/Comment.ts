export type ServerComment = {
    commentID: string,
    rootPostID: string,
    parentCommentID: string,
    ownerID: string,
    commentContent: string,
    isDeleted: boolean,
    comments?: string[],
    createdAt? : Date,
    updatedAt? : Date,
}

export default class Comment {}