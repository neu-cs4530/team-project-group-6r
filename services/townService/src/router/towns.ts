import express, { Express } from 'express';
import io from 'socket.io';
import { Server } from 'http';
import { StatusCodes } from 'http-status-codes';
import { Multer } from 'multer';
import mongoose from 'mongoose';
import {
  conversationAreaCreateHandler,
  townCreateHandler, townDeleteHandler,
  townJoinHandler,
  townListHandler,
  townSubscriptionHandler,
  townUpdateHandler,
} from '../requestHandlers/CoveyTownRequestHandlers';
import {
  commentCreateHandler,
  commentDeleteHandler,
  commentGetHandler,
  commentUpdateHandler,
  fileDeleteHandler,
  fileGetHandler,
  postCreateHandler, postDeleteHandler, postGetAllIDInTownHandler, postGetCommentTreeHandler, postGetHandler, postUpdateHandler,
} from '../requestHandlers/PostCoveyTownRequestHandlers';
import { logError } from '../Utils';
import FileConnection from '../connection';

export default function addTownRoutes(http: Server, app: Express, upload: Multer): io.Server {
  /*
   * Create a new session (aka join a town)
   */
  app.post('/sessions', express.json(), async (req, res) => {
    try {
      console.log(4444);
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

  /**
   * Creates a post
   */
  app.post('/towns/:townID/post', express.json(), upload.single('file'), async (req, res) => {
    try {
      let parsedReq = JSON.parse(req.body.post); 
      let postToSend = parsedReq.post;
      if (req.file) {
        postToSend = { ...postToSend, file: {filename: req.file.filename, contentType: req.file.mimetype}}
      }
      const result = await postCreateHandler({
        coveyTownID: req.params.townID,
        sessionToken: parsedReq.sessionToken,
        post: postToSend,
      });
      res.status(StatusCodes.OK).json(result);
    } catch (err) {
      logError(err);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          message: 'Internal server error, please see log in server for more details',
        });
    }
  });

  /**
   * Get a post
   */
  app.get('/towns/:townID/post/:postID', express.json(), async (req, res) => {
    try {
      const result = await postGetHandler({
        coveyTownID: req.params.townID,
        sessionToken: req.body.sessionToken,
        postID: req.params.postID,
      });
      res.status(StatusCodes.OK).json(result);
    } catch (err) {
      logError(err);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          message: 'Internal server error, please see log in server for more details',
        });
    }
  });

  /**
   * Get all post ID's in town.
   */
  app.get('/towns/:townID/posts', express.json(), async (req, res) => {
    try {
      const result = await postGetAllIDInTownHandler({
        coveyTownID: req.params.townID,
        sessionToken: req.body.sessionToken,
      });
      res.status(StatusCodes.OK).json(result);
    } catch (err) {
      logError(err);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          message: 'Internal server error, please see log in server for more details',
        });
    }
  });

  /**
   * Get comment tree of post.
   */
  app.get('/towns/:townID/post/:postID/commentTree', express.json(), async (req, res) => {
    try {
      const result = await postGetCommentTreeHandler({
        coveyTownID: req.params.townID,
        sessionToken: req.body.sessionToken,
        postID: req.params.postID,
      });

      res.status(StatusCodes.OK).json(result);
    } catch (err) {
      logError(err);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          message: 'Internal server error, please see log in server for more details',
        });
    }
  });

  /**
   * Delete a post
   */
  app.delete('/towns/:townID/post/:postID', express.json(), async (req, res) => {
    try {
      const result = await postDeleteHandler({
        coveyTownID: req.params.townID,
        sessionToken: req.body.sessionToken,
        postID: req.params.postID,
      });
      res.status(StatusCodes.OK).json(result);
    } catch (err) {
      logError(err);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          message: 'Internal server error, please see log in server for more details',
        });
    }
  });

  /**
   * Update a post
   */
  app.patch('/towns/:townID/post/:postID', express.json(), upload.single('file'), async (req, res) => {
    try {
      let postToSend = req.body.post
      if (req.file) {
        postToSend = { ...postToSend, filename: req.file.filename}
      }
      const result = await postUpdateHandler({
        coveyTownID: req.params.townID,
        sessionToken: req.body.sessionToken,
        postID: req.params.postID,
        post: req.body.post,
        deletePrevFile: req.body.deletePrevFile
      });
      res.status(StatusCodes.OK).json(result);
    } catch (err) {
      logError(err);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          message: 'Internal server error, please see log in server for more details',
        });
    }
  });

  /**
   * Create a comment
   */
  app.post('/towns/:townID/comment', express.json(), async (req, res) => {
    try {
      const result = await commentCreateHandler({
        coveyTownID: req.params.townID,
        sessionToken: req.body.sessionToken,
        comment: req.body.comment,
      });
      res.status(StatusCodes.OK).json(result);
    } catch (err) {
      logError(err);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          message: 'Internal server error, please see log in server for more details',
        });
    }
  });

  /**
   * Get a comment
   */
  app.get('/towns/:townID/comment/:commentID', express.json(), async (req, res) => {
    try {
      const result = await commentGetHandler({
        coveyTownID: req.params.townID,
        sessionToken: req.body.sessionToken,
        commentID: req.params.commentID,
      });
      res.status(StatusCodes.OK).json(result);
    } catch (err) {
      logError(err);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          message: 'Internal server error, please see log in server for more details',
        });
    }
  });

  /**
   * Delete a comment
   */
  app.delete('/towns/:townID/comment/:commentID', express.json(), async (req, res) => {
    try {
      const result = await commentDeleteHandler({
        coveyTownID: req.params.townID,
        sessionToken: req.body.sessionToken,
        commentID: req.params.commentID,
      });
      res.status(StatusCodes.OK).json(result);
    } catch (err) {
      logError(err);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          message: 'Internal server error, please see log in server for more details',
        });
    }
  });

  /**
   * Update a comment
   */
  app.patch('/towns/:townID/comment/:commentID', express.json(), async (req, res) => {
    try {
      const result = await commentUpdateHandler({
        coveyTownID: req.params.townID,
        sessionToken: req.body.sessionToken,
        commentID: req.params.commentID,
        comment: req.body.comment,
      });
      res.status(StatusCodes.OK).json(result);
    } catch (err) {
      logError(err);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          message: 'Internal server error, please see log in server for more details',
        });
    }
  });

  // get all files (test route)
  app.get('/files', async (_req, res) => {
    const { gfs } = FileConnection.getInstance();

    gfs.files.find().toArray((_err, files) => {
      // Check if files
      if (!files || files.length === 0) {
        return res.status(404).json({
          err: 'No files exist',
        });
      }

      return res.json(files);
    });
  }); 

  // get one file
  app.get('/towns/:townID/files/:filename', async (req, res) => {
    try {
      const result = await fileGetHandler({
        coveyTownID: req.params.townID,
        sessionToken: req.body.sessionToken,
        postID: req.params.filename,
      });
      res.status(StatusCodes.OK).json(result);
    } catch (err) {
      logError(err);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          message: 'Internal server error, please see log in server for more details',
        });
    }
  });

  // get and stream image (test route)
  app.get('/image/:filename', async (req, res) => {
    const { gfs } = FileConnection.getInstance();
    const { gridfsBucket } = FileConnection.getInstance();
    gfs.files.findOne({ filename: req.params.filename }, (_err, file) => {
      if (!file || file.length === 0) {
        res.status(404).json({
          err: 'No file exist',
        });
      }
      const readStream = gridfsBucket.openDownloadStreamByName(req.params.filename);
      readStream.pipe(res);
    });
  });

  // delete file
  app.delete('/towns/:townID/files/:filename', async (req, res) => {
    try {
      const result = await fileDeleteHandler({
        coveyTownID: req.params.townID,
        sessionToken: req.body.sessionToken,
        postID: req.params.filename,
      });
      res.status(StatusCodes.OK).json(result);
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