import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { VStack, HStack, StackDivider, Text, Heading, Button, useToast, Flex, CloseButton, Textarea, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody } from '@chakra-ui/react';
import useApi from './useApi';
import useComments from '../../../hooks/useComments';
import useCoveyAppState from '../../../hooks/useCoveyAppState';
import Post from '../../../classes/Post';
import CreateComment from './CreateComment';
import Comments from './Comments';
import { ServerComment } from '../../../classes/Comment';
import { PostDeleteRequest, PostUpdateRequest, CommentsGetByPostIdRequest } from '../../../classes/TownsServiceClient';

interface ReadPostProps {
    post: Post;
    closeReadPost: () => void;
}

interface MimeTypeProps {
    mimetype: string;
    source: string;
}

type CreatePostStates = {
    content: string;
    edit: boolean,
}

// Post should be rerender when post is updated through socket
export default function ReadPost({ post, closeReadPost }: ReadPostProps): JSX.Element {
    const [state, setState] = useState<CreatePostStates>({
        content: post.postContent,
        edit: false,
    });
    const { currentTownFriendlyName, userName, currentTownID, sessionToken, apiClient, socket } = useCoveyAppState();
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { comments, setComments } = useComments();
    const getComments = useApi(apiClient.getCommentsByPostID.bind(apiClient));
    const deletePost = useApi(apiClient.deletePostById.bind(apiClient));
    const editPost = useApi(apiClient.editPost.bind(apiClient));
    const toast = useToast();

    function calculateHourDifference(): number | string {
        if (post.createAt) {
            return Math.round((new Date().getTime() - new Date(post.createAt).getTime()) / 36e5);
        }
        return 'unknown';
    };

    const handleTextInputChange = (value: string, field: string) => {
        setState(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleEditButtonClick = () => {
        setState(prev => ({
            content: post.postContent,
            edit: !prev.edit,
        }));
    };

    const getCommentsCallback = (result: ServerComment[]) => {
        toast({
            title: 'Retrieved post successfully',
            description: `Post ID: ${post.id}, Posted By: ${post.ownerId}, Comments: ${result.length}`,
            status: 'success',
        });
        if (setComments) setComments(result);
    };

    const getCommentsError = (error: string) => {
        toast({
            title: 'Unable to get comments for this post',
            description: error,
            status: 'error',
        });
    };

    const deletePostCallback = () => {
        toast({
            title: 'Deleted Post successfully',
            description: `Post ID: ${post.id}`,
            status: 'success',
        });
        closeReadPost();
    };

    const deletePostCallError = (error: string) => {
        toast({
            title: 'Unable to delete the post',
            description: error,
            status: 'error',
        });
    };

    const editPostCallback = () => {
        toast({
            title: 'Edited post successfully',
            description: `Post ID: ${post.id}`,
            status: 'success',
        });
        handleEditButtonClick();
    };

    const editPostError = (error: string) => {
        toast({
            title: 'Unable to edit the post',
            description: error,
            status: 'error',
        });
    };

    const getCommentsWrapper = useCallback(() => {
        const request: CommentsGetByPostIdRequest = {
            coveyTownID: currentTownID,
            sessionToken,
            postID: post.id || '',
        };
        getComments.request(request, getCommentsCallback, getCommentsError);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentTownID, post.id, sessionToken]);

    const deletePostWrapper = () => {
        const request: PostDeleteRequest = {
            coveyTownID: currentTownID,
            sessionToken,
            postID: post.id || '',
        };
        deletePost.request(request, deletePostCallback, deletePostCallError);
    };

    const editPostWrapper = () => {
        const request: PostUpdateRequest = {
            coveyTownID: currentTownID,
            sessionToken,
            postID: post.id || '',
            post: {
                ...post.toServerPost(),
                postContent: state.content || '',
            },
            deletePrevFile: false
        };
        editPost.request(request, editPostCallback, editPostError);
    };

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

    const handleCloseButtonClick = async () => {
        onClose();
        closeReadPost();
    };

    useEffect(() => {
        onOpen();
    }, [onOpen]);


    function MultiMediaDisplay({ mimetype, source }: MimeTypeProps): JSX.Element {
        const mediaType = mimetype.split('/')[0];
        switch (mediaType) {
            case 'video':
                return <video width="320" height="240" controls>
                    <source src={source} type={mimetype} />
                    Your browser does not support the video tag.
                    <track kind="captions" />
                </video>
            case 'audio':
                return <audio controls>
                    <source src={source} type={mimetype} />
                    Your browser does not support the audio tag.
                    <track kind="captions" />
                </audio>
            case 'image':
                return <img src={source} alt="Not available" />
            case 'text':
            case 'application':
                return <embed src={source} width="500" height="375" type={mimetype} />
            case "":
                return <></>
            default:
                return <Text>File type is not supported!</Text>
        }
    }

    const postBody = useMemo(() => {
        if (state.edit) {
            return (
                <Textarea
                    placeholder='Text (optional)'
                    resize='vertical'
                    height='250px'
                    width='500px'
                    maxHeight='350px'
                    value={state.content}
                    onChange={({ target }) => handleTextInputChange(target.value, 'content')} />
            );
        }
        return (<>
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
        </>);
    }, [post.file, post.postContent, post.title, state.content, state.edit]);


    return (
        <Modal onClose={handleCloseButtonClick} size='xl' isOpen={isOpen} scrollBehavior='inside'>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{`Post In Town: ${currentTownFriendlyName}`}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <VStack
                        height='100%'
                        padding='10px'
                        border='2px'
                        borderWidth='0.5px'
                        borderStyle='dashed'
                        borderColor='gray.500'
                        borderRadius='8px'
                        divider={<StackDivider borderColor='gray.500' />}>
                        <VStack padding='1px' align='start' width='500px'>
                            <Text fontSize='sm'> Posted by u/{post.ownerId} · {calculateHourDifference()} hours ago</Text>
                            {postBody}
                            <HStack width='100%'>
                                <Text width='115px' fontSize='sm'>
                                    {`${getComments.data?.length || 0} Comments`}
                                </Text>
                                <HStack justify='end' width='100%'>
                                    {!state.edit && userName === post.ownerId ? <Button size='sm' onClick={deletePostWrapper}>Delete</Button> : <></>}
                                    {!state.edit && userName === post.ownerId ? <Button size='sm' onClick={handleEditButtonClick}>Edit</Button> : <></>}
                                    {state.edit && userName === post.ownerId ? <Button size='sm' onClick={handleEditButtonClick}>Cancel</Button> : <></>}
                                    {state.edit ? <Button size='sm' onClick={editPostWrapper}>Commit</Button> : <></>}
                                </HStack>
                            </HStack>
                        </VStack>
                        <CreateComment postID={post.id || ''} />
                        <Comments comments={comments} />
                    </VStack>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}