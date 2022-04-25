import React, { useState, useMemo } from "react";
import { Text, Box, Flex, Button, Textarea, useToast, ButtonGroup } from "@chakra-ui/react";
import useCoveyAppState from '../../../hooks/useCoveyAppState';
import calculateTimeDifference from "../../../Util";
import { ServerComment } from '../../../classes/Comment';
import { CommentDeleteRequest, CommentUpdateRequest } from '../../../classes/TownsServiceClient';
import PopOverButton from './PopOverButton';
import useApi from './useApi';
import CreateComment from "./CreateComment";

/**
 * The properties of reading a comment on your screen
 */
export interface CommentProps {
    comment: ServerComment;
    depth: number;
}

/**
 * What a comment looks like it can contain to you
 */
type CommentStates = {
    reply: boolean;
    edit: boolean;
    content: string;
}

/**
 * How a comment will look to a reader
 * @returns The jsx version of how a comment looks like to someone reading it
 */
export default function ReadComment({ comment, depth }: CommentProps): JSX.Element {
    const { userName, currentTownID, sessionToken, apiClient } = useCoveyAppState();
    const [state, setState] = useState<CommentStates>({
        reply: false,
        edit: false,
        content: comment.commentContent,
    });
    const editComment = useApi(apiClient.editComment.bind(apiClient));
    const deleteComment = useApi(apiClient.deleteCommentById.bind(apiClient));
    const toast = useToast();

    /**
     * Response for when text in the comment has changed
     * @param value The new text
     */
    const handleTextInputChange = (value: string) => {
        setState(prev => ({
            ...prev,
            content: value,
        }));
    };

    /**
     * Server's response for when the reply button is pressed
     */
    const handleReplyButtonClick = () => {
        setState(prev => ({ reply: !prev.reply, edit: false, content: comment.commentContent }));
    };

    /**
     * Server's response for when the edit button is pressed
     */
    const handleEditButtonClick = () => {
        setState(prev => ({ reply: false, edit: !prev.edit, content: comment.commentContent }));
    };


    /**
     * Server's response to deleting a comment
     */
    const deleteCommentCallback = () => {
        toast({
            title: 'Deleted comment successfully',
            description: `Comment ID: ${comment._id}`,
            status: 'success',
        });
    };

    /**
     * Server's response to an error being thrown in the process of deleting a comment
     * @param error The error caused in the process of deleting a comment
     */
    const deleteCommentError = (error: string) => {
        toast({
            title: 'Unable to delete the comment',
            description: error,
            status: 'error',
        })
    };

    /**
     * Server's response to editing a comment
     */
    const editCommentCallback = () => {
        toast({
            title: 'Edited comment successfully',
            description: `Comment ID: ${comment._id}`,
            status: 'success',
        });
        handleEditButtonClick();
    };

    /**
     * Server's response to an error being thrown in the process of editing a comment
     * @param error The error caused in the process of editing a comment
     */
    const editCommentError = (error: string) => {
        toast({
            title: 'Unable to edit the comment',
            description: error,
            status: 'error',
        });
    };

    /**
     * Wraps the servers response to deleting a comment
     */
    const deleteCommentWrapper = () => {
        const request: CommentDeleteRequest = {
            coveyTownID: currentTownID,
            sessionToken,
            commentID: comment._id || '',
        };
        deleteComment.request(request, deleteCommentCallback, deleteCommentError);
    };

    /**
     * Wraps the servers response to editing a comment
     */
    const editComentWrapper = () => {
        const request: CommentUpdateRequest = {
            coveyTownID: currentTownID,
            sessionToken,
            commentID: comment._id || '',
            comment: {
                ...comment,
                commentContent: state.content,
            },
        };
        editComment.request(request, editCommentCallback, editCommentError);
    };

    const commentBody = useMemo(() => {
        if (state.edit) {
            return (
                <Textarea
                    placeholder="Text (optional)"
                    height='100px'
                    width='100%'
                    value={state.content}
                    onChange={({ target }) => handleTextInputChange(target.value)}
                />);
        }
        return (<Text fontSize='sm'
            width='100%'
            paddingLeft='5px'
            maxHeight='180px'
            overflow='auto'
            overflowX='hidden'
            fontFamily='Arial'>
            {comment.commentContent}
        </Text>);
    }, [comment.commentContent, state.content, state.edit]);

    return (
        <Box width='500px'>
            <Box marginLeft={`${8 * depth}px`} width={500 - 8 * depth}>
                <Text fontSize='xs' width='100%'>
                    Commented by <Text display='inline' color='cyan.500'> u/{comment.ownerID}</Text> ·
                    {calculateTimeDifference(comment.createdAt)}{comment.updatedAt !== comment.createdAt && `* (last edited ${calculateTimeDifference(comment.updatedAt)})`}
                </Text>
                <Box d='block' width='100%' borderLeft='2px solid' borderLeftColor='rgba(128, 128, 128, 0.5)'>
                    {commentBody}
                    <ButtonGroup justifyContent='end' width='100%' marginTop='10px' variant='outline'>
                        {!state.edit && !state.reply && !comment.isDeleted
                            ?
                            <Button size='xs' colorScheme='blue' onClick={handleReplyButtonClick}>Reply</Button>
                            : <></>}
                        {!state.edit && !state.reply && userName === comment.ownerID && !comment.isDeleted
                            ?
                            <Button size='xs' colorScheme='blue' onClick={handleEditButtonClick}>Edit</Button>
                            :
                            <></>}
                        {!state.edit && !state.reply && userName === comment.ownerID && !comment.isDeleted
                            ?
                            <PopOverButton apply={deleteCommentWrapper} button={<Button size='xs' colorScheme='red'>Delete</Button>} />
                            :
                            <></>}
                        {state.edit
                            ?
                            <Button size='xs' onClick={handleEditButtonClick}>Cancel</Button>
                            : <></>}
                        {state.edit
                            ?
                            <PopOverButton apply={editComentWrapper} button={<Button size='xs' colorScheme='blue'>Commit</Button>} />
                            :
                            <></>}
                    </ButtonGroup>
                </Box>
            </Box>
            {state.reply ? <CreateComment postID={comment.rootPostID} commentID={comment._id} cancel={handleReplyButtonClick} successCallback={handleReplyButtonClick} /> : <></>}
        </Box>
    )
}
