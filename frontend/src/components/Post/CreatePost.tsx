import React, { ChangeEvent, useState } from 'react';
import { VStack, HStack, StackDivider, Input, Textarea, Button, Flex, useToast } from '@chakra-ui/react';
// Class
import { Coordinate } from '../../classes/Post';
// Hooks
import useCoveyAppState from '../../hooks/useCoveyAppState';
// API
import { PostCreateRequest } from '../../classes/TownsServiceClient';

interface CreatePostProps {
    coordinate: Coordinate;
}

type CreatePostStates = {
    title: string;
    content: string;
    valid: boolean;
    committing: boolean;
}

const initalState = {
    title: '',
    content: '',
    valid: false,
    committing: false,
}

export default function CreatePost({ coordinate }: CreatePostProps): JSX.Element {
    const { userName, currentTownID, sessionToken, apiClient } = useCoveyAppState();
    const [postStates, setPostStates] = useState<CreatePostStates>(initalState);
    const toast = useToast();


    const checkValidInput = () => {
        setPostStates((prev: CreatePostStates) => ({
            ...prev,
            valid: prev.title.length > 0 && prev.content.length > 0,
        }));
    }

    const handleTileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { target } = e;
        setPostStates((prev: CreatePostStates) => ({
            ...prev,
            title: target.value,
        }));
        checkValidInput();
    }

    const handleTextAreaInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const { target } = e;
        setPostStates((prev: CreatePostStates) => ({
            ...prev,
            content: target.value,
        }));
        checkValidInput();
    }

    const toggleButtonLoading = () => {
        setPostStates((prev: CreatePostStates) => ({
            ...prev,
            committing: !prev.committing,
        }));
    }

    const handleCommitButtonClick = async () => {
        toggleButtonLoading();
        const postCreateRequest: PostCreateRequest = {
            coveyTownID: currentTownID,
            sessionToken,
            post: {
                title: postStates.title,
                postContent: postStates.content,
                ownerID: userName,
                isVisible: true,
                coordinates: coordinate,
            }
        }
        try {
            const result = await apiClient.createPost(postCreateRequest);
            toast({
                title: 'Created Post successfully',
                description: `Post ID: ${result._id}, Title: ${result.title}`,
                status: 'success',
            });
            setPostStates(initalState);
        } catch (e: unknown) {
            if (e instanceof Error) {
                toast({
                    title: 'Unable Create the Post',
                    description: e.message,
                    status: 'error',
                });
            }
        }
    }

    // const 
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
                justify='flex-start'>
                <HStack
                    divider={<StackDivider borderColor='gray.200' />}>
                    <Button>
                        Post
                    </Button>
                    <Button>
                        Images & Video
                    </Button>
                    <Button>
                        Talk
                    </Button>
                </HStack>
            </Flex>
            <VStack>
                <Input
                    placeholder='Title'
                    size='md'
                    value={postStates.title}
                    onChange={handleTileInputChange} />
                <Textarea
                    placeholder='Text (optional)'
                    resize='vertical'
                    height='250px'
                    width='450px'
                    maxHeight='585px'
                    value={postStates.content}
                    onChange={handleTextAreaInputChange} />
            </VStack>
            <Flex
                width='100%'
                direction='row'
                justify='flex-end'>
                <Button isDisabled={!postStates.valid} isLoading={postStates.committing} loadingText="Committing" onClick={handleCommitButtonClick}>Commit</Button>
            </Flex>
        </VStack>
    );
}