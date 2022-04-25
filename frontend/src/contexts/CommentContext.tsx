import React from 'react';
import Comment from '../classes/Comment';

/**
 * Context for Comment
 */
export interface CommentContextType {
    comments: Comment[];
    setComments?: (arg: Comment[]) => void;
}
const Context = React.createContext<CommentContextType>({
    comments: [],
    setComments: undefined,
});

export default Context;
