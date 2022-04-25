import React, { useState, useMemo } from 'react';
import { VStack, HStack, Input, Textarea, Text, CloseButton, useToast, Button } from '@chakra-ui/react';
import useCoveyAppState from '../../../hooks/useCoveyAppState';
import { Coordinate, ServerPost } from '../../../classes/Post';
import { PostCreateRequest } from '../../../classes/TownsServiceClient';
import { calculateBytes } from '../../../Util';
import FileForm from './FileForm';
import useApi from './useApi';

interface CreatePostProps {
    coordinates: Coordinate;
    closeCreatePost: () => void;
}

type CreatePostStates = {
    title: string,
    content: string;
    file?: File,
}

const initalState = {
    title: '',
    content: '',
    file: undefined,
}

export default function CreatePost({ coordinates, closeCreatePost }: CreatePostProps): JSX.Element {
    const { userName, currentTownID, sessionToken, apiClient } = useCoveyAppState();
    const [state, setState] = useState<CreatePostStates>(initalState);
    const createPost = useApi(apiClient.createPost.bind(apiClient));
    const toast = useToast();

    const handleTextInputChange = (value: string, field: string) => {
        setState((prev: CreatePostStates) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleRemoveFile = () => {
        setState((prev: CreatePostStates) => ({
            ...prev,
            file: undefined,
        }));
    }

    const handleAddFile: (file: File) => void = (file) => {
        setState((prev: CreatePostStates) => ({
            ...prev,
            file,
        }));
    }

    const createPostCallback = (result: ServerPost) => {
        toast({
            title: 'Created post successfully',
            description: `Post ID: ${result._id}, Title: ${result.title}, File: ${result.file.filename}`,
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

    const createPostWrapper = async () => {
        const postRequest: PostCreateRequest = {
            coveyTownID: currentTownID,
            sessionToken,
            post: {
                title: state.title,
                postContent: state.content,
                ownerID: userName,
                isVisible: true,
                coordinates,
                file: {
                    filename: '',
                    contentType: ''
                }
            },
            file: state.file,
        };
        createPost.request(postRequest, createPostCallback, createPostError);
    };

    const fileFooter = useMemo(() => {
        if (state.file) {
            return (
                <HStack alignItems='center' width='100%'>
                    <Text fontSize='xs'>{`File Type: ${state.file.type}, Size: ${calculateBytes(state.file.size)}`}</Text>
                    <CloseButton onClick={handleRemoveFile} alignSelf='end' size='sm' />
                </HStack>
            )
        }
        return <></>;
    }, [state.file]);

    return (
        <VStack space='5px'>
            <Text alignSelf='start' fontSize='sm'>Post as <Text display='inline' color='gray.400'>u/{userName}</Text></Text>
            <Input
                placeholder='Title'
                size='md'
                value={state.title}
                onChange={({ target }) => handleTextInputChange(target.value, 'title')} />
            <Textarea
                placeholder='Text (optional)'
                resize='vertical'
                height='250px'
                maxHeight='450px'
                value={state.content}
                onChange={({ target }) => handleTextInputChange(target.value, 'content')} />
            <FileForm setFile={handleAddFile} />
            {fileFooter}
            <HStack justify='end' width='100%'>
                <Button size='sm' onClick={closeCreatePost}>Cancel</Button>
                <Button size='sm' colorScheme="gray" isLoading={createPost.loading} loadingText="Committing" onClick={createPostWrapper}>Commit</Button>
            </HStack>
        </VStack>
    );
}