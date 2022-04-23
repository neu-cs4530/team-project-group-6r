import Grid from 'gridfs-stream';
import { GridFSBucket } from 'mongodb';
import mongoose from 'mongoose';

/**
 * Part of the servers connection between the town and mongo, which is used to upload files attached to posts
 */
export default class FileConnection {
  /**
   * This connection between the town and mongo
   */  
  private static _instance: FileConnection;

  /**
   * The way we can store and upload a file
   */
  private _gfs: Grid.Grid;

  /**
   * The protocol and process by which the file is uploaded
   */
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

  /**
   * Creates the file connection to mongo
   */
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