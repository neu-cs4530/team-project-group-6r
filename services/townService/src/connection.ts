import Grid from 'gridfs-stream';
import { GridFSBucket } from 'mongodb';
import mongoose from 'mongoose';

let gfs: Grid.Grid;
let gridfsBucket: GridFSBucket;

export function initGfsObjects() {
  mongoose.connection.once('open', () => {
    gridfsBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: 'uploads',
    });

    gfs = Grid(mongoose.connection.db, mongoose.mongo);
    gfs.collection('uploads');
  }); 
}

export { gfs, gridfsBucket };