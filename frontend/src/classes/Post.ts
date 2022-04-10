import Comment from './Comment';
import { ServerComment } from './Comment';

export type ServerPost = {
    title: string,
    postContent: string,
    ownerID: string,
    isVisible: boolean,
    comments?: string[],
    coordinates: {
        x: number,
        y: number,
    },
    createdAt?: Date,
    updatedAt?: Date
}

export type PostListener = {
    onPostChange?: (updatedPost: ServerPost) => void;
    onCommentChange?: (comments: string[]) => void;
}

export default class Post {

}