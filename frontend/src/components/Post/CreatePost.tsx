import React, { ChangeEvent, useState } from 'react';
import { VStack, HStack, StackDivider, Input, Textarea, Button, Flex } from '@chakra-ui/react';
// Class
import { Coordinate } from '../../classes/Post';
// API
import TownsServiceClient from '../../classes/TownsServiceClient';

interface CreatePostProps {
    coordinate: Coordinate;
    username: string
}

type CreatePostStates = {
    title: string;
    content: string;
    committing: boolean;
}

export default function CreatePost({ coordinate, username }: CreatePostProps): JSX.Element {
    const [postStates, setPostStates] = useState<CreatePostStates>({
        title: '',
        content: '',
        committing: false,
    });

    const handleTileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPostStates((prev: CreatePostStates) => ({
            ...prev,
            title: e.target.value,
        }));
    }

    const handleTextAreaInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setPostStates((prev: CreatePostStates) => ({
            ...prev,
            content: e.target.value,
        }));
    }

    const toggleButtonLoading = () => {
        setPostStates((prev: CreatePostStates) => ({
            ...prev,
            committing: !prev.committing,
        }));
    }

    const handleCommitButtonClick = async () => {
        console.log('HERE');
        toggleButtonLoading();
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
                <Button isLoading={postStates.committing} loadingText="Committing" onClick={handleCommitButtonClick}>Commit</Button>
            </Flex>
        </VStack>
    );
}