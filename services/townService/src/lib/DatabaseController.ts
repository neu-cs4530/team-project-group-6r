import mongoose, {mongo} from 'mongoose';
import {Collection, MongoClient, ObjectID} from 'mongodb';
import dotenv from 'dotenv';
import {server} from '../server';
import TownPost from "../types/TownPost";
import {PostSchema} from "../types/MongoPost";
import PlayerSession from '../types/PlayerSession';
import {User, UserSchema} from '../types/MongoUser';
import assert from 'assert';

dotenv.config();

export default class DatabaseController {
    private client: MongoClient;


    constructor() {
    //   assert(process.env.MONGO_URL, 'Must have Mongo URL to connect to database');
    assert('mongodb+srv://Ezra:User1@coveytown.kt2xq.mongodb.net/CoveyTown?retryWrites=true&w=majority', 'Must have Mongo URL to connect to database');

      this.client = new MongoClient('mongodb+srv://Ezra:User1@coveytown.kt2xq.mongodb.net/CoveyTown?retryWrites=true&w=majority',);
    }

      /**
   * Opens the connection to the database
   */
  async connect(): Promise<void> {
    await this.client.connect();
  }

  /**
   * Closes the connection to the database
   */
  close(): void {
    this.client.close();
  }


    // // client: MongoClient;
    // // uri = 'mongodb+srv://Ezra:User1@coveytown.kt2xq.mongodb.net/CoveyTown?retryWrites=true&w=majority';
    // connection;

    // constructor() {
    //     // assert(this.uri, 'Must have Mongo URL to connect to database');
    //     // this.client = new MongoClient(this.uri,);
    //     // connect: (DB_URL: string) => {
    //     //     mongoose.connect(DB_URL);
        
        
    //     //     mongoose.connection.on('error', () => {
    //     //       process.exit();
    //     //     });
    //     //   }
    //     const uri = 'mongodb+srv://Ezra:User1@coveytown.kt2xq.mongodb.net/CoveyTown?retryWrites=true&w=majority';
    //     mongoose.connect(uri).then(() => { console.log('MongoDB Connected') }).catch(err => console.log(err));
    //     this.connection = mongoose.connection;

    //     try {
    //         this.connection.on('error', console.error.bind(console, 'MongoDB error'))
    //     } catch (err) {
    //         if (err instanceof Error) {
    //             console.log(err.message);
    //         }
    //     }
    // }


    async addPost(townPost: TownPost): Promise<string> {
        const townID = townPost.townID;
        try {
            const postModel = mongoose.model(townID, PostSchema);
            const post = new postModel(townPost);
            post.save();
            return 'addPost';
        } catch (err) {
            if (err instanceof Error) {
                return err.message;
            } else {
                return 'Unexpected error for addPost';
            }
        }
    }

    async getPost(townPost: TownPost): Promise<string[]> {
        const townID: string = townPost.townID;
        const postID: string = townPost.postID;

        try {
            const model = mongoose.model(townID, PostSchema);
            let posts = await model.find({ postID: postID }, 'postID - _id').exec();
            posts = posts.map(post => { return post.postID });
            return posts;
        } catch (err) {
            if (err instanceof Error) {
                console.log(err.message);
                return [err.message];
            } else {
                console.log('Unexpected error');
                return ['Unexpected error for getPost'];
            }
        }
    }

    async getAllPostIDs(townPost: TownPost): Promise<string[]> {
        const townID: string = townPost.townID;
        try {
            const model = mongoose.model(townID, PostSchema);
            let posts = await model.find({}, 'postID - _id').exec();
            posts = posts.map(post => { return post.postID });
            return posts;
        } catch (err) {
            if (err instanceof Error) {
                console.log(err.message);
                return [err.message];
            } else {
                console.log('Unexpected error');
                return ['Unexpected error for getAllPostIDs'];
            }
        }
    }



    // async addComment(post: Post, comment: Comment): Promise<string> {

    // }
}