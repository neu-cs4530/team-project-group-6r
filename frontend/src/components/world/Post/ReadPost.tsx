import React, { useCallback, useMemo, useEffect } from 'react';
import { Box, Text, useToast, Heading, Button, VStack, HStack, StackDivider } from '@chakra-ui/react';
import useComments from '../../../hooks/useComments';
import useCoveyAppState from '../../../hooks/useCoveyAppState';
import Post from '../../../classes/Post';
import { ServerComment } from '../../../classes/Comment';
import { CommentsGetByPostIdRequest, PostDeleteRequest } from '../../../classes/TownsServiceClient';
import calculateTimeDifference from '../../../Util';
import useApi from './useApi';
import CreateComment from './CreateComment';
import Comments from './Comments';
import PopOverButton from './PopOverButton';

/**
 * The properties of reading a post on your screen
 */
interface ReadPostProps {
    post: Post;
    toggleEdit: () => void;
    closeReadPost: () => void;
}

interface MimeTypeProps {
    mimetype: string;
    source: string;
}

export default function ReadPost({ post, toggleEdit, closeReadPost }: ReadPostProps): JSX.Element {
    const { userName, currentTownID, sessionToken, apiClient, socket } = useCoveyAppState();
    const getComments = useApi(apiClient.getCommentsByPostID.bind(apiClient));
    const deletePost = useApi(apiClient.deletePostById.bind(apiClient));
    const { comments, setComments } = useComments();
    const toast = useToast();

    const getCommentsCallback = (result: ServerComment[]) => {
        toast({
            title: 'Retrieved post successfully',
            description: `Post ID: ${post.id}, Posted By: ${post.ownerId}, Comments: ${result.length}`,
            status: 'success',
        });
        if (setComments) setComments(result);
    };

    /**
     * Server's response to an error being thrown in the process of getting comments under a post
     * @param error The error caused in the process of getting comments under a post
     */
    const getCommentsError = (error: string) => {
        toast({
            title: 'Unable to get comments for this post',
            description: error,
            status: 'error',
        });
    };

    const deletePostCallback = useCallback(() => {
        toast({
            title: 'Deleted Post successfully',
            description: `Post ID: ${post.id}`,
            status: 'success',
        });
        closeReadPost();
    }, [closeReadPost, post.id, toast]);

    const deletePostCallError = useCallback((error: string) => {
        toast({
            title: 'Unable to delete the post',
            description: error,
            status: 'error',
        });
    }, [toast]);

    const deletePostWrapper = useCallback(() => {
        const request: PostDeleteRequest = {
            coveyTownID: currentTownID,
            sessionToken,
            postID: post.id || '',
        };
        deletePost.request(request, deletePostCallback, deletePostCallError);
    }, [currentTownID, deletePost, deletePostCallError, deletePostCallback, post.id, sessionToken]);

    const getCommentsWrapper = useCallback(() => {
        const request: CommentsGetByPostIdRequest = {
            coveyTownID: currentTownID,
            sessionToken,
            postID: post.id || '',
        };
        getComments.request(request, getCommentsCallback, getCommentsError);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentTownID, post.id, sessionToken]);


    useEffect(() => {
        socket?.emit('postOpen', post);
        return () => {
            socket?.emit('postClose', post);
            if (setComments) setComments([]);
        }
    }, [post, setComments, socket]);

    useEffect(() => {
        getCommentsWrapper();
    }, [getCommentsWrapper]);

    function MultiMediaDisplay({ mimetype, source }: MimeTypeProps): JSX.Element {
        const mediaType = mimetype.split('/')[0];
        switch (mediaType) {
            case 'video':
                return <video width="320" height="240" controls>
                    <source src={source} type={mimetype}/>
                    Your browser does not support the video tag.
                    <track kind="captions"/>
                </video>
                break;
            case 'audio':
                return <audio controls>
                    <source src={source} type={mimetype}/>
                    Your browser does not support the audio tag.
                    <track kind="captions"/>
                </audio>
                break;
            case 'image':
                return <img src={source} alt="Not available"/>
                break;
            case 'text':
            case 'application':
                return <embed src={source} width= "500" height= "375" type={mimetype}/>
                break;

            case "":
                return <></>
                break;
            default:
                return <Text>File type is not supported!</Text>
        }
    }

    const postBody = useMemo(() => (
        <Box width='100%'>
            <Heading as='h4' size='md' marginBottom='10px'>{post.title}</Heading>
            <MultiMediaDisplay source={`http://localhost:8081/image/${post.file?.filename}`} mimetype={post.file?.contentType} />
            <Text fontSize='md'
                maxHeight='145px'
                overflow='auto'
                overflowX='hidden'
                fontFamily='Arial'
                paddingRight='5px'>
                {post.postContent}
            </Text>
            <HStack justify='end' width='100%'>
                {userName === post.ownerId ? <PopOverButton apply={deletePostWrapper} button={<Button size='sm'>Delete</Button>} /> : <></>}
                {userName === post.ownerId ? <Button size='sm' onClick={toggleEdit}>Edit</Button> : <></>}
            </HStack>
        </Box>), [post.file?.contentType, post.file?.filename, post.ownerId, post.postContent, post.title, deletePostWrapper, toggleEdit, userName]);

    return (
        <VStack space='5px'
            align='start'
            divider={<StackDivider borderColor='gray.100' />}>
            <Text fontSize='sm'> Posted by u/{post.ownerId} · {calculateTimeDifference(post.createAt)}{post.updateAt !== post.createAt && `* (last edited ${calculateTimeDifference(post.updateAt)})`}</Text>
            {postBody}
            <CreateComment postID={post.id || ''} />
            <Comments comments={comments} />
        </VStack>
    )
}
