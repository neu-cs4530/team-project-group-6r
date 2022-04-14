import React, { useEffect, useState } from 'react';
import { VStack, HStack, StackDivider, Text, Heading, Button, useToast } from '@chakra-ui/react';
// Object
import PostObj from '../../classes/Post';
// Components
import CreateComment from './CreateComment';
import Comments from './Comments';
// Hooks
import useCoveyAppState from '../../hooks/useCoveyAppState';
// API
import { PostGetRequest, ServerComment } from '../../classes/TownsServiceClient';

interface PostProps {
    post: PostObj;
}

// TODO:
// Post should be rerender when post is updated through socket
export default function Post({ post }: PostProps): JSX.Element {
    const [comments, setComments] = useState<ServerComment[]>([]);
    const { currentTownID, sessionToken, apiClient } = useCoveyAppState();
    const toast = useToast();

    useEffect(() => {
        async function fetchComments() {
            const postGetRequest : PostGetRequest = {
                coveyTownID: currentTownID,
                sessionToken,
                postID: post.id || '',
            };
            try {
                const result = await apiClient.getCommentsByPostID(postGetRequest);
                setComments(result);
            } catch (e : unknown) {
                if (e instanceof Error) {
                    toast({
                        title: 'Unable To Get Comments For This Post',
                        description: e.message,
                        status: 'error',
                    });
                }
            }
        }
        fetchComments();
    }, [apiClient, currentTownID, post.id, sessionToken, toast]);

    function calculateHourDifference(): number | string {
        if (post.createAt) {
            return Math.round((new Date().getTime() - new Date(post.createAt).getTime()) / 36e5);
        }
        return 'unknown';
    }

    return (
        <VStack padding={5}
            height='100%'
            border='2px'
            borderWidth='2px'
            borderColor='gray.500'
            borderRadius='8px'
            maxHeight='768px'
            divider={<StackDivider borderColor='gray.200' />}>
            <VStack align='start'
                width='500px'>
                <Text fontSize='sm'>
                    `Posted by u/{post.ownerId} · {calculateHourDifference()} hours ago
                </Text>
                <Heading as='h4'
                    size='md'>
                    {post.title}
                </Heading>
                <Text fontSize='md'
                    maxHeight='145px'
                    overflow='auto'
                    overflowX='hidden'
                    fontFamily='Arial'
                    paddingRight='5px'>
                    {post.postContent}
                </Text>
                <HStack
                    width='100%'>
                    <Text width='115px' fontSize='sm'>
                        {`${post.comments?.length || 0} Comments`}
                    </Text>
                    <HStack justify='end' width='100%'>
                        <Button size='sm'>Delete</Button>
                        <Button size='sm'>Hide</Button>
                        <Button size='sm'>Edit</Button>
                    </HStack>
                </HStack>
            </VStack>
            <CreateComment postID={post.id || ''} />
            <Comments comments={comments} />
        </VStack>
    )
}