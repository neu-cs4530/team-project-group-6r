import React from 'react';
import { VStack, StackDivider } from '@chakra-ui/react';
import Comment from './ReadComment';
import { ServerComment } from '../../../classes/Comment';

/**
 * The properties of a comment
 */
interface CommentsProps {
    comments: ServerComment[];
}

/**
 * The JSX element version of a comment
 * @returns The JSX element of a comment
 */
export default function Comments({ comments }: CommentsProps): JSX.Element {

    /**
     * Builds the UI comment tree, recursively
     * @param comment The comment being added to the comment tree
     * @param depth How far down, parent comment wise, the comment is
     * @param accum The current comment tree
     */
    function buildCommentsRecursive(comment: ServerComment, depth: number, accum: JSX.Element[]): void {
        accum.push(<Comment key={comment._id} comment={comment} depth={depth} />)
        if (comment.comments) {
            comment.comments.forEach(c => buildCommentsRecursive(c, depth + 1, accum));
        }
    }

    /**
     * Builds the ui comment tree for each comment
     * @returns the current UI comment tree
     */
    function buildComments(): JSX.Element[] {
        const result: JSX.Element[] = [];
        comments.forEach(c => buildCommentsRecursive(c, 0, result));
        return result;
    }

    return (
        <VStack
            width='100%'
            overflow='auto'
            overflowX='hidden'
            divider={<StackDivider borderColor='gray.200' />}
            space='5'
            paddingRight='5px'>
            {buildComments()}
        </VStack>
    )
}