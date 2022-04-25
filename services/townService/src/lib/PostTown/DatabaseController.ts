import mongoose from 'mongoose';
import { Post } from '../../types/PostTown/post';
import { Comment } from '../../types/PostTown/comment';
import PostSchema from '../../schemas/MongoPost';
import CommentSchema from '../../schemas/MongoComment';
import FileConnection from '../../connection';

/**
 * Creates a post in the mongo database
 * @param coveyTownID The id of the town we're making a post in
 * @param post The post we're adding to the town
 * @returns The post that was just created
 */
export async function createPost(coveyTownID: string, post : Post) : Promise<Post> {
  const Model = mongoose.model('post', PostSchema, coveyTownID);
  const insertPost = new Model(post);

  return insertPost.save();
}

/**
 * Gets a post from the mongo db
 * @param coveyTownID The id of the town we're getting a post from
 * @param postID The id of the post we want
 * @returns The post from the db
 */
export async function getPost(coveyTownID : string, postID : string) : Promise<any> {
  const model = mongoose.model('post', PostSchema, coveyTownID);
  return model.findById(postID);
}

/**
 * Gets all posts from a town's cluster in the mongo db
 * @param coveyTownID The id of the town we're getting posts from
 * @returns All posts in that town
 */
export async function getAllPostInTown(coveyTownID : string) : Promise<Post[]> {
  const model = mongoose.model('post', PostSchema, coveyTownID);
  return model.find({ timeToLive: { $exists: true } });
}

/**
 * Deletes a post from the mongo db
 * @param coveyTownID The id of the town we're deleting a post from
 * @param postID The id of the post we're deleting
 * @returns The post that was just deleted
 */
export async function deletePost(coveyTownID : string, postID : string) : Promise<any> {
  const model = mongoose.model('post', PostSchema, coveyTownID);
  return model.findByIdAndDelete(postID);
}

/**
 * Updates a post in the mongo db
 * @param coveyTownID The id of the town we're updating a post in
 * @param postID The id of the post we're updating
 * @param post The updated version of the post
 * @returns The updated post
 */
export async function updatePost(coveyTownID : string, postID : string, post : any) : Promise<any> {
  const model = mongoose.model('post', PostSchema, coveyTownID);
  return model.findByIdAndUpdate(postID, { $set: post }, { new : true });
}

/**
 * Connects a comment to a post in the mongodb
 * @param coveyTownID The id of the town we're adding a comment in
 * @param rootPostID The id of the post we're adding a comment to
 * @param createdCommentID The id of the comment we're linking to the post
 * @returns The post that had a comment added to it
 */
export async function addCommentToRootPost(coveyTownID : string, rootPostID : string, createdCommentID : string) {
  const model = mongoose.model('post', PostSchema, coveyTownID);
  return model.findByIdAndUpdate(rootPostID, { $push: { comments: createdCommentID } }, { new : true } );
}

/**
 * Creates a comment in mongodb
 * @param coveyTownID The id of the town we're adding a comment to
 * @param comment The comment we want to create
 * @returns The comment that was just created
 */
export async function createComment(coveyTownID : string, comment : Comment) : Promise<Comment> {
  const Model = mongoose.model('comment', CommentSchema, coveyTownID);
  const insertComment = new Model(comment);

  return insertComment.save();
}

/**
 * Adds an expiration time to a post
 * @param coveyTownID The id of the town we have the post in
 * @param rootPostID The id of the post in question
 * @returns The updated post
 */
export async function addTimeToPostTTL(coveyTownID : string, rootPostID : string) {
	const model = mongoose.model('post', PostSchema, coveyTownID);
  return model.findOneAndUpdate({ _id: rootPostID, numberOfComments: { $lt: 2 } }, { $inc: { timeToLive: 30000 } }, { new : true });
}

/**
 * Increases the system value for number of comments on a post
 * @param coveyTownID The id of the town we're in
 * @param rootPostID The id of the post in question
 * @returns The updated post
 */
export async function incrementNumberOfComments(coveyTownID : string, rootPostID : string) {
	const model = mongoose.model('post', PostSchema, coveyTownID);
  return model.findByIdAndUpdate(rootPostID, { $inc: { numberOfComments: 1 } }, { new : true });
}

