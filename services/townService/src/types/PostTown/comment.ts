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

// export interface CommentTree {
//     comment: Comment,
//     comments: CommentTree[]
// };

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