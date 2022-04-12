import React, { ChangeEvent, useState } from 'react';
import { VStack, HStack, StackDivider, Input, Textarea, Button, Flex } from '@chakra-ui/react';
import { Coordinate } from '../../classes/Post';

interface CreatePostProps {
    coordinate: Coordinate;
    username: string
}

type UserInputs = {
    title: string;
    content: string;
}

export default function CreatePost({ coordinate, username }: CreatePostProps): JSX.Element {
    const [userInputs, setUserInputs] = useState<UserInputs>({
        title: '',
        content: '',
    });

    const handleTileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setUserInputs((prev: UserInputs) => ({
            ...prev,
            title: e.target.value,
        }));
    }

    const handleTextAreaInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setUserInputs((prev: UserInputs) => ({
            ...prev,
            content: e.target.value,
        }));
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
                    value={userInputs.title}
                    onChange={handleTileInputChange} />
                <Textarea
                    placeholder='Text (optional)'
                    resize='vertical'
                    height='250px'
                    width='450px'
                    maxHeight='585px'
                    value={userInputs.content}
                    onChange={handleTextAreaInputChange} />
            </VStack>
            <Flex
                width='100%'
                direction='row'
                justify='flex-end'>
                <Button>Commit</Button>
            </Flex>
        </VStack>
    );
}