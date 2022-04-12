export type ServerPost = {
    _id?: string,
    title: string,
    postContent: string,
    ownerID: string,
    fileID?: string,
    isVisible: boolean,
    comments?: string[],
    coordinates: Coordinate,
    createdAt?: Date,
    updatedAt?: Date
}

export type PostListener = {
    onPostChange?: (updatedPost: ServerPost) => void;
    onCommentChange?: (comments: string[]) => void;
}

export type Coordinate = {
    x: number;
    y: number;
}

export const dummyPosts: ServerPost[] = [
    {
        "coordinates": {
            "x": 48,
            "y": 35,
        },
        "comments": [],
        "_id": "624ea8cc6e50c406f87af212",
        "title": "Post 0",
        "postContent": "fuck you cheng xi tsou cai ni maa de bi",
        "ownerID": "test",
        "isVisible": true,
    },
    {
        "coordinates": {
            "x": 40,
            "y": 35,
        },
        "comments": [],
        "_id": "624e4ac5ae40e056287afe11",
        "title": "Post 1",
        "postContent": "fuck you cheng xi tsou cai ni maa de bi",
        "ownerID": "test",
        "isVisible": true,
    },
    {
        "coordinates": {
            "x": 42,
            "y": 30,
        },
        "comments": [],
        "_id": "891ec8s56ea0c0c6f8736e71",
        "title": "Post 2",
        "postContent": "fuck you cheng xi tsou cai ni maa de bi",
        "ownerID": "test",
        "isVisible": true,
    }
]

export default class Post {
    private _id?: string;

    private _title: string;

    private _postContent: string;

    private _ownerID: string;

    private _fileID?: string;

    private _isVisible: boolean;

    private _coordinates: Coordinate;

    private _comments?: string[] = [];

    private _createAt?: Date;

    private _updateAt?: Date;

    private _listeners: PostListener[] = [];

    public sprite?: Phaser.GameObjects.Sprite;

    public label?: Phaser.GameObjects.Text;

    constructor(title: string, postContent: string,
        ownerID: string, isVisible: boolean, coordinate: Coordinate,
        comments?: string[], id?: string, fileID?: string, createAt?: Date, updateAt?: Date) {
        this._id = id;
        this._title = title;
        this._postContent = postContent;
        this._ownerID = ownerID;
        this._isVisible = isVisible;
        this._comments = comments;
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

    get updateAt() {
        return this._updateAt;
    }

    toServerPost(): ServerPost {
        return {
            _id: this._id,
            title: this._title,
            postContent: this._postContent,
            ownerID: this._ownerID,
            isVisible: this._isVisible,
            comments: this._comments,
            coordinates: this._coordinates,
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
            this._comments?.concat([]),
            this._id,
            this._fileID,
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
            serverPost.comments,
            serverPost._id,
            serverPost.fileID,
            serverPost.createdAt,
            serverPost.updatedAt,
        );
        return ret;
    }
}