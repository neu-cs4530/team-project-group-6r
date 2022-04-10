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
import {
  commentCreateHandler,
  commentDeleteHandler,
  commentGetHandler,
  commentUpdateHandler,
  postCreateHandler, postDeleteHandler, postGetAllIDInTownHandler, postGetHandler, postUpdateHandler,
} from '../requestHandlers/PostCoveyTownRequestHandlers';
import { logError } from '../Utils';

export default function addTownRoutes(http: Server, app: Express): io.Server {

  

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

  /**
   * Creates a post
   */
  app.post('/towns/:townID/post', express.json(), async (req, res) => {
    try {
      const result = await postCreateHandler({
        coveyTownID: req.params.townID,
        sessionToken: req.body.sessionToken,
        post: req.body.post,
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
        sessionToken: req.body.sessionToken
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
   app.patch('/towns/:townID/post/:postID', express.json(), async (req, res) => {
    try {
      const result = await postUpdateHandler({
        coveyTownID: req.params.townID,
        sessionToken: req.body.sessionToken,
        postID: req.params.postID,
        post: req.body.post,
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

  const socketServer = new io.Server(http, { cors: { origin: '*' } });
  socketServer.on('connection', townSubscriptionHandler);
  return socketServer;
}