/**
 * Gets a comment from mongodb
 * @param coveyTownID The id of the town we want to get a comment from
 * @param commentID The id of the comment we want
 * @returns The comment we want to get
 */
export async function getComment(coveyTownID : string, commentID : string) : Promise<any> {
  const model = mongoose.model('comment', CommentSchema, coveyTownID);
  return model.findById(commentID);
}

/**
 * Gets all comments by town cluster from mongodb
 * @param coveyTownID The id of the town we want to get all comments from
 * @param commentIDs The ids of the comments we want
 * @returns All comments from a certain town
 */
export async function getAllComments(coveyTownID : string, commentIDs : string[]) : Promise<Comment[]> {
  const model = mongoose.model('comment', CommentSchema, coveyTownID);
  return model.find({ _id: { $in: commentIDs } });
}

/**
 * Deletes a comment from the mongo db
 * @param coveyTownID The id of the town we're deleting a comment from
 * @param commentID The id of the comment we're deleting
 * @returns The comment that was just deleted
 */
export async function deleteComment(coveyTownID : string, commentID : string) : Promise<any> {
  const model = mongoose.model('comment', CommentSchema, coveyTownID);
  return model.findByIdAndUpdate(commentID, { $set: { isDeleted: true, commentContent: '[removed]', ownerID: '[deleted]'} }, { new: true, timestamps: false });
}

/**
 * Deletes all the comments linked to a post in mongodb
 * @param coveyTownID The id of the town with the post in question
 * @param postID The id of the post we want to delete comments from
 * @returns The post we deleted comments from
 */
export async function deleteCommentsUnderPost(coveyTownID : string, postID : string) : Promise<any> {
  const model = mongoose.model('comment', CommentSchema, coveyTownID);
  return model.deleteMany({ rootPostID: postID });
}

/**
 * Updates a comment in the mongo db
 * @param coveyTownID The id of the town we're updating a comment in
 * @param commentID The id of the comment we're updating
 * @param comment The updated version of the comment
 * @returns The updated comment
 */
export async function updateComment(coveyTownID : string, commentID : string, comment : any) : Promise<any> {
  const model = mongoose.model('comment', CommentSchema, coveyTownID);
  return model.findByIdAndUpdate(commentID, { $set: comment }, { new: true });
}

/**
 * Links a comment to another comment in mongodb (basically, makes one comment a reply to other)
 * @param coveyTownID Id of the town we're linking comments in
 * @param parentCommentID The id of the parent comment
 * @param createdCommentID The id of the reply comment
 * @returns The reply comment
 */
export async function addCommentToParentComment(coveyTownID : string, parentCommentID : string, createdCommentID : string) {
  const model = mongoose.model('comment', CommentSchema, coveyTownID);
  return model.findByIdAndUpdate(parentCommentID, { $push: { comments: createdCommentID }}, { new : true, timestamps: false}, );
}

/**
 * Gets a file from mongodb
 * @param filename The name of the file we're getting
 * @returns The file we want to get
 */
export async function getFile(filename: string) : Promise<any> {
  const { gfs } = FileConnection.getInstance();
  return gfs.files.findOne({ filename: filename });
}

/**
 * Deletes a file from mongodb
 * @param filename The name of the file we want to delete
 */
export async function deleteFile(filename: string): Promise<any> {
  const { gfs, gridfsBucket } = FileConnection.getInstance();
  gfs.files.findOne({ filename: filename }, (err: any, result: any) => {
    if(err) {
      throw Error('Can\'t find file')
    }

    if(result?._id) {
      return gridfsBucket.delete(result?._id);
    } else{
      throw Error('Can\'t find file id')
    }
  });
}

/**
 * Clears the entire mongo collection
 */
export async function clearCollections(): Promise<any> {
	try {	
		const collections = await mongoose.connection.db.listCollections().toArray();
		collections.map(collection => collection.name).forEach(async collectionName => mongoose.connection.db.dropCollection(collectionName));
	} catch (error) {
		throw(error);
	}
}