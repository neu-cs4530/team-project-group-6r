/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { VStack, Input, Textarea, Button, Flex, useToast, CloseButton, Container, Text } from '@chakra-ui/react';
import useCoveyAppState from '../../../hooks/useCoveyAppState';
import { Coordinate } from '../../../classes/Post';
import { ServerPost, FileUploadResponse, PostCreateRequest, FileUploadRequest } from '../../../classes/TownsServiceClient';
import useApi from './useApi';

interface CreatePostProps {
    coordinate: Coordinate;
    closeCreatePost: () => void;
}

type CreatePostStates = {
    title: string;
    content: string;
}

const initalState = {
    title: '',
    content: '',
}

const dropZoneStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    padding: '20px',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#eeeeee',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    color: '#bdbdbd',
    outline: 'none',
    transition: 'border .24s ease-in-out'
};

export default function CreatePost({ coordinate, closeCreatePost }: CreatePostProps): JSX.Element {
    const { userName, currentTownID, sessionToken, apiClient } = useCoveyAppState();
    const [postStates, setPostStates] = useState<CreatePostStates>(initalState);
    const createPost = useApi(apiClient.createPost.bind(apiClient));
    // const uploadFile = useApi(apiClient.createFile.bind(apiClient));
    const { acceptedFiles, getRootProps, getInputProps, open } = useDropzone({
        noClick: true,
        noKeyboard: true,
        maxFiles: 1,
    });
    const toast = useToast();

    const handleTextInputChange = (value: string, field: string) => {
        setPostStates((prev: CreatePostStates) => ({
            ...prev,
            [field]: value,
        }));
    };

    const createPostCallback = (result: ServerPost) => {
        toast({
            title: 'Created post successfully',
            description: `Post ID: ${result._id}, Title: ${result.title}`,
            status: 'success',
        });
        closeCreatePost();
    };

    const createPostError = (error: string) => {
        toast({
            title: 'Unable to create the post',
            description: error,
            status: 'error',
        });
    };

    const uploadFileCallback = (result: FileUploadResponse) => {
        toast({
            title: 'Uploaded file successfully',
            description: `File Name: ${result.fileName}, Size: ${result.size}`,
            status: 'success',
        });
    };

    const uploadFileError = (error: string) => {
        toast({
            title: 'Unable to create the post',
            description: error,
            status: 'error',
        });
    };

    const handleCommitButtonClick = async () => {
        const postRequest : PostCreateRequest = {
            coveyTownID: currentTownID,
            sessionToken,
            post: {
                title: postStates.title,
                postContent: postStates.content,
                ownerID: userName,
                isVisible: true,
                coordinates: coordinate,
            },
            file: acceptedFiles[0],
        };
        createPost.request(postRequest, createPostCallback, createPostError);
    };

    useEffect(() => {
        if ((createPost.data !== undefined) && !createPost.loading) {
            closeCreatePost();
        }
    }, [closeCreatePost, createPost.data, createPost.loading]);

    return (
        <VStack
            padding={5}
            height='100%'
            border='2px'
            borderWidth='2px'
            borderColor='gray.500'
            borderRadius='8px'
            maxHeight='768px'>
            <Flex
                width='100%'
                direction='row'
                justify='space-between'
                align='center'>
                <Text>Post as <Text display='inline' color='tomato'>u/{userName}</Text></Text>
                <CloseButton marginLeft='auto' size='lg' onClick={closeCreatePost} />
            </Flex>
            <VStack>
                <Input
                    placeholder='Title'
                    size='md'
                    value={postStates.title}
                    onChange={({ target }) => handleTextInputChange(target.value, 'title')} />
                <Textarea
                    placeholder='Text (optional)'
                    resize='vertical'
                    height='250px'
                    width='450px'
                    maxHeight='450px'
                    value={postStates.content}
                    onChange={({ target }) => handleTextInputChange(target.value, 'content')} />
            </VStack>
            <Container>
                <div {...getRootProps({ style: dropZoneStyle })}>
                    <input {...getInputProps()} />
                    <Text display='inline'>Drag and Drop some files</Text>
                    <Button display='inline' colorScheme='teal' size='xs' onClick={open} >
                        Open File Dialog
                    </Button>
                </div>
                <Text fontSize='sm'>{acceptedFiles[0] ? `Name File: ${acceptedFiles[0].name}` : ''}</Text>
                <Text fontSize='sm'>{acceptedFiles[0] ? `Size (bytes): ${acceptedFiles[0].size}` : ''}</Text>
            </Container>
            <Flex
                width='100%'
                direction='row'
                justify='flex-end'>
                <Button isLoading={createPost.loading} loadingText="Committing" onClick={handleCommitButtonClick}>Commit</Button>
            </Flex>
        </VStack>
    );
}
