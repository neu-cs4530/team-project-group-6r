import React from 'react';
import { VStack, StackDivider } from '@chakra-ui/react';
import Comment from './ReadComment';
import { ServerComment } from '../../../classes/Comment';

interface CommentsProps {
    comments: ServerComment[];
}

export default function Comments({ comments }: CommentsProps): JSX.Element {

    function buildCommentsRecursive(comment: ServerComment, depth: number, accum: JSX.Element[]): void {
        accum.push(<Comment key={comment._id} comment={comment} depth={depth} />)
        if (comment.comments) {
            comment.comments.forEach(c => buildCommentsRecursive(c, depth + 1, accum));
        }
    }

    function buildComments(): JSX.Element[] {
        const result: JSX.Element[] = [];
        comments.forEach(c => buildCommentsRecursive(c, 0, result));
        return result;
    }
    
    // Pull the comments 
    // Start a socket for the comments
    // Build the comments from the comments
    return (
        <VStack
            flex='2'
            overflow='auto'
            overflowX='hidden'
            divider={<StackDivider borderColor='gray.200' />}
            space='5'
            paddingRight='5px'>
            {buildComments()}
        </VStack>
    )
}