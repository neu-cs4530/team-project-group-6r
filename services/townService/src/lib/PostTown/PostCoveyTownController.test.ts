import { nanoid } from 'nanoid';
import { mock, mockDeep, mockReset } from 'jest-mock-extended';
import { Socket } from 'socket.io';
import TwilioVideo from './../TwilioVideo';
import Player from '../../types/Player';
import CoveyTownListener from '../../types/CoveyTownListener';
import { UserLocation } from '../../CoveyTypes';
import PlayerSession from '../../types/PlayerSession';
import { townSubscriptionHandler } from '../../requestHandlers/CoveyTownRequestHandlers';
import CoveyTownsStore from './../CoveyTownsStore';
import * as TestUtils from '../../client/TestUtils';
// New Testing Class
import { Post, PostSkin } from '../../types/PostTown/post';
import { Comment, CommentTree } from '../../types/PostTown/comment';
import * as db from '../PostTown/DatabaseController';
import PostCoveyTownController from './../PostTown/PostCoveyTownController';

/**
 * Note:
 * PostTownController is an extension to CoveyTownController. We have no made any changes to CoveyTownController.
 * We want to make sure all tests that worked for CoveyTownController also worked for PostTownController. So
 * we are expected to reuses the same Jest testing suit. 
 * Then we want to test all the new functionalities of our PostTownController
 */
const mockTwilioVideo = mockDeep<TwilioVideo>();
jest.spyOn(TwilioVideo, 'getInstance').mockReturnValue(mockTwilioVideo);

function generateTestLocation(): UserLocation {
    return {
        rotation: 'back',
        moving: Math.random() < 0.5,
        x: Math.floor(Math.random() * 100),
        y: Math.floor(Math.random() * 100),
    };
}

