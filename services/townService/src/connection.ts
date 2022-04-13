import Grid from 'gridfs-stream';
import { GridFSBucket } from 'mongodb';
import mongoose from 'mongoose';

export default class FileConnection {
  private static _instance: FileConnection;

  private _gfs: Grid.Grid;

  private _gridfsBucket: GridFSBucket;

  constructor() {
    this._gridfsBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: 'uploads',
    });

    this._gfs = Grid(mongoose.connection.db, mongoose.mongo);
    this.gfs.collection('uploads');
  }

  static createInstance(): void {
    if (FileConnection._instance === undefined) {
      FileConnection._instance = new FileConnection();
    } 
  }

  static getInstance(): FileConnection {
    return FileConnection._instance;
  }

  get gfs(): Grid.Grid {
    return this._gfs;
  }

  get gridfsBucket(): GridFSBucket {
    return this._gridfsBucket;
  }

  initGfsObjects() {
    mongoose.connection.once('open', () => {
      this._gridfsBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
        bucketName: 'uploads',
      });
  
      this._gfs = Grid(mongoose.connection.db, mongoose.mongo);
      this.gfs.collection('uploads');
    }); 
  }
}