import React, { useRef } from 'react';
import { FocusableElement } from '@chakra-ui/utils';
import { Popover, PopoverTrigger, PopoverContent, PopoverArrow, PopoverCloseButton, PopoverHeader, PopoverBody, PopoverFooter, Button, ButtonGroup } from '@chakra-ui/react';

export interface PopOverButtonProps {
    button?: JSX.Element;
    body?: string,
    apply?: () => void;
}

export default function PopOverButton({ button, body, apply }: PopOverButtonProps): JSX.Element {
    const initRef = useRef<FocusableElement | null>(null);

    return (
        <Popover initialFocusRef={initRef}>
            {({ onClose }) => (
                <>
                    <PopoverTrigger>
                        {button || <Button size='sm'>Open</Button>}
                    </PopoverTrigger>
                    <PopoverContent>
                        <PopoverHeader fontWeight='semibold'>Confirmation</PopoverHeader>
                        <PopoverArrow />
                        <PopoverCloseButton />
                        <PopoverBody>
                            {body || 'Are you sure you want to continue with your action?'}
                        </PopoverBody>
                        <PopoverFooter d='flex' justifyContent='flex-end'>
                            <ButtonGroup size='sm'>
                                <Button variant='outline' onClick={onClose}>Cancel</Button>
                                <Button colorScheme='red' onClick={apply}>Apply</Button>
                            </ButtonGroup>
                        </PopoverFooter>
                    </PopoverContent>
                </>
            )}
        </Popover>
    );
}