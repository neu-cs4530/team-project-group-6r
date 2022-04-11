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

export interface CommentTree {
    comment: Comment,
    comments: CommentTree[]
};

export interface CommentTest {
    _id?: string,
    rootPostID: string,
    parentCommentID: string,
    ownerID: string,
    commentContent: string,
    isDeleted: boolean,
    comments?: CommentTest[],
    createdAt? : Date,
    updatedAt? : Date
}