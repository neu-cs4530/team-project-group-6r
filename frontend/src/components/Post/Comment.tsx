import React from "react";
import { VStack, Text, Box, HStack, Flex, Button } from "@chakra-ui/react";

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
            <Box>
                <Text fontSize='xs'>
                    Commented by u/Your Mom 5 hours ago
                </Text>
                <Flex>
                    <HStack>
                        <Box height='100%' width='16px'>
                            <Box height='100%' borderRight='2px solid' borderRightColor='rgba(128, 128, 128, 0.5)' />
                        </Box>
                        <VStack>
                            <Text fontSize='sm' fontFamily='Arial' >Hey, I am your mom, and you are not my baby.</Text>
                            <HStack align='start' width='100%'>
                                <Button size='xs'>Reply</Button>
                                <Button size='xs'>Edit</Button>
                                <Button size='xs'>Hide</Button>
                                <Button size='xs'>Delete</Button>
                            </HStack>
                        </VStack>
                    </HStack>
                </Flex>
            </Box>
        </HStack>
    )
}
