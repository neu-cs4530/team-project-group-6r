import DatabaseController from './DatabaseController';
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



describe('Post Controller tests', () => {
    const pctc = new PostCoveyTownController('postal', true);
    const townId = pctc.coveyTownID;//process.env.DEMO_TOWN_ID;
    let townController:CoveyTownController;

    beforeAll(async () => {
      const app = Express();
      app.use(CORS());
      const server = http.createServer(app);
      
      const uri = 'mongodb+srv://Ezra:User1@coveytown.kt2xq.mongodb.net/CoveyTown?retryWrites=true&w=majority';
      const connectToMongo = async() => {
        await mongoose.connect(uri);
        return mongoose;};
    await connectToMongo().then(() => { console.log('MongoDB Connected') }).catch(err => console.log(err));


    //   await mongoose.connect(uri).then(() => { console.log('MongoDB Connected') }).catch(err => console.log(err));
    //   await MongoClient.connect(uri).then(() => { console.log('MongoDB Connected Again') }).catch(err => console.log(err));;

      
      addTownRoutes(server, app);
      
      server.listen(process.env.PORT || 8081, () => {
        const address = server.address() as AddressInfo;
        // eslint-disable-next-line no-console
        console.log(`Listening on ${address.port}`);
        if (townId) {
        // eslint-disable-next-line no-console
        console.log('im here');
        townController = CoveyTownsStore.getInstance().createTown(townId, true);
        }
      });
        });

    it('can create a post', async () => {
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
            if(townId) {
                await expect(pctc.createPost(posting)).resolves;
            }
            await mongoose.disconnect();
        } catch(err) {
            expect(1).toBe(2); //if the above code rejects the promise, this test should fail
        }
    })
    it('can get a post', async () => {
        const posting:Post = {
            _id: 'AAAAAAAAAAAAAAAAAAAAAAAA',
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
            if(townId) {
                await expect(pctc.createPost(posting)).resolves;
                await expect(pctc.getPost('AAAAAAAAAAAAAAAAAAAAAAAA')).resolves.toBe(posting);
            }
            await mongoose.disconnect();
        } catch(err) {
            console.log(err);
            expect(1).toBe(2); //if the above code rejects the promise, this test should fail
        }
    })
    it('can get all posts', async () => {
        const posting1:Post = {
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
        const posting2:Post = {
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
            if(townId) {
                await expect(pctc.createPost(posting1)).resolves;
                await expect(pctc.createPost(posting2)).resolves;

                await expect(pctc.getPost('a')).resolves.toBe(posting1);
                await expect(pctc.getPost('b')).resolves.toBe(posting2);
                await expect(pctc.getAllPostInTown()).resolves.toBe(['a','b']);
            }
            await mongoose.disconnect();
        } catch(err) {
            expect(1).toBe(2); //if the above code rejects the promise, this test should fail
        }
    })
    it('can delete a post', async () => {
        const player = new Player('test player');
        const session = await townController.addPlayer(player);
        const posting1:Post = {
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
        const posting2:Post = {
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
            if(townId) {
                await expect(pctc.createPost(posting1)).resolves;
                await expect(pctc.createPost(posting2)).resolves;

                await expect(pctc.getPost('a')).resolves.toBe(posting1);
                await expect(pctc.getPost('b')).resolves.toBe(posting2);
                await expect(pctc.getAllPostInTown()).resolves.toBe(['a','b']);

                await expect(pctc.deletePost('a', session.sessionToken)).resolves.toBe(posting1);
                await expect(pctc.getAllPostInTown()).resolves.toBe(['b']);

            }
            await mongoose.disconnect();
        } catch(err) {
            expect(1).toBe(2); //if the above code rejects the promise, this test should fail
        }
    })
    it('can update a post', async () => {
        const player = new Player('test player');
        const session = await townController.addPlayer(player);
        const posting:Post = {
            _id: 'AAAAAAAAAAAAAAAAAAAAAAAA',
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
            _id: 'AAAAAAAAAAAAAAAAAAAAAAAA',
            title: 'helloWorld',
            postContent: 'i sure exist, here too',
            ownerID: 'uvwxyz',
            isVisible: true,
            coordinates: {
                x: 10,
                y: 10,
            }
        }
        try {
            if(townId) {
                await expect(pctc.createPost(posting)).resolves;
                await expect(pctc.getPost('AAAAAAAAAAAAAAAAAAAAAAAA')).resolves.toBe(posting);

                await expect(pctc.updatePost('AAAAAAAAAAAAAAAAAAAAAAAA', posting2, session.sessionToken)).resolves;
                await expect(pctc.getPost('AAAAAAAAAAAAAAAAAAAAAAAA')).resolves.toBe(posting2);

            }
            await mongoose.disconnect();
        } catch(err) {
            console.log(err);
            expect(1).toBe(2); //if the above code rejects the promise, this test should fail
        }
    })
})