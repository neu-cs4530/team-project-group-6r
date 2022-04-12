import React from 'react';
// Hooks
import useCoveyAppState from '../../hooks/useCoveyAppState';
// Components
import Post from './Post';
import PostObj, { Coordinate } from '../../classes/Post';
import CreatePost from './CreatePost';

export interface PostSlideBarProps {
    post: PostObj | undefined;
    coordinate: Coordinate | undefined;
}

/*
    Plan:
        Post/Comment Data Flow
            HTTP: When user initially joins the town, the HTTP response include the list of posts
            Socket: When user initially joins the town, sets up a socket for listen new posts to the town
            Socket: When user open a Post, sets up a socket for listen to post updates and comment updates
        Action:
            User press P on an empty tile, pompt the create post interface
                Create Post API
                Interface Update according to the data returned from the http
            User press P on a post tile, show the PostSideBar
                Edit Post API
                Delete Post API
                Hide Post API
                Get Comment API
                Create Comment API
                Edit Comment API
                Dlete Comment API
                Hide Comment API
                Interface Update according to the data returned from the socket
        
*/
export default function PostSlideBar({ post, coordinate }: PostSlideBarProps): JSX.Element | null {
    const { userName } = useCoveyAppState();

    if (post) {
        return <Post post={post} username={userName} />
    } 
    if (coordinate) {
        return <CreatePost coordinate={coordinate} username={userName} />   
    }
    return null;
}