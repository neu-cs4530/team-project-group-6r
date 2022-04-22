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