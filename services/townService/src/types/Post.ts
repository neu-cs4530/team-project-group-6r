import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    postID: String,
    townID: String,
<<<<<<< Updated upstream:services/townService/src/types/Post.ts
    isVisible: Boolean,
    postTime: Date,
    updateTime: Date,
    expirationTime: Date,
    coordinates: {
        x: Number,
        y: Number 
    },
    comments: [String] //this should be IDs
=======
 //this should be IDs
>>>>>>> Stashed changes:services/townService/src/types/MongoPost.ts
});

// const PostSchema = new mongoose.Schema({
//     postID: String,
//     title: String,
//     postContent: String,
//     ownerID: String,
//     townID: String,
//     isVisible: Boolean,
//     postTime: Date,
//     updateTime: Date,
//     expirationTime: Date,
//     coordinates: {
//         x: Number,
//         y: Number 
//     },
//     comments: [String], //this should be IDs
// });

const Post = mongoose.model("Post", PostSchema);

export {Post, PostSchema };