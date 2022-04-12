import React, { useState, ChangeEvent } from 'react';
import { VStack, Text, Textarea, Button, useToast } from '@chakra-ui/react';
// Hooks
import useCoveyAppState from '../../hooks/useCoveyAppState';
// API
import { CommentCreateRequest } from '../../classes/TownsServiceClient';

interface CreateCommentProps {
    postID: string;
}

type CreateCommentStates = {
    content: string;
    valid: boolean;
    committing: boolean;
}

const initalState = {
    content: '',
    valid: false,
    committing: false,
}

export default function CreateComment({ postID }: CreateCommentProps) {
    const { userName, currentTownID, sessionToken, apiClient } = useCoveyAppState();
    const [commentStates, setCommentStates] = useState<CreateCommentStates>(initalState);
    const toast = useToast();

    const checkValidInput = () => {
        setCommentStates((prev: CreateCommentStates) => ({
            ...prev,
            valid: prev.content.length > 0,
        }));
    }

    const handleTextAreaInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const { target } = e;
        setCommentStates((prev: CreateCommentStates) => ({
            ...prev,
            content: target.value,
        }));
        checkValidInput();
    }

    const toggleButtonLoading = () => {
        setCommentStates((prev: CreateCommentStates) => ({
            ...prev,
            committing: !prev.committing,
        }));
    }


    const handleCommitButtonClick = async () => {
        toggleButtonLoading();
        const commentCreateRequest: CommentCreateRequest = {
            coveyTownID: currentTownID,
            sessionToken,
            comment: {
                rootPostID: postID,
                parentCommentID: '',
                ownerID: userName,
                commentContent: commentStates.content,
                isDeleted: false,
            }
        }
        try {
            const result = await apiClient.createComment(commentCreateRequest);
            toast({
                title: 'Created Comment successfully',
                description: `Comment ID: ${result._id}`,
                status: 'success',
            });
        } catch (e: unknown) {
            if (e instanceof Error) {
                toast({
                    title: 'Unable Create the Comment',
                    description: e.message,
                    status: 'error',
                });
            }
        }
        setCommentStates(initalState);
    }

    return (
        <VStack
            width='500px'
            align='start'>
            <Text>Comment as <Text display='inline' color='tomato'>{userName}</Text></Text>
            <Textarea height='140'
                resize='none'
                placeholder='What are your thoughts?'
                value={commentStates.content}
                onChange={handleTextAreaInputChange} />
            <Button isDisabled={!commentStates.valid} isLoading={commentStates.committing} alignSelf='end' onClick={handleCommitButtonClick}>Comment</Button>
        </VStack>
    )
}