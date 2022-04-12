import React, { useState, ChangeEvent } from "react";
import { VStack, Text, Box, HStack, Flex, Button, Textarea, useToast } from "@chakra-ui/react";
import { ServerComment, CommentCreateRequest } from '../../classes/TownsServiceClient';
// Hooks
import useCoveyAppState from '../../hooks/useCoveyAppState';

export interface CommentType {
    "_id": string;
    "rootPostID": string;
    "parentCommentID": string;
    "ownerID": string;
    "commentContent": string;
    "isDeleted": boolean;
    "createdAt": string;
    "updatedAt": string;
    "comments": CommentType[];
}

export interface CommentProps {
    comment: ServerComment;
    depth: number;
}

type CommentStates = {
    reply: boolean;
    content: string;
    valid: boolean;
    committing: boolean;
}

const initalState = {
    reply: false,
    content: '',
    valid: false,
    committing: false,
}

export default function Comment({ comment, depth }: CommentProps): JSX.Element {
    const { userName, currentTownID, sessionToken, apiClient } = useCoveyAppState();
    const [commentStates, setCommentStates] = useState<CommentStates>(initalState);
    const toast = useToast();

    function createMargin(counts: number): JSX.Element {
        return <Box width={5 * counts} />
    }

    function calculateHourDifference() {
        if (comment.createdAt) {
            return Math.round((new Date().getTime() - new Date(comment.createdAt).getTime()) / 36e5);
        }
        return 'unknown';
    }

    const checkValidInput = () => {
        setCommentStates((prev: CommentStates) => ({
            ...prev,
            valid: prev.content.length > 0,
        }));
    }

    const handleTextAreaInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const { target } = e;
        setCommentStates((prev: CommentStates) => ({
            ...prev,
            content: target.value,
        }));
        checkValidInput();
    }

    const toggleReplyButton = () => {
        setCommentStates((prev: CommentStates) => ({
            ...initalState,
            reply: !prev.reply,
        }));
    }

    const toggleButtonLoading = () => {
        setCommentStates((prev: CommentStates) => ({
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
                rootPostID: comment.rootPostID,
                parentCommentID: comment._id || '',
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
        <HStack align='start' width='500px'>
            {createMargin(depth || 0)}
            <Box width='100%'>
                <Text fontSize='xs'>
                    Commented by <Text display='inline' color='cyan.500'> u/{comment.ownerID}</Text> · {calculateHourDifference()} hours ago
                </Text>
                <Flex width='100%'>
                    <HStack width='100%'>
                        <Box height='100%' width='16px' borderRight='2px solid' borderRightColor='rgba(128, 128, 128, 0.5)' />
                        <VStack width='100%' align='start'>
                            <Text fontSize='sm' fontFamily='Arial' >{comment.commentContent}</Text>
                            <HStack justify='end' width='100%'>
                                <Button size='xs' onClick={toggleReplyButton}>Reply</Button>
                                <Button size='xs'>Edit</Button>
                                <Button size='xs'>Hide</Button>
                                <Button size='xs'>Delete</Button>
                            </HStack>
                            {commentStates.reply ?
                                <><Textarea height='100'
                                    resize='none'
                                    value={commentStates.content}
                                    placeholder='What are your thoughts?'
                                    onChange={handleTextAreaInputChange} />
                                    <Button onClick={handleCommitButtonClick} alignSelf='end' size="sm">Comment</Button></> : undefined}
                        </VStack>
                    </HStack>
                </Flex>
            </Box>
        </HStack>
    )
}
