import React, { useState } from 'react';
import { VStack, Text, Textarea, Button, useToast, HStack } from '@chakra-ui/react';
import useCoveyAppState from '../../../hooks/useCoveyAppState';
import { CommentCreateRequest, ServerComment } from '../../../classes/TownsServiceClient';
import useApi from './useApi';

export interface CreateCommentProps {
    postID: string;
    commentID?: string;
    cancel?: () => void;
    successCallback?: () => void;
    errorCallback?: () => void;
}

type CreateCommentStates = {
    content: string;
}

const initalState = {
    content: '',
}

export default function CreateComment({ postID, commentID, cancel, successCallback, errorCallback }: CreateCommentProps) {
    const { userName, currentTownID, sessionToken, apiClient } = useCoveyAppState();
    const [commentStates, setCommentStates] = useState<CreateCommentStates>(initalState);
    const createComment = useApi(apiClient.createComment.bind(apiClient));
    const toast = useToast();

    const handleTextInputChange = (value: string) => {
        setCommentStates((prev: CreateCommentStates) => ({
            ...prev,
            content: value,
        }));
    };

    const createCommentCallback = (result: ServerComment) => {
        toast({
            title: 'Created comment successfully',
            description: `Comment ID: ${result._id}, Parent Post Id: ${result.rootPostID}`,
            status: 'success',
        });
        if (successCallback) successCallback();
        setCommentStates({ content: '' });
    };

    const createCommentError = (error: string) => {
        toast({
            title: 'Unable to create the comment',
            description: error,
            status: 'error',
        });
        if (errorCallback) errorCallback();
    };

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