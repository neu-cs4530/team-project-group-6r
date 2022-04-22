import React from 'react';
import Comment from '../classes/Comment';

export interface CommentContextType {
    comments: Comment[];
    setComments?: (arg: Comment[]) => void;
}
// TODO
const Context = React.createContext<CommentContextType>({
    comments: [],
    setComments: undefined,
});

export default Context;
