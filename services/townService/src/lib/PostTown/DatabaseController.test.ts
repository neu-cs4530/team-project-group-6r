import * as db from './DatabaseController';
import { Post, PostSkin } from "../../types/PostTown/post";
import { Comment } from "../../types/PostTown/comment";
import multer, { Multer } from 'multer';

import PostSchema from "../../schemas/MongoPost";

import http from 'http';
import CORS from 'cors';
import Express from 'express';
import mongoose from 'mongoose';
import { logError } from '../../Utils';
import * as svr from '../../server';


describe('The database', () => {
    const id = 'ccc';
    const app = Express();
    app.use(CORS());
    const server = http.createServer(app);
  
    beforeAll(async () => {
        svr.ServerSocket;      
    });
  
    afterAll(async () => {   
        mongoose.connection.db.collection(id).drop();
        svr.ServerSocket.close();
    });
    
    it('can get all posts in a town devoid of them',  async () => {
        try {
            if(id) {
                const ids = await db.getAllPostInTown(id);
                expect(ids.length).toBe(0);
            }
        } catch(err) {
            logError(err);
        }
    })

    it('can create a post',  async () => {
        const posting:Post = {
            title: 'helloWorld',
            postContent: 'i sure exist',
            ownerID: 'uvwxyz',
            isVisible: true,
            coordinates: {
                x: 10,
                y: 10,
            },
            timeToLive: 1000000000,
            numberOfComments: 2,
            postSkin: PostSkin.BALLON
        }
        try {
            await expect(db.createPost(id, posting)).resolves;
        } catch(err) {
            console.log(err)
            expect(1).toBe(2); //if the above code rejects the promise, this test should fail
        }
    })
    it('should reject a bad request', async () => {
        const posting: Post = {
            title: 'helloWorld',
            postContent: 'i sure exist',
            ownerID: 'uvwxyz',
            isVisible: true,
            coordinates: {
                x: 10,
                y: 10,
            },
            timeToLive: 1000000000,
            numberOfComments: 2,
            postSkin: PostSkin.BALLON,
        }
        try {
            await expect(db.createPost('wrongtown', posting)).rejects;
        } catch(err) {
            console.log(err)
            expect(1).toBe(2); //if the above code rejects the promise, this test should fail
        }
    })
    it('can get a post',  async () => {
        const posting1:Post = {
            title: 'helloWorld',
            postContent: 'i sure exist',
            ownerID: 'uvwxyz',
            isVisible: true,
            coordinates: {
                x: 10,
                y: 10,
            },
            timeToLive: 10,
            numberOfComments: 2,
            postSkin: PostSkin.BALLON        
        }
        try {
            if(id) {
                const ids = await db.createPost(id, posting1);
                const ids2 = await db.getPost(id, String(ids._id));
                expect(ids2.title).toBe('helloWorld');
             }
        } catch(err) {
            expect(1).toBe(2); //if the above code rejects the promise, this test should fail
        }
    })
    it('cannot get a bad post',  async () => {
        const posting1:Post = {
            title: 'helloWorld',
            postContent: 'i sure exist',
            ownerID: 'uvwxyz',
            isVisible: true,
            coordinates: {
                x: 10,
                y: 10,
            },
            timeToLive: 10,
            numberOfComments: 2,
            postSkin: PostSkin.BALLON        
        }
        try {
            if(id) {
                const ids = await db.createPost(id, posting1);
                const ids2 = await db.getPost(id, String('bad'));
                expect(ids2.title).toBe('helloWorld');
             }
        } catch(err) {
            if (err instanceof Error) {
                expect(err.message).toBeDefined();
            }
        }
    })
    it('can delete a post',  async () => {
        const posting1:Post = {
            title: 'helloWorlds',
            postContent: 'i sure exist',
            ownerID: 'uvwxyz',
            isVisible: true,
            coordinates: {
                x: 10,
                y: 10,
            },
            timeToLive: 1000000000,
            numberOfComments: 2,
            postSkin: PostSkin.BALLON         
        }
        try {
            if(id) {
                const ids = await db.createPost(id, posting1);
                const ids2 = await db.getPost(id, String(ids._id));
                expect(ids2.title).toBe('helloWorlds');
                await db.deletePost(id, String(ids._id));
                expect(db.getPost(id, String(ids._id))).resolves.toBeNull();
             }
        } catch(err) {
            expect(1).toBe(2); //if the above code rejects the promise, this test should fail
        }
    })
    it('cannot delete a wrong post',  async () => {
        const posting1:Post = {
            title: 'helloWorlds',
            postContent: 'i sure exist',
            ownerID: 'uvwxyz',
            isVisible: true,
            coordinates: {
                x: 10,
                y: 10,
            },
            timeToLive: 1000000000,
            numberOfComments: 2,
            postSkin: PostSkin.BALLON         
        }
        try {
            if(id) {
                const ids = await db.createPost(id, posting1);
                const ids2 = await db.getPost(id, String(ids._id));
                expect(ids2.title).toBe('helloWorlds');
                await db.deletePost(id, String('bad delete'));
             }
        } catch(err) {
            if (err instanceof Error) {
                expect(err.message).toBeDefined();
            }
        }
    })
    it('can get all posts',  async () => {
        try {
            const posting1:Post = {
                title: 'helloWorlds',
                postContent: 'i sure exist',
                ownerID: 'uvwxyz',
                isVisible: true,
                coordinates: {
                    x: 10,
                    y: 10,
                },
                timeToLive: 1000000000,
                numberOfComments: 2,
                postSkin: PostSkin.BALLON         
            }
            const posting2:Post = {
                title: 'helloWorlds',
                postContent: 'i sure exist hehe!!',
                ownerID: 'uvwxyz',
                isVisible: true,
                coordinates: {
                    x: 10,
                    y: 10,
                },
                timeToLive: 1000000000,
                numberOfComments: 2,
                postSkin: PostSkin.BALLON         
            }
            if(id) {
                await db.createPost(id, posting1);
                await db.createPost(id, posting2);
                const ids = await db.getAllPostInTown(id);
                expect(ids.length).toBe(6);
             }
        } catch(err) {
            logError(err)
        }
    })
    it('can update a post',  async () => {
        const posting1:Post = {
            title: 'helloWorld',
            postContent: 'i sure exist',
            ownerID: 'uvwxyz',
            isVisible: true,
            coordinates: {
                x: 10,
                y: 10,
            },
            timeToLive: 1000000000,
            numberOfComments: 2,
            postSkin: PostSkin.BALLON   
        }
        const posting2:Post = {
            title: 'helloWorld',
            postContent: 'i sure exist, still',
            ownerID: 'uvwxyz',
            isVisible: true,
            coordinates: {
                x: 10,
                y: 10,
            },
            timeToLive: 1000000000,
            numberOfComments: 2,
            postSkin: PostSkin.BALLON   
        }
        try {
            if(id) {
                const ids = await db.createPost(id, posting1);
                const ids2 = await db.getPost(id, String(ids._id));
                expect(ids2.postContent).toBe('i sure exist');
                const ids3 = await db.updatePost(id, String(ids._id), posting2);
                const ids4= await db.getPost(id, String(ids._id));
                expect(ids4.postContent).toBe('i sure exist, still')
            }
        } catch(err) {
            expect(1).toBe(2); //if the above code rejects the promise, this test should fail
        }
    })
    it('can update a post with fields',  async () => {
        const posting1:Post = {
            title: 'helloWorld',
            postContent: 'i sure exist',
            ownerID: 'uvwxyz',
            isVisible: true,
            coordinates: {
                x: 10,
                y: 10,
            },
            timeToLive: 1000000000,
            numberOfComments: 2,
            postSkin: PostSkin.BALLON   
        }
        try {
            if(id) {
                const ids = await db.createPost(id, posting1);
                const ids2 = await db.getPost(id, String(ids._id));
                expect(ids2.postContent).toBe('i sure exist');
                const ids3 = await db.updatePost(id, String(ids._id), {
                    postContent: 'i sure exist, still'
                });
                const ids4= await db.getPost(id, String(ids._id));
                expect(ids4.postContent).toBe('i sure exist, still')
            }
        } catch(err) {
            logError(err);
        }
    })
    it('can create a comment', async () => {
        const comment:Comment = {
            rootPostID: 'WithComments',
            parentCommentID: '',
            commentContent: 'i sure exist',
            ownerID: 'uvwxyz',
            isDeleted: false,
            comments: ['hi there'],
        }
        
        try {
            if(id) {
                const ids = await db.createComment(id, comment);
                if (ids._id) { await db.deleteComment(id, ids._id); }
             }
        } catch (err) {
            expect(1).toBe(2);
        }
    })
    it('can get a comment', async () => {
        const comment:Comment = {
            rootPostID: 'WithComments',
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
                    const ids3 = await db.deleteComment(id, ids2._id); 
                    expect(ids3.commentContent).toBe('[removed]');

                }
             }
        } catch (err) {
            expect(1).toBe(2);
        }
    })
    it('can link a comment to root post', async () => {
        const posting1:Post = {
            title: 'helloWorld',
            postContent: 'i sure exist',
            ownerID: 'uvwxyz',
            isVisible: true,
            coordinates: {
                x: 10,
                y: 10,
            },
            timeToLive: 1000000000,
            numberOfComments: 2,
            postSkin: PostSkin.BALLON  
        }
        const comment:Comment = {
            rootPostID: '',
            parentCommentID: '',
            commentContent: 'i sure exist, without a parent :(',
            ownerID: 'uvwxyz',
            isDeleted: false,
            comments: [],
        }
        
        try {
            if(id) {
                const ids = await db.createPost(id, posting1);
                const cds = await db.createComment(id, comment);
                if (cds._id) { 
                    const ids2 = await db.addCommentToRootPost(id, String(ids._id), cds._id);
                    const ids3 = await db.getPost(id, ids2._id);
                    if (ids3.comments) { 
                        expect(ids3.comments[0]).toBe(String(cds._id)); 
                    }
                    await db.deleteCommentsUnderPost(id, ids3._id);
                    await db.deletePost(id, String(cds._id));
                    await db.deletePost(id, String(ids._id));
                }
             }
        } catch (err) {
            expect(1).toBe(2);
        }
    })
    it('can get all comments', async () => {
        const comment1:Comment = {
            rootPostID: 'WithComments',
            parentCommentID: '',
            commentContent: 'i sure exist, with a parent :(',
            ownerID: 'uvwxyz',
            isDeleted: false,
            comments: [],
        }
        const comment2:Comment = {
            rootPostID: 'WithComments',
            parentCommentID: '',
            commentContent: 'i sure exist still, with a parent :(',
            ownerID: 'uvwxyz',
            isDeleted: false,
            comments: [],
        }
        
        try {
            if(id) {
                const cds = await db.createComment(id, comment1);
                const cds2 = await db.createComment(id, comment2);
                if (cds._id && cds2._id) { 
                    const cdss = await db.getAllComments(id, [cds._id, cds2._id]);
                    expect(cdss[0].commentContent).toBe('i sure exist, with a parent :(');
                    expect(cdss[1].commentContent).toBe('i sure exist still, with a parent :(');
                    await db.deletePost(id, String(cds._id));
                    await db.deletePost(id, String(cds2._id));
                }
             }
        } catch (err) {
            expect(1).toBe(2);
        }
    })
    it('can delete a comment under root posts', async () => {
        const posting1:Post = {
            title: 'helloWorld',
            postContent: 'i sure exist',
            ownerID: 'uvwxyz',
            isVisible: true,
            comments: [],
            coordinates: {
                x: 10,
                y: 10,
            },
            timeToLive: 1000000000,
            numberOfComments: 2,
            postSkin: PostSkin.BALLON  
        }
        const comment:Comment = {
            rootPostID: '',
            parentCommentID: '',
            commentContent: 'i sure exist, without a parent :(',
            ownerID: 'uvwxyz',
            isDeleted: false,
            comments: [],
        }
        
        try {
            if(id) {
                const ids = await db.createPost(id, posting1);
                const cds = await db.createComment(id, comment);
                if (cds._id) { 
                    const ids2 = await db.addCommentToRootPost(id, String(ids._id), cds._id);
                    const ids3 = await db.getPost(id, ids2._id);
                    if (ids3.comments) { 
                        expect(ids3.comments[0]).toBe(String(cds._id)); 
                    }
                    const ids4 = await db.deleteCommentsUnderPost(id, 'faaaaaaaaaaaaaaaaaaaaaaa');
                    if (posting1.comments) { 
                        expect(posting1.comments.length).toBe(0); 
                    }

                    await db.deletePost(id, String(cds._id));
                    await db.deletePost(id, String(ids._id));
                }
             }
        } catch (err) {
            expect(1).toBe(2);
        }
    })
    it('can update a comments', async () => {
        const comment1:Comment = {
            rootPostID: 'WithComments',
            parentCommentID: '',
            commentContent: 'i sure exist, with a parent :(',
            ownerID: 'uvwxyz',
            isDeleted: false,
            comments: [],
        }
        const comment2:Comment = {
            rootPostID: 'WithComments',
            parentCommentID: '',
            commentContent: 'i sure exist still, with a parent',
            ownerID: 'uvwxyz',
            isDeleted: false,
            comments: [],
        }
        
        try {
            if(id) {
                const cds = await db.createComment(id, comment1);
                if (cds._id) { 
                    const cds2 = await db.updateComment(id, cds._id, comment2);
                    expect(cds2.commentContent).toBe('i sure exist still, with a parent');
                    await db.deletePost(id, String(cds2._id));
                }
             }
        } catch (err) {
            expect(1).toBe(2);
        }
    })
})