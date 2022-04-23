import React, { useState, useMemo } from "react";
import { VStack, Text, Box, HStack, Flex, Button, Textarea, useToast } from "@chakra-ui/react";
import useApi from './useApi';
import useCoveyAppState from '../../../hooks/useCoveyAppState';
import CreateComment from "./CreateComment";
import { ServerComment } from '../../../classes/Comment'; 
import { CommentDeleteRequest, CommentUpdateRequest } from '../../../classes/TownsServiceClient';

export interface CommentProps {
    comment: ServerComment;
    depth: number;
}

type CommentStates = {
    reply: boolean;
    edit: boolean;
    content: string;
}

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

    function calculateHourDifference(date: Date | undefined) {
        if (date) {
            return Math.round((new Date().getTime() - new Date(date).getTime()) / 36e5);
        }
        return 'unknown';
    }

    const handleTextInputChange = (value: string) => {
        setState(prev => ({
            ...prev,
            content: value,
        }));
    };

    const handleReplyButtonClick = () => {
        setState(prev => ({ reply: !prev.reply, edit: false, content: comment.commentContent }));
    };

    const handleEditButtonClick = () => {
        setState(prev => ({ reply: false, edit: !prev.edit, content: comment.commentContent }));
    };

    const deleteCommentCallback = () => {
        toast({
            title: 'Deleted comment successfully',
            description: `Comment ID: ${comment._id}`,
            status: 'success',
        });
    };

    const deleteCommentError = (error: string) => {
        toast({
            title: 'Unable to delete the comment',
            description: error,
            status: 'error',
        })
    };

    const editCommentCallback = () => {
        toast({
            title: 'Edited comment successfully',
            description: `Comment ID: ${comment._id}`,
            status: 'success',
        });
        console.log(comment.updatedAt);
        console.log(comment.createdAt);
        handleEditButtonClick();
    };

    const editCommentError = (error: string) => {
        toast({
            title: 'Unable to edit the comment',
            description: error,
            status: 'error',
        });
    };

    const deleteCommentWrapper = () => {
        const request: CommentDeleteRequest = {
            coveyTownID: currentTownID,
            sessionToken,
            commentID: comment._id || '',
        };
        deleteComment.request(request, deleteCommentCallback, deleteCommentError);
    };

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
                    height='150px'
                    width='100%'
                    value={state.content}
                    onChange={({ target }) => handleTextInputChange(target.value)}
                />);
        }
        return (<Text fontSize='sm' fontFamily='Arial' >{comment.commentContent}</Text>);
    }, [comment.commentContent, state.content, state.edit]);

    return (
        <VStack align='center' width='500px'>
            <Box alignSelf='end' width={500 - 8 * depth}>
                <Text fontSize='xs'>
                    Commented by <Text display='inline' color='cyan.500'> u/{comment.ownerID}</Text> · 
                    {calculateHourDifference(comment.createdAt)} hours ago{comment.updatedAt !== comment.createdAt && `* (last edited ${calculateHourDifference(comment.updatedAt)} hours ago)`}
                </Text>
                <Flex width='100%'>
                    <HStack width='100%'>
                        <Box height='100%' width='16px' borderRight='2px solid' borderRightColor='rgba(128, 128, 128, 0.5)' />
                        <VStack width='100%' align='start'>
                            {commentBody}
                            <HStack justify='end' width='100%'>
                                {!state.edit && !state.reply && !comment.isDeleted ? <Button size='xs' onClick={handleReplyButtonClick}>Reply</Button> : <></>}
                                {!state.edit && !state.reply && userName === comment.ownerID && !comment.isDeleted ? <Button size='xs' onClick={handleEditButtonClick}>Edit</Button> : <></>}
                                {!state.edit && !state.reply && userName === comment.ownerID && !comment.isDeleted ? <Button size='xs' onClick={deleteCommentWrapper}>Delete</Button> : <></>}
                                {state.edit ? <Button size='xs' onClick={handleEditButtonClick}>Cancel</Button> : <></>}
                                {state.edit ? <Button size='xs' onClick={editComentWrapper}>Commit</Button> : <></>}
                            </HStack>
                        </VStack>
                    </HStack>
                </Flex>
            </Box>
            {state.reply ? <CreateComment postID={comment.rootPostID} commentID={comment._id} cancel={handleReplyButtonClick} successCallback={handleReplyButtonClick} /> : <></>}
        </VStack>
    )
}
