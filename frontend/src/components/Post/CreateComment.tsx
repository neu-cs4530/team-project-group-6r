import React from 'react';
import { VStack, Text, Textarea, Button } from '@chakra-ui/react';

interface CreateCommentProps {
    postID: string;
    username: string
}

export default function CreateComment({ postID, username }: CreateCommentProps) {
    return (
        <VStack
            width='500px'
            align='start'>
            <Text>Comment as <Text display='inline' color='tomato'>{username}</Text></Text>
            <Textarea height='140'
                resize='none'
                placeholder='What are your thoughts?' />
            <Button alignSelf='end'>Comment</Button>
        </VStack>
    )
}