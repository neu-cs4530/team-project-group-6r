import React from 'react';
import { VStack, Text, Textarea, Button } from '@chakra-ui/react';

export default function CreateComment() {
    return (
        <VStack
            width='500px'
            align='start'>
            <Text>Comment as <Text display='inline' color='tomato'>Your Mom</Text></Text>
            <Textarea height='140'
                resize='none'
                placeholder='What are your thoughts?' />
            <Button alignSelf='end'>Comment</Button>
        </VStack>
    )
}