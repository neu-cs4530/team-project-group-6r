import React, { useState } from 'react';
import { VStack, Text, Textarea, Button, useToast, HStack } from '@chakra-ui/react';
import useCoveyAppState from '../../../hooks/useCoveyAppState';
import { CommentCreateRequest, ServerComment } from '../../../classes/TownsServiceClient';
import useApi from './useApi';

/**
 * The properties of creating a comment
 */
export interface CreateCommentProps {
    postID: string;
    commentID?: string;
    cancel?: () => void;
    successCallback?: () => void;
    errorCallback?: () => void;
}

/**
 * What a comment can contain, which is just a string
 */
type CreateCommentStates = {
    content: string;
}

/**
 * The initial value of a comment, an empty string
 */
const initalState = {
    content: '',
}

/**
 * Helper function used by the Comment element to succesfully create a comment, and handle any errors
 * @returns The created comment
 */
export default function CreateComment({ postID, commentID, cancel, successCallback, errorCallback }: CreateCommentProps) {
    const { userName, currentTownID, sessionToken, apiClient } = useCoveyAppState();
    const [commentStates, setCommentStates] = useState<CreateCommentStates>(initalState);
    const createComment = useApi(apiClient.createComment.bind(apiClient));
    const toast = useToast();

    /**
     * Response for when text in the comment has changed
     * @param value The new text
     */
    const handleTextInputChange = (value: string) => {
        setCommentStates((prev: CreateCommentStates) => ({
            ...prev,
            content: value,
        }));
    };

    /**
     * Server's response to creating a comment
     * @param result The message the server sends on if the comment was created succesfully
     */
    const createCommentCallback = (result: ServerComment) => {
        toast({
            title: 'Created comment successfully',
            description: `Comment ID: ${result._id}, Parent Post Id: ${result.rootPostID}`,
            status: 'success',
        });
        if (successCallback) successCallback();
        setCommentStates({ content: '' });
    };

    /**
     * Server's response to an error being thrown in the process of creating a comment
     * @param error The error caused in the process of creating a comment
     */
    const createCommentError = (error: string) => {
        toast({
            title: 'Unable to create the comment',
            description: error,
            status: 'error',
        });
        if (errorCallback) errorCallback();
    };

    /**
     * Server's response for when the commit (basically, submit your comment) button is pressed
     */
    const handleCommitButtonClick = async () => {
        const request: CommentCreateRequest = {
            coveyTownID: currentTownID,
            sessionToken,
            comment: {
                rootPostID: postID,
                parentCommentID: commentID || '',
                ownerID: userName,
                commentContent: commentStates.content,
                isDeleted: false,
            }
        };
        createComment.request(request, createCommentCallback, createCommentError);
    };

    return (
        <VStack
            width='500px'
            align='start'>
            <Text>Comment as <Text display='inline' color='tomato'>u/{userName}</Text></Text>
            <Textarea height='140'
                resize='none'
                placeholder='What are your thoughts?'
                value={commentStates.content}
                onChange={({ target }) => handleTextInputChange(target.value)} />
            <HStack width="100%" justify='end' align='center'>
                {cancel ? <Button size='sm' onClick={cancel}>Cancel</Button> : <></>}
                <Button size='sm' isLoading={createComment.loading} onClick={handleCommitButtonClick}>Comment</Button>
            </HStack>
        </VStack>
    );
}