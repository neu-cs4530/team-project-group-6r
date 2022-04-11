import React from 'react';
import { VStack, StackDivider } from '@chakra-ui/react';
import Comment from './Comment';

export default function Comments(): JSX.Element {
    return (
        <VStack height='220px'
            overflow='scroll'
            overflowX='hidden'
            divider={<StackDivider borderColor='gray.200' />}
            space='5'
            paddingRight='5px'>
            <Comment depth={0} />
            <Comment depth={1} />
            <Comment depth={2} />
            <Comment depth={3} />
            <Comment depth={4} />
        </VStack>
    )
}