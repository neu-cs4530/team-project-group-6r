import React from "react";
import { VStack, Text, Box, HStack, Flex, Button, Textarea } from "@chakra-ui/react";

interface CommentProps {
    depth: number,
}

export default function Comments({ depth }: CommentProps): JSX.Element {

    function createMargin(counts: number): JSX.Element {
        return <Box width={3 * counts} />
    }

    return (
        <HStack align='start' width='500px'>
            {createMargin(depth)}
            <Box width='100%'>
                <Text fontSize='xs'>
                    Commented by <Text display='inline' color='cyan.500'> u/Your Mom</Text> 5 hours ago
                </Text>
                <Flex width='100%'>
                    <HStack width='100%'>
                        <Box height='100%' width='16px' borderRight='2px solid' borderRightColor='rgba(128, 128, 128, 0.5)' />
                        <VStack width='100%' align='start'>
                            <Text fontSize='sm' fontFamily='Arial' >Hey, I am your mom, and you are not my baby.</Text>
                            <HStack justify='end' width='100%'>
                                <Button size='xs'>Reply</Button>
                                <Button size='xs'>Edit</Button>
                                <Button size='xs'>Hide</Button>
                                <Button size='xs'>Delete</Button>
                            </HStack>
                            <Textarea height='100'
                                resize='none'
                                placeholder='What are your thoughts?' />
                            <Button alignSelf='end'>Comment</Button>
                        </VStack>
                    </HStack>
                </Flex>
            </Box>
        </HStack>
    )
}
