import DatabaseController from './DatabaseController';
import { Post } from "../../types/PostTown/post";
import { Comment } from "../../types/PostTown/comment";

import { PostSchema } from "../../schemas/MongoPost";

import http from 'http';
import TownsServiceClient from '../../client/TownsServiceClient';
import { nanoid } from 'nanoid';
import CORS from 'cors';
import Express from 'express';
import addTownRoutes from '../../router/towns';
import { AddressInfo } from 'net';
import mongoose from 'mongoose';
import CoveyTownsStore from '../CoveyTownsStore';

//this is no go because promises arent being handled at the moment
describe('The database', () => {

    const db = new DatabaseController();

    beforeAll(async () => {
      const app = Express();
      app.use(CORS());
      const server = http.createServer(app);
      
      const uri = 'mongodb+srv://Ezra:User1@coveytown.kt2xq.mongodb.net/CoveyTown?retryWrites=true&w=majority';
      mongoose.connect(uri).then(() => { console.log('MongoDB Connected') }).catch(err => console.log(err));
      
      addTownRoutes(server, app);
      
      server.listen(process.env.PORT || 8081, () => {
        const address = server.address() as AddressInfo;
        // eslint-disable-next-line no-console
        console.log(`Listening on ${address.port}`);
        if (process.env.DEMO_TOWN_ID) {
          CoveyTownsStore.getInstance()
            .createTown(process.env.DEMO_TOWN_ID, false);
        }
      });
        });
  
    // afterAll(async () => {
    //   await mongoose.disconnect();
    // });
    it('can get the current instance of the database',  () => {
        expect(DatabaseController.getInstance()).toStrictEqual(db);
    })
    it('can create a post', async () => {
        // const testingTown = await createTownForTesting('yoyoyo', true);
        const posting:Post = {
            _id: 'a',
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
            if(process.env.DEMO_TOWN_ID) {
                await expect(db.createPost(process.env.DEMO_TOWN_ID, posting)).resolves;
             }
        await mongoose.disconnect();
        } catch(err) {
            expect(1).toBe(2); //if the above code rejects the promise, this test should fail
        }
    })
    it('can get a post', async () => {
        const posting:Post = {
            _id: 'b',
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
            if(process.env.DEMO_TOWN_ID) {
                await expect(db.createPost(process.env.DEMO_TOWN_ID, posting)).resolves;
                await expect(db.getPost(process.env.DEMO_TOWN_ID, 'b')).resolves.toBe(posting);
             }
        } catch (err) {
            expect(1).toBe(2);
        }
    })
    it('can get all posts', async () => {
        const posting1:Post = {
            _id: 'c',
            title: 'helloWorld',
            postContent: 'i sure exist',
            ownerID: 'uvwxyz',
            isVisible: true,
            coordinates: {
                x: 10,
                y: 10,
            }
        }

        const posting2:Post = {
            _id: 'd',
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
            if(process.env.DEMO_TOWN_ID) {
                await db.createPost(process.env.DEMO_TOWN_ID, posting1);
                await db.createPost(process.env.DEMO_TOWN_ID, posting2);

                await expect(db.getAllPostInTown(process.env.DEMO_TOWN_ID)).resolves.toEqual({posting1, posting2});
             }
        } catch (err) {
            expect(1).toBe(2);
        }
    })
    it('can delete a post', async () => {
        const posting1:Post = {
            _id: 'e',
            title: 'helloWorld',
            postContent: 'i sure exist',
            ownerID: 'uvwxyz',
            isVisible: true,
            coordinates: {
                x: 10,
                y: 10,
            }
        }

        const posting2:Post = {
            _id: 'f',
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
            if(process.env.DEMO_TOWN_ID) {
                await db.createPost(process.env.DEMO_TOWN_ID, posting1);
                await db.createPost(process.env.DEMO_TOWN_ID, posting2);

                await expect(db.getAllPostInTown(process.env.DEMO_TOWN_ID)).resolves.toEqual({posting1, posting2});

                await db.deletePost(process.env.DEMO_TOWN_ID, 'e');
                await expect(db.getAllPostInTown(process.env.DEMO_TOWN_ID)).resolves.toEqual({posting2});
             }
        } catch (err) {
            expect(1).toBe(2);
        }
    })
    it('can update a post', async () => {
        const posting:Post = {
            _id: 'g',
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
            if(process.env.DEMO_TOWN_ID) {
                await expect(db.createPost(process.env.DEMO_TOWN_ID, posting)).resolves;
                await expect(db.getPost(process.env.DEMO_TOWN_ID, 'g')).resolves.toBe(posting);

                const posting2:Post = {
                    _id: 'g',
                    title: 'helloWorld',
                    postContent: 'i sure exist, yet again',
                    ownerID: 'uvwxyz',
                    isVisible: true,
                    coordinates: {
                        x: 10,
                        y: 10,
                    }
                }
                await expect(db.updatePost(process.env.DEMO_TOWN_ID, 'g', posting2)).resolves.toEqual(posting2);

             }
        } catch (err) {
            expect(1).toBe(2);
        }
    })
    it('can create a comment', async () => {
        const posting:Post = {
            _id: 'h',
            title: 'helloWorld',
            postContent: 'i sure exist',
            ownerID: 'uvwxyz',
            isVisible: true,
            coordinates: {
                x: 10,
                y: 10,
            }
        }

        const comment:Comment = {
            _id: 'a',
            rootPostID: 'h',
            parentCommentID: 'h',
            commentContent: 'i sure exist',
            ownerID: 'uvwxyz',
            isDeleted: false,
            comments: ['hi there'],
        }
        
        try {
            if(process.env.DEMO_TOWN_ID) {
                await db.createPost(process.env.DEMO_TOWN_ID, posting);
                await db.createComment(process.env.DEMO_TOWN_ID, comment);
             }
        } catch (err) {
            expect(1).toBe(2);
        }
    })
    it('can get a comment', async () => {
        const posting:Post = {
            _id: 'i',
            title: 'helloWorld',
            postContent: 'i sure exist',
            ownerID: 'uvwxyz',
            isVisible: true,
            coordinates: {
                x: 10,
                y: 10,
            }
        }

        const comment:Comment = {
            _id: 'b',
            rootPostID: 'i',
            parentCommentID: 'i',
            commentContent: 'i sure exist',
            ownerID: 'uvwxyz',
            isDeleted: false,
            comments: ['hi there'],
        }
        
        try {
            if(process.env.DEMO_TOWN_ID) {
                await db.createPost(process.env.DEMO_TOWN_ID, posting);
                await db.createComment(process.env.DEMO_TOWN_ID, comment);

                await expect(db.getComment(process.env.DEMO_TOWN_ID, 'a')).resolves.toBe(comment);
             }
        } catch (err) {
            expect(1).toBe(2);
        }
    })
    it('can delete a comment', async () => {
        const posting:Post = {
            _id: 'j',
            title: 'helloWorld',
            postContent: 'i sure exist',
            ownerID: 'uvwxyz',
            isVisible: true,
            coordinates: {
                x: 10,
                y: 10,
            }
        }

        const comment:Comment = {
            _id: 'c',
            rootPostID: 'j',
            parentCommentID: 'j',
            commentContent: 'i sure exist',
            ownerID: 'uvwxyz',
            isDeleted: false,
            comments: ['hi there'],
        }
        
        try {
            if(process.env.DEMO_TOWN_ID) {
                await db.createPost(process.env.DEMO_TOWN_ID, posting);
                await db.createComment(process.env.DEMO_TOWN_ID, comment);

                await expect(db.getComment(process.env.DEMO_TOWN_ID, 'a')).resolves.toBe(comment);

                await db.deleteComment(process.env.DEMO_TOWN_ID, 'c');
                await expect(db.getComment(process.env.DEMO_TOWN_ID, 'c')).rejects;
             }
        } catch (err) {
            expect(1).toBe(2);
        }
    })
    it('can update a comment', async () => {
        const posting:Post = {
            _id: 'k',
            title: 'helloWorld',
            postContent: 'i sure exist',
            ownerID: 'uvwxyz',
            isVisible: true,
            coordinates: {
                x: 10,
                y: 10,
            }
        }

        const comment:Comment = {
            _id: 'd',
            rootPostID: 'k',
            parentCommentID: 'k',
            commentContent: 'i sure exist',
            ownerID: 'uvwxyz',
            isDeleted: false,
            comments: ['hi there'],
        }
        
        try {
            if(process.env.DEMO_TOWN_ID) {
                await db.createPost(process.env.DEMO_TOWN_ID, posting);
                await db.createComment(process.env.DEMO_TOWN_ID, comment);

                await expect(db.getComment(process.env.DEMO_TOWN_ID, 'a')).resolves.toBe(comment);

                const comment1:Comment = {
                    _id: 'd',
                    rootPostID: 'k',
                    parentCommentID: 'k',
                    commentContent: 'i sure exist, yet again',
                    ownerID: 'uvwxyz',
                    isDeleted: false,
                    comments: ['hi there'],
                }
                await db.updateComment(process.env.DEMO_TOWN_ID, 'd', comment1);
                await expect(db.getComment(process.env.DEMO_TOWN_ID, 'd')).resolves.toBe(comment1);
             }
        } catch (err) {
            expect(1).toBe(2);
        }
    })
})