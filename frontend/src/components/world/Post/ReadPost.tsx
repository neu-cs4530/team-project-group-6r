import React, { useState, useEffect, useCallback, useMemo, Fragment } from 'react';
import { VStack, HStack, StackDivider, Text, Heading, Button, useToast, Flex, CloseButton, Textarea } from '@chakra-ui/react';
import MDEditor from '@uiw/react-md-editor';
import useCoveyAppState from '../../../hooks/useCoveyAppState';
import Post from '../../../classes/Post';
import CreateComment from './CreateComment';
import Comments from './Comments';
import { ServerComment, PostDeleteRequest, PostUpdateRequest, CommentsGetByPostIdRequest, FileGetRequest } from '../../../classes/TownsServiceClient';
import useApi from './useApi';
import useComments from '../../../hooks/useComments';
import calculateTimeDifference from '../../../Util';


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
    const { userName, currentTownID, sessionToken, apiClient, socket } = useCoveyAppState();
    const { comments, setComments } = useComments();
    const getComments = useApi(apiClient.getCommentsByPostID.bind(apiClient));
    const deletePost = useApi(apiClient.deletePostById.bind(apiClient));
    const editPost = useApi(apiClient.editPost.bind(apiClient));
    const toast = useToast();

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
        };
        editPost.request(request, editPostCallback, editPostError);
    };

    useEffect(() => {
        socket?.emit('postOpen', post);
        console.log(post);
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

    const postBody = useMemo(() => {
        if (state.edit) {
            // return (<>
            //     <Textarea
            //         placeholder='Text (optional)'
            //         resize='vertical'
            //         height='250px'
            //         width='500px'
            //         maxHeight='350px'
            //         value={state.content}
            //         onChange={({ target }) => handleTextInputChange(target.value, 'content')} />
            // </>);
            return (
                <div className="container">
                <MDEditor
                    value={state.content}
                    onChange={( target ) => {
                        const text = target || '';
                        handleTextInputChange(text, 'content')
                    }}
                />
                <MDEditor.Markdown source={state.content} />
                </div>
            );
        }
        return (<>
            <Heading as='h4'
                size='md'>
                {post.title}
            </Heading>
            <MultiMediaDisplay source={`http://localhost:8081/image/${post.file?.filename}`} mimetype={post.file?.contentType}/>
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
                <Flex
                    width='100%'
                    direction='row'
                    justify='space-between'
                    align='center'>
                    <Text fontSize='sm'> Posted by u/{post.ownerId} · {calculateTimeDifference(post.createAt)}{post.updateAt !== post.createAt && `* (last edited ${calculateTimeDifference(post.updateAt)})`}</Text>
                    <CloseButton marginLeft='auto' size='lg' onClick={closeReadPost} />
                </Flex>
                {postBody}
                <HStack
                    width='100%'>
                    <Text width='115px' fontSize='sm'>
                        {`${getComments.data?.length || 0} Comments`}
                    </Text>
                    <HStack justify='end' width='100%'>
                        {!state.edit && userName === post.ownerId ? <Button size='sm' onClick={deletePostWrapper}>Delete</Button> : <></>}
                        {!state.edit ? <Button size='sm'>Hide</Button> : <></>}
                        {!state.edit && userName === post.ownerId ? <Button size='sm' onClick={handleEditButtonClick}>Edit</Button> : <></>}
                        {state.edit && userName === post.ownerId ? <Button size='sm' onClick={handleEditButtonClick}>Cancel</Button> : <></>}
                        {state.edit ? <Button size='sm' onClick={editPostWrapper}>Commit</Button> : <></>}
                    </HStack>
                </HStack>
            </VStack>
            <CreateComment postID={post.id || ''} />
            <Comments comments={comments} />
        </VStack>
    );
}