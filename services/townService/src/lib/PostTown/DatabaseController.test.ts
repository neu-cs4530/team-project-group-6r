import * as db from './DatabaseController';
import { Post } from "../../types/PostTown/post";
import { Comment } from "../../types/PostTown/comment";
import multer, { Multer } from 'multer';

import PostSchema from "../../schemas/MongoPost";

import http from 'http';
import TownsServiceClient from '../../client/TownsServiceClient';
import { nanoid } from 'nanoid';
import CORS from 'cors';
import Express from 'express';
import addTownRoutes from '../../router/towns';
import { AddressInfo } from 'net';
import mongoose from 'mongoose';
import CoveyTownsStore from '../CoveyTownsStore';
import { exit } from 'process';

describe('The database', () => {
    const id = 'ccc';
    const app = Express();
    app.use(CORS());
    const server = http.createServer(app);
    beforeAll(async () => {      
      const uri = 'mongodb+srv://Ezra:User1@coveytown.kt2xq.mongodb.net/CoveyTown?retryWrites=true&w=majority';
      const connectToMongo = async() => {
        await mongoose.connect(uri);
        return mongoose;};
      await connectToMongo().then(() => { console.log('MongoDB Connected') }).catch(err => console.log(err));
      const upload = multer({ dest: 'uploads/' })

      addTownRoutes(server, app, upload);
      
      server.listen(process.env.PORT || 8081, () => {
        const address = server.address() as AddressInfo;
        // eslint-disable-next-line no-console
        console.log(`Listening on ${address.port}`);
        if (id) {
          CoveyTownsStore.getInstance()
            .createTown(id, false);
        }
      });
        });
  
    afterAll(async () => {
     db.deletePost(id, "daaaaaaaaaaaaaaaaaaaaaaa");
     db.deletePost(id, "baaaaaaaaaaaaaaaaaaaaaaa");
     db.deletePost(id, "aaaaaaaaaaaaaaaaaaaaaaaa");
     

     await server.close();
     // await mongoose.disconnect();
     console.log('but now im in here :)');
     // await console.log('im in here omgggg');

    });
    it('can get all posts in a town devoid of them',  async () => {
        // const testingTown = await createTownForTesting('yoyoyo', true);

        try {
            if(id) {
                // console.log('whattttttt');
                const ids = await db.getAllPostInTown(id);
                expect(ids.length).toBe(0);
               // console.log('im in here omgggg');
             }
        } catch(err) {
            console.log(err);
            // console.log(db.getPost(id, "aaaaaaaaaaaaaaaaaaaaaaaa"));
            expect(1).toBe(2); //if the above code rejects the promise, this test should fail
        }
        // console.log('no im out hereeeee');
    })
    it('can create a post',  async () => {
        // const testingTown = await createTownForTesting('yoyoyo', true);
        const posting:Post = {
            _id: 'aaaaaaaaaaaaaaaaaaaaaaaa',
            title: 'helloWorld',
            postContent: 'i sure exist',
            ownerID: 'uvwxyz',
            isVisible: true,
            coordinates: {
                x: 10,
                y: 10,
            }
        }
        try {
            if(id) {
                console.log('whattttttt');
                await expect(db.createPost(id, posting)).resolves;
                console.log('im in here omgggg');
             }
        } catch(err) {
            console.log(err);
            expect(1).toBe(2); //if the above code rejects the promise, this test should fail
        }
        console.log('no im out hereeeee');
    })
    it('can get a post',  async () => {
        // const testingTown = await createTownForTesting('yoyoyo', true);
        const posting1:Post = {
            _id: 'baaaaaaaaaaaaaaaaaaaaaaa',
            title: 'helloWorld',
            postContent: 'i sure exist',
            ownerID: 'uvwxyz',
            isVisible: true,
            coordinates: {
                x: 10,
                y: 10,
            },
            createdAt: new Date("2022-04-19T19:55:47.329Z"),
            updatedAt: new Date ("2022-04-19T19:55:47.329Z"),        
        }
        try {
            if(id) {
                // console.log('whattttttt');
                const ids = await db.createPost(id, posting1);
                const ids2 = await db.getPost(id, ids._id);
                expect(ids2.title).toBe('helloWorld');
               // console.log('im in here omgggg');
             }
        } catch(err) {
            console.log(err);
            // console.log(db.getPost(id, "aaaaaaaaaaaaaaaaaaaaaaaa"));
            expect(1).toBe(2); //if the above code rejects the promise, this test should fail
        }
        // console.log('no im out hereeeee');
    })
    it('can delete a post',  async () => {
        // const testingTown = await createTownForTesting('yoyoyo', true);
        const posting1:Post = {
            _id: 'caaaaaaaaaaaaaaaaaaaaaaa',
            title: 'helloWorlds',
            postContent: 'i sure exist',
            ownerID: 'uvwxyz',
            isVisible: true,
            coordinates: {
                x: 10,
                y: 10,
            },
            createdAt: new Date("2022-04-19T19:55:47.329Z"),
            updatedAt: new Date ("2022-04-19T19:55:47.329Z"),        
        }
        try {
            if(id) {
                // console.log('whattttttt');
                const ids = await db.createPost(id, posting1);
                const ids2 = await db.getPost(id, ids._id);
                expect(ids2.title).toBe('helloWorlds');
                await db.deletePost(id, ids._id);
                expect(db.getPost(id, ids._id)).resolves.toBeNull();
               // console.log('im in here omgggg');
             }
        } catch(err) {
            console.log(err);
            expect(1).toBe(2); //if the above code rejects the promise, this test should fail
        }
        // console.log('no im out hereeeee');
    })
    it('can get all posts',  async () => {
        // const testingTown = await createTownForTesting('yoyoyo', true);

        try {
            if(id) {
                // console.log('whattttttt');
                const ids = await db.getAllPostInTown(id);
                expect(ids[0]._id).toBe('baaaaaaaaaaaaaaaaaaaaaaa');
                expect(ids[1]._id).toBe('aaaaaaaaaaaaaaaaaaaaaaaa');
               // console.log('im in here omgggg');
             }
        } catch(err) {
            console.log(err);
            expect(1).toBe(2); //if the above code rejects the promise, this test should fail
        }
        // console.log('no im out hereeeee');
    })
    it('can update a post',  async () => {
        // const testingTown = await createTownForTesting('yoyoyo', true);
        const posting1:Post = {
            _id: 'daaaaaaaaaaaaaaaaaaaaaaa',
            title: 'helloWorld',
            postContent: 'i sure exist',
            ownerID: 'uvwxyz',
            isVisible: true,
            coordinates: {
                x: 10,
                y: 10,
            },
            createdAt: new Date("2022-04-19T19:55:47.329Z"),
            updatedAt: new Date ("2022-04-19T19:55:47.329Z"),  
        }
        const posting2:Post = {
            _id: 'daaaaaaaaaaaaaaaaaaaaaaa',
            title: 'helloWorld',
            postContent: 'i sure exist, still',
            ownerID: 'uvwxyz',
            isVisible: true,
            coordinates: {
                x: 10,
                y: 10,
            },
            createdAt: new Date("2022-04-19T19:55:47.329Z"),
            updatedAt: new Date ("2022-04-19T19:55:47.329Z"),  
        }
        try {
            if(id) {
                const ids = await db.createPost(id, posting1);
                const ids2 = await db.getPost(id, ids._id);
                expect(ids2.postContent).toBe('i sure exist');
                const ids3 = await db.updatePost(id, ids._id, posting2);
                const ids4= await db.getPost(id, ids._id);
                expect(ids4.postContent).toBe('i sure exist, still')
            }
        } catch(err) {
            console.log(err);
            expect(1).toBe(2); //if the above code rejects the promise, this test should fail
        }
    })
    it('can create (and delete) a comment', async () => {
        const comment:Comment = {
            rootPostID: 'aaaaaaaaaaaaaaaaaaaaaaaa',
            parentCommentID: '',
            commentContent: 'i sure exist',
            ownerID: 'uvwxyz',
            isDeleted: false,
            comments: ['hi there'],
        }
        
        try {
            if(id) {
                const ids = await db.createComment(id, comment);
                if (ids._id) { await db.deleteCommentForTesting(id, ids._id); }
             }
        } catch (err) {
            expect(1).toBe(2);
        }
    })
    it('can get a comment', async () => {
        const comment:Comment = {
            rootPostID: 'aaaaaaaaaaaaaaaaaaaaaaaa',
            parentCommentID: '',
            commentContent: 'i sure exist',
            ownerID: 'uvwxyz',
            isDeleted: false,
            comments: ['hi there'],
        }
        
        try {
            if(id) {
                const ids = await db.createComment(id, comment);
                if (ids._id) { 
                    const ids2 = await db.getComment(id, ids._id);
                    expect(ids2.commentContent).toBe('i sure exist');
                    await db.deleteCommentForTesting(id, ids._id); 
                }
             }
        } catch (err) {
            expect(1).toBe(2);
        }
    })
})