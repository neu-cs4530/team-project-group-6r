import React, { useState, useMemo, useCallback } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody } from '@chakra-ui/react';
import Post, { Coordinate } from '../../../classes/Post';
import useCoveyAppState from '../../../hooks/useCoveyAppState';
import ReadPost from './ReadPost';
import CreatePost from './CreatePost';
import EditPost from './EditPost';

export interface PostProps {
    post?: Post;
    coordinates?: Coordinate;
    closePostModal: () => void;
}

type PostStates = {
    isEdit: boolean;
}

const initalState = {
    isEdit: false,
};

export default function PostModal({ post, coordinates, closePostModal }: PostProps): JSX.Element {
    const { currentTownFriendlyName } = useCoveyAppState();
    const [state, setState] = useState<PostStates>(initalState);

    const toggleOffEdit = () => {
        setState(() => ({
            isEdit: false,
        }));
    };

    const toggleEdit = () => {
        setState((prev) => ({
            isEdit: !prev.isEdit,
        }));
    };

    const handleOnClose = useCallback(() => {
        toggleOffEdit();
        closePostModal();
    }, [closePostModal]);


    const header = useMemo(() => {
        if (post || coordinates) {
            return `Town: ${currentTownFriendlyName}`;
        }
        return <></>;
    }, [coordinates, currentTownFriendlyName, post]);

    const body = useMemo(() => {
        if (post) {
            if (state.isEdit) {
                return <EditPost post={post} toggleEdit={toggleEdit} />
            }
            return <ReadPost post={post} toggleEdit={toggleEdit} closeReadPost={handleOnClose} />
        }
        if (coordinates) {
            return <CreatePost coordinates={coordinates} closeCreatePost={handleOnClose} />
        }
        return <></>
    }, [coordinates, handleOnClose, post, state.isEdit]);

    return (
        <Modal onClose={handleOnClose}
            size='xl'
            isOpen={post !== undefined || coordinates !== undefined}
            scrollBehavior='inside'>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{header}</ModalHeader>
                <ModalCloseButton />
                <ModalBody paddingBottom='20px'>{body}</ModalBody>
            </ModalContent>
        </Modal>
    )
}