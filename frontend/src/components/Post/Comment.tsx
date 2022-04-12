import React from "react";
import { VStack, Text, Box, HStack, Flex, Button, Textarea } from "@chakra-ui/react";

export interface CommentType {
    "_id": string;
    "rootPostID": string;
    "parentCommentID": string;
    "ownerID": string;
    "commentContent": string;
    "isDeleted": boolean;
    "createdAt": string;
    "updatedAt": string;
    "comments": CommentType[];
}

export interface CommentProps {
    comment: CommentType;
    depth: number;
}

export default function Comment({ comment, depth }: CommentProps): JSX.Element {

    function createMargin(counts: number): JSX.Element {
        return <Box width={5 * counts} />
    }

    function calculateHourDifference() {
        return Math.round((new Date().getTime() - new Date(comment.createdAt).getTime()) / 36e5);
    }

    return (
        <HStack align='start' width='500px'>
            {createMargin(depth || 0)}
            <Box width='100%'>
                <Text fontSize='xs'>
                    Commented by <Text display='inline' color='cyan.500'> u/{comment.ownerID}</Text> · {calculateHourDifference()} hours ago
                </Text>
                <Flex width='100%'>
                    <HStack width='100%'>
                        <Box height='100%' width='16px' borderRight='2px solid' borderRightColor='rgba(128, 128, 128, 0.5)' />
                        <VStack width='100%' align='start'>
                            <Text fontSize='sm' fontFamily='Arial' >{comment.commentContent}</Text>
                            <HStack justify='end' width='100%'>
                                <Button size='xs'>Reply</Button>
                                <Button size='xs'>Edit</Button>
                                <Button size='xs'>Hide</Button>
                                <Button size='xs'>Delete</Button>
                            </HStack>
                            <Textarea height='100'
                                resize='none'
                                placeholder='What are your thoughts?' />
                            <Button alignSelf='end' size="sm">Comment</Button>
                        </VStack>
                    </HStack>
                </Flex>
            </Box>
        </HStack>
    )
}
