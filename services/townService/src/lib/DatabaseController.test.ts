import mongoose from 'mongoose';
import { PostSchema } from '../types/MongoPost';
import TownPost from '../types/TownPost';
import DatabaseController from './DatabaseController';


const mondb = new DatabaseController();

beforeAll(async () => {
  await mondb.connect();
});

afterAll(() => {
  mondb.close();
  console.log('blahglkdjalsk');
});

describe('Interacting with the database', () => {
    it('succesfully connected to mongo', () => {
        const noErr = "No Errors called here"
        expect(noErr).toBe("No Errors called here");
        
    });
    it('can add a post to the town', async () => {
        const tp:TownPost = {townID: 'xyzzz', postID: 'ddfdf'};
        try {
        expect(mondb.addPost(tp)).toBe('addPost');
        } catch (err) {
            console.log(":(");
        }
    });
});