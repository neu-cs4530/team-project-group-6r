import { PostSkin } from "./Image";

/**
 * A post is a type of global message that people can see and comment upon; this is the server representation of it
 */
export type ServerPost = {
    _id?: string,
    title: string,
    postContent: string,
    ownerID: string,
    file: {
        filename: string,
        contentType: string
    }
    isVisible: boolean,
    timeToLive: number,
    numberOfComments: number,
    comments?: string[],
    postSkin: PostSkin,
    coordinates: Coordinate,
    createdAt?: Date,
    updatedAt?: Date
}

/**
 * The server representation of a file attached to a post
 */
export type ServerFile = {
    filename: string,
    contentType: string
}
/**
 * The servers listener that sees when a post/comment is made, updated, deleted, etc.
 */
export type PostListener = {
    onPostChange?: (updatedPost: ServerPost) => void;
    onCommentChange?: (comments: string[]) => void;
}

/**
 * Where the post is
 */
export type Coordinate = {
    x: number;
    y: number;
}

/**
 * The UI representation of a post
 */
export default class Post {
    private _id?: string;

    private _title: string;

    private _postContent: string;

    private _ownerID: string;

    private _file: ServerFile;

    private _isVisible: boolean;

    private _coordinates: Coordinate;

    private _timeToLive: number;

    private _numberOfComments: number;

    private _comments?: string[] = [];

    private _postSkin: PostSkin;

    private _createAt?: Date;

    private _updateAt?: Date;

    private _listeners: PostListener[] = [];

    public sprite?: Phaser.GameObjects.Sprite;

    public label?: Phaser.GameObjects.Text;

    constructor(title: string, postContent: string,
        ownerID: string, isVisible: boolean, coordinate: Coordinate, file: ServerFile,
        timeToLive: number, numberOfComments: number, postSkin: PostSkin, comments?: string[], id?: string, createAt?: Date, updateAt?: Date) {
        this._id = id;
        this._title = title;
        this._postContent = postContent;
        this._ownerID = ownerID;
        this._file = file;
        this._isVisible = isVisible;
        this._timeToLive = timeToLive;
        this._numberOfComments = numberOfComments;
        this._comments = comments;
        this._postSkin = postSkin;
        this._coordinates = coordinate;
        this._createAt = createAt;
        this._updateAt = updateAt;
    }

    get id() {
        return this._id;
    }

    get title() {
        return this._title;
    }

    get postContent() {
        return this._postContent;
    }

    get ownerId() {
        return this._ownerID;
    }

    get isVisible() {
        return this._isVisible;
    }

    get comments() {
        return this._comments;
    }

    get coordinate() {
        return this._coordinates;
    }

    get createAt() {
        return this._createAt;
    }

    get postSkin() {
        return this._postSkin;
    }

    get updateAt() {
        return this._updateAt;
    }

    get file() {
        return this._file;
    }

    toServerPost(): ServerPost {
        return {
            _id: this._id,
            title: this._title,
            postContent: this._postContent,
            ownerID: this._ownerID,
            isVisible: this._isVisible,
            timeToLive: this._timeToLive,
            numberOfComments: this._numberOfComments,
            comments: this._comments,
            postSkin: this._postSkin,
            coordinates: this._coordinates,
            file: this._file,
            createdAt: this._createAt,
            updatedAt: this._updateAt,
        };
    }

    addListener(listener: PostListener) {
        this._listeners.push(listener);
    }

    removeListener(listener: PostListener) {
        this._listeners = this._listeners.filter(eachListener => eachListener !== listener);
    }

    copy(): Post {
        const ret = new Post(
            this._title,
            this._postContent,
            this._ownerID,
            this._isVisible,
            { ...this._coordinates },
            { ...this._file },
            this._timeToLive,
            this._numberOfComments,
            this._postSkin,
            this._comments?.concat([]),
            this._id,
            this._createAt,
            this._updateAt,
        );
        
        this._listeners.forEach(listener => ret.addListener(listener));
        return ret;
    }

    static fromServerPost(serverPost: ServerPost): Post {
        const ret = new Post(
            serverPost.title,
            serverPost.postContent,
            serverPost.ownerID,
            serverPost.isVisible,
            serverPost.coordinates,
            serverPost.file,
            serverPost.timeToLive,
            serverPost.numberOfComments,
            serverPost.postSkin,
            serverPost.comments,
            serverPost._id,
            serverPost.createdAt,
            serverPost.updatedAt,
        );
        return ret;
    }
}