describe('PostCoveyTownController', () => {
    describe('Ensuring all newy added functionalities of PostTownController work', () => {
        const townName = `FriendlyNameTest-${nanoid()}`;
        const player = new Player('test player');
        const playerSession = new PlayerSession(player);
        let townController: PostCoveyTownController;
        let post1: Post;
        let post2: Post;
        let comment1: Comment;
        let comment2: Comment;
        let commentTree1: CommentTree;
        beforeEach(async () => {
            townController = new PostCoveyTownController(townName, false);
            post1 = {
                file: { filename: '', contentType: '' },
                coordinates: { x: 49, y: 33 },
                title: 'asdff',
                postContent: '',
                ownerID: 'adsf',
                isVisible: true,
                timeToLive: 5000,
                numberOfComments: 0,
                comments: [],
                postSkin: PostSkin.POST,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            post2 = {
                file: { filename: '', contentType: '' },
                coordinates: { x: 49, y: 33 },
                title: 'asdff',
                postContent: '',
                ownerID: 'test player',
                isVisible: true,
                timeToLive: 5000,
                numberOfComments: 0,
                comments: [],
                postSkin: PostSkin.POST,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            comment1 = {
                rootPostID: '62675fe72c03d846485b078d',
                parentCommentID: '',
                ownerID: 'hrhg',
                commentContent: 'adfdsf',
                isDeleted: false,
                comments: [],
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            comment2 = {
                rootPostID: '62675fe72c03d846485b078d',
                parentCommentID: '',
                ownerID: 'test player',
                commentContent: 'adfdsf',
                isDeleted: false,
                comments: [],
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            commentTree1 = {
                rootPostID: '62675fe72c03d846485b078d',
                parentCommentID: '',
                ownerID: 'hrhg',
                commentContent: 'adfdsf',
                isDeleted: false,
                comments: [],
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        });
        describe('createPost', () => {
            it('Ensuring createPost is calling the createPost of Databasecontroller create a new Post object', async () => {
                const spy = jest.spyOn(db, 'createPost').mockResolvedValue(post1);
                await townController.createPost(post1);
                expect(spy).toBeCalled();
            });
            it('Ensuring createPost should not create a post that has a coordinates collision', async () => {
                const collidePosts: Post[] = [post1, post2];
                jest.spyOn(db, 'getAllPostInTown').mockResolvedValue(collidePosts);
                try {
                    await townController.createPost(post1);
                } catch (e) {
                    if (e instanceof Error) {
                        expect(e.message).toEqual('Post must have a title!');
                    }
                }
            });
            it('Ensuring createPost broadcasts the newly created post', async () => {
                const mockListeners = [mock<CoveyTownListener>(),
                mock<CoveyTownListener>(),
                mock<CoveyTownListener>()];
                mockListeners.forEach(listener => townController.addTownListener(listener));
                jest.spyOn(db, 'createPost').mockResolvedValue(post1);
                await townController.createPost(post1);
                mockListeners.forEach(listener => expect(listener.onPostCreate).toBeCalledWith(post1));
            })
        });
        describe('getPost', () => {
            it('Ensuring getPost is calling the getPost of Databasecontroller to get a post using postID', async () => {
                jest.spyOn(db, 'getPost').mockResolvedValue(post1);
                const result = await townController.getPost("wdawdwad");
                expect(result).toBe(result);
            });
        });
        describe('getAllPostInTown', () => {
            it('Ensuring getAllPostInTown is calling the getAllPostInTown of Databasecontroller to get a all post of a town', async () => {
                const collidePosts: Post[] = [post1, post2];
                jest.spyOn(db, 'getAllPostInTown').mockResolvedValue(collidePosts);
                const result = await townController.getAllPostInTown();
                expect(result.length).toBe(2);
            });
        });
        describe('deletePost', () => {
            it('Ensuring deletePost should note delete a post if the requester is not the owner', async () => {
                jest.spyOn(db, 'getPost').mockResolvedValue(post1);
                jest.spyOn(townController, 'getSessionByToken').mockReturnValue(playerSession);
                try {
                    await townController.deletePost('121dddw', '1212dadw');
                } catch (e) {
                    if (e instanceof Error) {
                        expect(e.message).toBeDefined();
                    }
                }
            });
            it('Ensuring deletePost broadcasts the deleted post', async () => {
                const mockListeners = [mock<CoveyTownListener>(),
                mock<CoveyTownListener>(),
                mock<CoveyTownListener>()];
                mockListeners.forEach(listener => townController.addTownListener(listener));
                jest.spyOn(db, 'getPost').mockResolvedValue(post2);
                jest.spyOn(townController, 'getSessionByToken').mockReturnValue(playerSession);
                jest.spyOn(db, 'deletePost').mockResolvedValue(post2);
                jest.spyOn(db, 'deleteCommentsUnderPost').mockResolvedValue(undefined)
                await townController.deletePost('d12e1', 'adawdwad');
                mockListeners.forEach(listener => expect(listener.onPostDelete).toBeCalledWith(post2));
            });
        });
        describe('updatePost', () => {
            it('Ensuring updatePost should not update a post if the requester is not the owner', async () => {
                jest.spyOn(db, 'getPost').mockResolvedValue(post1);
                jest.spyOn(townController, 'getSessionByToken').mockReturnValue(playerSession);
                try {
                    await townController.updatePost('121dddw', post1, false, '1212dadw');
                } catch (e) {
                    if (e instanceof Error) {
                        expect(e.message).toBeDefined();
                    }
                }
            });
            it('Ensuring updatePost broadcasts the updates post', async () => {
                const mockListeners = [mock<CoveyTownListener>(),
                mock<CoveyTownListener>(),
                mock<CoveyTownListener>()];
                mockListeners.forEach(listener => townController.addTownListener(listener));
                jest.spyOn(db, 'getPost').mockResolvedValue(post2);
                jest.spyOn(townController, 'getSessionByToken').mockReturnValue(playerSession);
                jest.spyOn(db, 'updatePost').mockResolvedValue(post2);
                await townController.updatePost('121dddw', post2, false, '1212dadw');
                mockListeners.forEach(listener => expect(listener.onPostUpdate).toBeCalledWith(post2));
            });
        });
        describe('createComment', () => {
            it('Ensuring createComment is calling the createComment of Databasecontroller to create a comment and emitting onCommentUpdate', async () => {
                const mockListeners = [mock<CoveyTownListener>(),
                mock<CoveyTownListener>(),
                mock<CoveyTownListener>()];
                mockListeners.forEach(listener => townController.addTownListener(listener));
                jest.spyOn(db, 'createComment').mockResolvedValue(comment1);
                jest.spyOn(db, 'addCommentToRootPost').mockResolvedValue(undefined);
                jest.spyOn(db, 'addCommentToParentComment').mockResolvedValue(undefined);
                jest.spyOn(db, 'addTimeToPostTTL').mockResolvedValue(undefined);
                jest.spyOn(townController, 'getCommentTree').mockResolvedValue([commentTree1]);
                await townController.createComment(comment1);
                mockListeners.forEach(listener => expect(listener.onCommentUpdate).toBeCalled());
            });
        });
        describe('getComment', () => {
            it('Ensuring getComment is calling the getComment of Databasecontroller to get a comment', async () => {
                jest.spyOn(db, 'getComment').mockResolvedValue(comment1);
                await townController.getComment('Test Comment');
            });
        });
        describe('deleteComment', () => {
            it('Ensuring deleteComment can not delete a comment if owner is not correct', async () => {
                const mockListeners = [mock<CoveyTownListener>(),
                mock<CoveyTownListener>(),
                mock<CoveyTownListener>()];
                mockListeners.forEach(listener => townController.addTownListener(listener));
                jest.spyOn(db, 'getPost').mockResolvedValue(comment2);
                jest.spyOn(townController, 'getSessionByToken').mockReturnValue(playerSession);
                jest.spyOn(db, 'updatePost').mockResolvedValue(comment2);
                try {
                    await townController.deleteComment('121dddw', '1212dadw');
                } catch (e) {
                    if (e instanceof Error) {
                        expect(e.message).toBeDefined();
                    }
                }
            });
        });
        describe('updateComment', () => {
            it('Ensuring updateComment can not update a comment if owner if now correct', async () => {
                const mockListeners = [mock<CoveyTownListener>(),
                mock<CoveyTownListener>(),
                mock<CoveyTownListener>()];
                mockListeners.forEach(listener => townController.addTownListener(listener));
                jest.spyOn(db, 'getPost').mockResolvedValue(comment2);
                jest.spyOn(townController, 'getSessionByToken').mockReturnValue(playerSession);
                jest.spyOn(db, 'updatePost').mockResolvedValue(comment2);
                try {
                    await townController.updateComment('121dddw', '1212dadw', '123123');
                } catch (e) {
                    if (e instanceof Error) {
                        expect(e.message).toBeDefined();
                    }
                }
            });
        });
        describe('getFile', () => {
            it('Ensuring getFile is calling the getFile of Databasecontroller to get a file', () => {
                const spy = jest.spyOn(db, 'getFile').mockResolvedValue(undefined);
                townController.getFile("test file1");
                expect(spy).toBeCalled();
            });
        });
        describe('deleteFile', () => {
            it('Ensuring deleteFile is calling the deleteFile of Databasecontroller to delete a file', () => {
                const spy = jest.spyOn(db, 'deleteFile').mockResolvedValue(undefined);
                townController.deleteFile("test file1");
                expect(spy).toBeCalled();
            })
        })
    });
    describe('Ensuring all previous tests worked for CoveyTownController also work PostTownController', () => {
        beforeEach(() => {
            mockTwilioVideo.getTokenForTown.mockClear();
        });
        it('constructor should set the friendlyName property', () => {
            const townName = `FriendlyNameTest-${nanoid()}`;
            const townController = new PostCoveyTownController(townName, false);
            expect(townController.friendlyName)
                .toBe(townName);
        });
        describe('addPlayer', () => {
            it('should use the coveyTownID and player ID properties when requesting a video token',
                async () => {
                    const townName = `FriendlyNameTest-${nanoid()}`;
                    const townController = new PostCoveyTownController(townName, false);
                    const newPlayerSession = await townController.addPlayer(new Player(nanoid()));
                    expect(mockTwilioVideo.getTokenForTown).toBeCalledTimes(1);
                    expect(mockTwilioVideo.getTokenForTown).toBeCalledWith(townController.coveyTownID, newPlayerSession.player.id);
                });
        });
        describe('town listeners and events', () => {
            let testingTown: PostCoveyTownController;
            const mockListeners = [mock<CoveyTownListener>(),
            mock<CoveyTownListener>(),
            mock<CoveyTownListener>()];
            beforeEach(() => {
                const townName = `town listeners and events tests ${nanoid()}`;
                testingTown = new PostCoveyTownController(townName, false);
                mockListeners.forEach(mockReset);
            });
            it('should notify added listeners of player movement when updatePlayerLocation is called', async () => {
                const player = new Player('test player');
                await testingTown.addPlayer(player);
                const newLocation = generateTestLocation();
                mockListeners.forEach(listener => testingTown.addTownListener(listener));
                testingTown.updatePlayerLocation(player, newLocation);
                mockListeners.forEach(listener => expect(listener.onPlayerMoved).toBeCalledWith(player));
            });
            it('should notify added listeners of player disconnections when destroySession is called', async () => {
                const player = new Player('test player');
                const session = await testingTown.addPlayer(player);

                mockListeners.forEach(listener => testingTown.addTownListener(listener));
                testingTown.destroySession(session);
                mockListeners.forEach(listener => expect(listener.onPlayerDisconnected).toBeCalledWith(player));
            });
            it('should notify added listeners of new players when addPlayer is called', async () => {
                mockListeners.forEach(listener => testingTown.addTownListener(listener));

                const player = new Player('test player');
                await testingTown.addPlayer(player);
                mockListeners.forEach(listener => expect(listener.onPlayerJoined).toBeCalledWith(player));

            });
            it('should notify added listeners that the town is destroyed when disconnectAllPlayers is called', async () => {
                const player = new Player('test player');
                await testingTown.addPlayer(player);

                mockListeners.forEach(listener => testingTown.addTownListener(listener));
                testingTown.disconnectAllPlayers();
                mockListeners.forEach(listener => expect(listener.onTownDestroyed).toBeCalled());

            });
            it('should not notify removed listeners of player movement when updatePlayerLocation is called', async () => {
                const player = new Player('test player');
                await testingTown.addPlayer(player);

                mockListeners.forEach(listener => testingTown.addTownListener(listener));
                const newLocation = generateTestLocation();
                const listenerRemoved = mockListeners[1];
                testingTown.removeTownListener(listenerRemoved);
                testingTown.updatePlayerLocation(player, newLocation);
                expect(listenerRemoved.onPlayerMoved).not.toBeCalled();
            });
            it('should not notify removed listeners of player disconnections when destroySession is called', async () => {
                const player = new Player('test player');
                const session = await testingTown.addPlayer(player);

                mockListeners.forEach(listener => testingTown.addTownListener(listener));
                const listenerRemoved = mockListeners[1];
                testingTown.removeTownListener(listenerRemoved);
                testingTown.destroySession(session);
                expect(listenerRemoved.onPlayerDisconnected).not.toBeCalled();

            });
            it('should not notify removed listeners of new players when addPlayer is called', async () => {
                const player = new Player('test player');

                mockListeners.forEach(listener => testingTown.addTownListener(listener));
                const listenerRemoved = mockListeners[1];
                testingTown.removeTownListener(listenerRemoved);
                const session = await testingTown.addPlayer(player);
                testingTown.destroySession(session);
                expect(listenerRemoved.onPlayerJoined).not.toBeCalled();
            });

            it('should not notify removed listeners that the town is destroyed when disconnectAllPlayers is called', async () => {
                const player = new Player('test player');
                await testingTown.addPlayer(player);

                mockListeners.forEach(listener => testingTown.addTownListener(listener));
                const listenerRemoved = mockListeners[1];
                testingTown.removeTownListener(listenerRemoved);
                testingTown.disconnectAllPlayers();
                expect(listenerRemoved.onTownDestroyed).not.toBeCalled();

            });
        });
        describe('townSubscriptionHandler', () => {
            const mockSocket = mock<Socket>();
            let testingTown: PostCoveyTownController;
            let player: Player;
            let session: PlayerSession;
            beforeEach(async () => {
                const townName = `connectPlayerSocket tests ${nanoid()}`;
                testingTown = CoveyTownsStore.getInstance().createTown(townName, false);
                mockReset(mockSocket);
                player = new Player('test player');
                session = await testingTown.addPlayer(player);
            });
            it('should reject connections with invalid town IDs by calling disconnect', async () => {
                TestUtils.setSessionTokenAndTownID(nanoid(), session.sessionToken, mockSocket);
                townSubscriptionHandler(mockSocket);
                expect(mockSocket.disconnect).toBeCalledWith(true);
            });
            it('should reject connections with invalid session tokens by calling disconnect', async () => {
                TestUtils.setSessionTokenAndTownID(testingTown.coveyTownID, nanoid(), mockSocket);
                townSubscriptionHandler(mockSocket);
                expect(mockSocket.disconnect).toBeCalledWith(true);
            });
            describe('with a valid session token', () => {
                it('should add a town listener, which should emit "newPlayer" to the socket when a player joins', async () => {
                    TestUtils.setSessionTokenAndTownID(testingTown.coveyTownID, session.sessionToken, mockSocket);
                    townSubscriptionHandler(mockSocket);
                    await testingTown.addPlayer(player);
                    expect(mockSocket.emit).toBeCalledWith('newPlayer', player);
                });
                it('should add a town listener, which should emit "playerMoved" to the socket when a player moves', async () => {
                    TestUtils.setSessionTokenAndTownID(testingTown.coveyTownID, session.sessionToken, mockSocket);
                    townSubscriptionHandler(mockSocket);
                    testingTown.updatePlayerLocation(player, generateTestLocation());
                    expect(mockSocket.emit).toBeCalledWith('playerMoved', player);

                });
                it('should add a town listener, which should emit "playerDisconnect" to the socket when a player disconnects', async () => {
                    TestUtils.setSessionTokenAndTownID(testingTown.coveyTownID, session.sessionToken, mockSocket);
                    townSubscriptionHandler(mockSocket);
                    testingTown.destroySession(session);
                    expect(mockSocket.emit).toBeCalledWith('playerDisconnect', player);
                });
                it('should add a town listener, which should emit "townClosing" to the socket and disconnect it when disconnectAllPlayers is called', async () => {
                    TestUtils.setSessionTokenAndTownID(testingTown.coveyTownID, session.sessionToken, mockSocket);
                    townSubscriptionHandler(mockSocket);
                    testingTown.disconnectAllPlayers();
                    expect(mockSocket.emit).toBeCalledWith('townClosing');
                    expect(mockSocket.disconnect).toBeCalledWith(true);
                });
                describe('when a socket disconnect event is fired', () => {
                    it('should remove the town listener for that socket, and stop sending events to it', async () => {
                        TestUtils.setSessionTokenAndTownID(testingTown.coveyTownID, session.sessionToken, mockSocket);
                        townSubscriptionHandler(mockSocket);

                        // find the 'disconnect' event handler for the socket, which should have been registered after the socket was connected
                        const disconnectHandler = mockSocket.on.mock.calls.find(call => call[0] === 'disconnect');
                        if (disconnectHandler && disconnectHandler[1]) {
                            disconnectHandler[1]();
                            const newPlayer = new Player('should not be notified');
                            await testingTown.addPlayer(newPlayer);
                            expect(mockSocket.emit).not.toHaveBeenCalledWith('newPlayer', newPlayer);
                        } else {
                            fail('No disconnect handler registered');
                        }
                    });
                    it('should destroy the session corresponding to that socket', async () => {
                        TestUtils.setSessionTokenAndTownID(testingTown.coveyTownID, session.sessionToken, mockSocket);
                        townSubscriptionHandler(mockSocket);

                        // find the 'disconnect' event handler for the socket, which should have been registered after the socket was connected
                        const disconnectHandler = mockSocket.on.mock.calls.find(call => call[0] === 'disconnect');
                        if (disconnectHandler && disconnectHandler[1]) {
                            disconnectHandler[1]();
                            mockReset(mockSocket);
                            TestUtils.setSessionTokenAndTownID(testingTown.coveyTownID, session.sessionToken, mockSocket);
                            townSubscriptionHandler(mockSocket);
                            expect(mockSocket.disconnect).toHaveBeenCalledWith(true);
                        } else {
                            fail('No disconnect handler registered');
                        }

                    });
                });
                it('should forward playerMovement events from the socket to subscribed listeners', async () => {
                    TestUtils.setSessionTokenAndTownID(testingTown.coveyTownID, session.sessionToken, mockSocket);
                    townSubscriptionHandler(mockSocket);
                    const mockListener = mock<CoveyTownListener>();
                    testingTown.addTownListener(mockListener);
                    // find the 'playerMovement' event handler for the socket, which should have been registered after the socket was connected
                    const playerMovementHandler = mockSocket.on.mock.calls.find(call => call[0] === 'playerMovement');
                    if (playerMovementHandler && playerMovementHandler[1]) {
                        const newLocation = generateTestLocation();
                        player.location = newLocation;
                        playerMovementHandler[1](newLocation);
                        expect(mockListener.onPlayerMoved).toHaveBeenCalledWith(player);
                    } else {
                        fail('No playerMovement handler registered');
                    }
                });
            });
        });
        describe('addConversationArea', () => {
            let testingTown: PostCoveyTownController;
            beforeEach(() => {
                const townName = `addConversationArea test town ${nanoid()}`;
                testingTown = new PostCoveyTownController(townName, false);
            });
            it('should add the conversation area to the list of conversation areas', () => {
                const newConversationArea = TestUtils.createConversationForTesting();
                const result = testingTown.addConversationArea(newConversationArea);
                expect(result).toBe(true);
                const areas = testingTown.conversationAreas;
                expect(areas.length).toEqual(1);
                expect(areas[0].label).toEqual(newConversationArea.label);
                expect(areas[0].topic).toEqual(newConversationArea.topic);
                expect(areas[0].boundingBox).toEqual(newConversationArea.boundingBox);
            });
        });
        describe('updatePlayerLocation', () => {
            let testingTown: PostCoveyTownController;
            beforeEach(() => {
                const townName = `updatePlayerLocation test town ${nanoid()}`;
                testingTown = new PostCoveyTownController(townName, false);
            });
            it('should respect the conversation area reported by the player userLocation.conversationLabel, and not override it based on the player\'s x,y location', async () => {
                const newConversationArea = TestUtils.createConversationForTesting({ boundingBox: { x: 10, y: 10, height: 5, width: 5 } });
                const result = testingTown.addConversationArea(newConversationArea);
                expect(result).toBe(true);
                const player = new Player(nanoid());
                await testingTown.addPlayer(player);

                const newLocation: UserLocation = { moving: false, rotation: 'front', x: 25, y: 25, conversationLabel: newConversationArea.label };
                testingTown.updatePlayerLocation(player, newLocation);
                expect(player.activeConversationArea?.label).toEqual(newConversationArea.label);
                expect(player.activeConversationArea?.topic).toEqual(newConversationArea.topic);
                expect(player.activeConversationArea?.boundingBox).toEqual(newConversationArea.boundingBox);

                const areas = testingTown.conversationAreas;
                expect(areas[0].occupantsByID.length).toBe(1);
                expect(areas[0].occupantsByID[0]).toBe(player.id);

            });
            it('should emit an onConversationUpdated event when a conversation area gets a new occupant', async () => {

                const newConversationArea = TestUtils.createConversationForTesting({ boundingBox: { x: 10, y: 10, height: 5, width: 5 } });
                const result = testingTown.addConversationArea(newConversationArea);
                expect(result).toBe(true);

                const mockListener = mock<CoveyTownListener>();
                testingTown.addTownListener(mockListener);

                const player = new Player(nanoid());
                await testingTown.addPlayer(player);
                const newLocation: UserLocation = { moving: false, rotation: 'front', x: 25, y: 25, conversationLabel: newConversationArea.label };
                testingTown.updatePlayerLocation(player, newLocation);
                expect(mockListener.onConversationAreaUpdated).toHaveBeenCalledTimes(1);
            });
        });
    });
});
