import React from 'react';
import { VStack, HStack, StackDivider, Input, Textarea, Button, Flex } from '@chakra-ui/react';

export default function CreatePost(): JSX.Element {
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
                    size='md' />
                <Textarea
                    placeholder='Text (optional)'
                    resize='vertical'
                    height='250px'
                    width='450px'
                    maxHeight='585px' />
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