import multer, { Multer } from 'multer';

import { Post } from "../../types/PostTown/post";
import { Comment } from "../../types/PostTown/comment";
import PostCoveyTownController from './PostCoveyTownController';
import CoveyTownsStore from '../CoveyTownsStore';
import { AddressInfo } from 'net';
import Express from 'express';
import http from 'http';
import CORS from 'cors';
import addTownRoutes from '../../router/towns';
import mongoose from 'mongoose';
import CoveyTownController from '../CoveyTownController';
import Player from '../../types/Player';
import {MongoClient} from 'MongoDB';
import g from 'gridfs-stream';



describe('Post Controller tests', () => {
    const id = 'ddd';
    const oid = 'ownerownerownerownerowne'
    const pctc = new PostCoveyTownController(id, oid);
    let pid: Post;
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
        pctc.deletePost(String(pid._id), oid);
    
        await server.close();
        // await mongoose.disconnect();
        // await console.log('im in here omgggg');

    });
    it('can create a post',  async () => {
        const posting:Post = {
            _id: 'aaaaaaaaaaaaaaaaaaaaaaaa',
            title: 'helloWorld',
            postContent: 'i sure exist',
            ownerID: oid,
            isVisible: true,
            coordinates: {
                x: 10,
                y: 10,
            }
        }
        try {
            if(id) {
                pid = await pctc.createPost(posting);
             }
        } catch(err) {
            console.log(err);
            expect(1).toBe(2); //if the above code rejects the promise, this test should fail
        }
    })
    it('can delete a post',  async () => {
        const posting:Post = {
            _id: 'baaaaaaaaaaaaaaaaaaaaaaa',
            title: 'helloWorld',
            postContent: 'i sure exist',
            ownerID: oid,
            isVisible: true,
            coordinates: {
                x: 10,
                y: 10,
            }
        }

        try {
            if(id) {
                const ids = await pctc.createPost(posting);
                expect(ids.postContent).toBe('i sure exist');
                const ids2 = await pctc.deletePost(String(ids._id), oid);
                expect (ids2.postContent).toBe('i sure exist');
                await expect((await pctc.getAllPostInTown()).length).toBe(1);
               // console.log('im in here omgggg');
             }
        } catch(err) {
            console.log(err);
            expect(1).toBe(2); //if the above code rejects the promise, this test should fail
        }
        // console.log('no im out hereeeee');
    })
    it('can get a post',  async () => {
        try {
            if(id) {
                const ids = await pctc.getPost(String(pid._id));
                expect(ids.postContent).toBe('i sure exist');
                expect(ids.title).toBe('helloWorld');
             }
        } catch(err) {
            console.log(err);
            expect(1).toBe(2); //if the above code rejects the promise, this test should fail
        }
    })
    it('can update a post',  async () => {
        // const testingTown = await createTownForTesting('yoyoyo', true);
        const posting1:Post = {
            _id: 'daaaaaaaaaaaaaaaaaaaaaaa',
            title: 'helloWorld',
            postContent: 'i sure exist',
            ownerID: oid,
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
            ownerID: oid,
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
                const ids = await pctc.createPost(posting1);
                const ids2 = await pctc.getPost(String(ids._id));
                expect(ids2.postContent).toBe('i sure exist');
                const ids3 = await pctc.updatePost(String(ids._id), posting2, oid);
                const ids4= await pctc.getPost(String(ids._id));
                expect(ids4.postContent).toBe('i sure exist, still');
                await pctc.deletePost(String(ids4._id), oid);

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
            ownerID: oid,
            isDeleted: false,
            comments: ['hi there'],
        }
        
        try {
            if(id) {
                const ids = await pctc.createComment(comment);
                if (ids._id) { await pctc.deleteCommentForTesting(ids._id, oid); }
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
            ownerID: oid,
            isDeleted: false,
            comments: ['hi there'],
        }
        
        try {
            if(id) {
                const ids = await pctc.createComment(comment);
                if (ids._id) { 
                    const ids2 = await pctc.getComment(ids._id);
                    expect(ids2.commentContent).toBe('i sure exist');
                    await pctc.deleteCommentForTesting(ids._id, oid); 
                }
             }
        } catch (err) {
            expect(1).toBe(2);
        }
    })
})