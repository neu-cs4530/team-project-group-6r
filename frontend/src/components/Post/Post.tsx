import React from 'react';
import { VStack, HStack, Text, Heading, Button, Flex } from '@chakra-ui/react';

export default function Post(): JSX.Element {
    return (
        <VStack align='start'
            width='500px'>
            <Text fontSize='sm'>
                Posted by u/pulajir 5 hours ago
            </Text>
            <Heading as='h4'
                size='md'>
                To the people considering NU Bound
            </Heading>
            <Text fontSize='md'
                fontFamily='Arial'>
                Hello people, I just finished NU Bound in England and wanted top try help provide answers to your questions and give some insight into NU Bound. Ask me about academics, grading, living, traveling or anything else that comes to mind. Fair warning, I didnt have the best time with the academic and administrative side of NU Bound but this will help provide a very honest insight into NU Bound.
            </Text>
            <HStack
                width='100%'>
                <Text width='115px' fontSize='sm'>
                    10 Comments
                </Text>
                <Flex
                    direction='row'
                    justify='end'
                    width='100%'>
                    <Button>Delete</Button>
                    <Button>Hide</Button>
                    <Button>Edit</Button>
                </Flex>
            </HStack>
        </VStack>
    )
}