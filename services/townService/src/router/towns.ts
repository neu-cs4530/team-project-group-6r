import express, { Express } from 'express';
import io from 'socket.io';
import { Server } from 'http';
import { StatusCodes } from 'http-status-codes';
import {
  conversationAreaCreateHandler,
  townCreateHandler, townDeleteHandler,
  townJoinHandler,
  townListHandler,
  townSubscriptionHandler,
  townUpdateHandler,
} from '../requestHandlers/CoveyTownRequestHandlers';
import { logError } from '../Utils';
import { Post } from '../schemas/MongoPost';
import { Multer } from 'multer';
import { gfs, gridfsBucket } from '../server';
import mongoose from 'mongoose';

export default function addTownRoutes(http: Server, app: Express, upload: Multer): io.Server {

  //post a file
  app.post('/upload', upload.single('file'), async (req, res) => {
    res.json({ file: req.file });
    console.log(req.file);
  })

  //get all files
  app.get('/files', (_req, res) => {
    gfs.files.find().toArray((_err, files) => {
      //Check if files
      if(!files || files.length == 0) {
        return res.status(404).json({
          err: 'No files exist'
        });
      }

      return res.json(files);
    })
  })

  //get one file
  app.get('/files/:id', (req, res) => {
    const obj_id = new mongoose.Types.ObjectId(req.params.id)
    gfs.files.findOne({_id: obj_id}, (_err, file) => {
      if(!file || file.length == 0) {
        return res.status(404).json({
          err: 'No file exist'
        });
      }

      return res.json(file);
    })
  })

  //get and stream image
  app.get('/image/:id', (req, res) => {
    const obj_id = new mongoose.Types.ObjectId(req.params.id)
    gfs.files.findOne({_id: obj_id}, (_err, file) => {
      if(!file || file.length == 0) {
        res.status(404).json({
          err: 'No file exist'
        });
      } else {
        //check image
        if(file.contentType === 'image/jpeg' || file.contentType === 'img/png') {
          const readStream = gridfsBucket.openDownloadStream(obj_id);
          readStream.pipe(res);
        } else{
          res.status(404).json({
            err: 'Not an image'
          });
        }
      }
    })
  });



  //delete image
  app.delete('/files/:id', (req, res) => {
    const obj_id = new mongoose.Types.ObjectId(req.params.id);
    try {
      gridfsBucket.delete(obj_id);
      return res.status(StatusCodes.OK).json(obj_id);
    } catch (err) {
      return res.status(404).json({
        err: 'File not found'
      })
    }
  });

  /*
    Gets list of posts in town.
  */
  app.get('/towns/:townID/posts', express.json(), async (_req, res) => {
    const posts = await Post.find({});

    try {
      res.status(StatusCodes.OK).json(posts);
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          message: 'Internal server error, please see log in server for more details',
        });
    }
  });

  app.get('/towns/:townID/post/:postID', express.json(), async (req, res) => {
    const post = await Post.findById(req.params.postID);

    try {
      res.status(StatusCodes.OK).json(post);
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          message: 'Internal server error, please see log in server for more details',
        });
    }
  });

  app.post('/towns/:townID/post', express.json(), async (req, res) => {
    const post = new Post(req.body);
    console.log(post);

    try {
      post.save();
      res.status(StatusCodes.OK).json(post);
    } catch (err) {
      logError(err);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          message: 'Internal server error, please see log in server for more details',
        });
    }
  });

  app.patch('/towns/:townID/post/:postID', express.json(), async (req, res) => {
    try {
      const post = await Post.findByIdAndUpdate(req.params.postID, req.body);
      console.log(req.body)
      res.status(StatusCodes.OK).json(post);
    } catch (err) {
      logError(err);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          message: 'Internal server error, please see log in server for more details',
        });
    }
  })

  app.delete('/towns/:townID/post/:postID', express.json(), async (req, res) => {
    try {
      const post = await Post.findByIdAndDelete(req.params.postID);

      if (!post) {
        res.status(StatusCodes.NOT_FOUND)
          .json({message: "Specified post not found"});
      }
      res.status(StatusCodes.OK).json(post);
    } catch (err) {
      logError(err);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          message: 'Internal server error, please see log in server for more details',
        });
    }
  })

  /*
   * Create a new session (aka join a town)
   */
  app.post('/sessions', express.json(), async (req, res) => {
    try {
      const result = await townJoinHandler({
        userName: req.body.userName,
        coveyTownID: req.body.coveyTownID,
      });
      res.status(StatusCodes.OK)
        .json(result);
    } catch (err) {
      logError(err);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          message: 'Internal server error, please see log in server for more details',
        });
    }
  });

  /**
   * Delete a town
   */
  app.delete('/towns/:townID/:townPassword', express.json(), async (req, res) => {
    try {
      const result = townDeleteHandler({
        coveyTownID: req.params.townID,
        coveyTownPassword: req.params.townPassword,
      });
      res.status(200)
        .json(result);
    } catch (err) {
      logError(err);
      res.status(500)
        .json({
          message: 'Internal server error, please see log in server for details',
        });
    }
  });

  /**
   * List all towns
   */
  app.get('/towns', express.json(), async (_req, res) => {
    try {
      const result = townListHandler();
      res.status(StatusCodes.OK)
        .json(result);
    } catch (err) {
      logError(err);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          message: 'Internal server error, please see log in server for more details',
        });
    }
  });

  /**
   * Create a town
   */
  app.post('/towns', express.json(), async (req, res) => {
    try {
      const result = townCreateHandler(req.body);
      res.status(StatusCodes.OK)
        .json(result);
    } catch (err) {
      logError(err);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          message: 'Internal server error, please see log in server for more details',
        });
    }
  });
  /**
   * Update a town
   */
  app.patch('/towns/:townID', express.json(), async (req, res) => {
    try {
      const result = townUpdateHandler({
        coveyTownID: req.params.townID,
        isPubliclyListed: req.body.isPubliclyListed,
        friendlyName: req.body.friendlyName,
        coveyTownPassword: req.body.coveyTownPassword,
      });
      res.status(StatusCodes.OK)
        .json(result);
    } catch (err) {
      logError(err);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          message: 'Internal server error, please see log in server for more details',
        });
    }
  });

  app.post('/towns/:townID/conversationAreas', express.json(), async (req, res) => {
    try {
      const result = await conversationAreaCreateHandler({
        coveyTownID: req.params.townID,
        sessionToken: req.body.sessionToken,
        conversationArea: req.body.conversationArea,
      });
      res.status(StatusCodes.OK)
        .json(result);
    } catch (err) {
      logError(err);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          message: 'Internal server error, please see log in server for more details',
        });
    }
  });

  const socketServer = new io.Server(http, { cors: { origin: '*' } });
  socketServer.on('connection', townSubscriptionHandler);
  return socketServer;
}
