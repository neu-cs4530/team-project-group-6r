import React from 'react';
import { VStack, Box, StackDivider } from '@chakra-ui/react';
// Components
import Post from './Post';
import Comments from './Comments';
import CreateComment from './CreateComment';

export default function PostSideBar(): JSX.Element {
    return (
        <VStack
            padding={5}
            height='100%'
            border='2px'
            borderWidth='2px'
            borderColor='gray.500'
            borderRadius='8px'
            maxHeight='768px'
            divider={<StackDivider borderColor='gray.200' />}>
            <Box>
                <Post />
            </Box>
            <Box>
                <CreateComment />
            </Box>
            <Box>
                <Comments />
            </Box>
        </VStack>
    )
}