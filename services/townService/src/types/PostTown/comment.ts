export type Comment = {
    _id?: String,
    rootPostID: String,
    parentCommentID: String,
    ownerID: String,
    commentContent: String,
    isDeleted: Boolean,
    comments: [String]
};