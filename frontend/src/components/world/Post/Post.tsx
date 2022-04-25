import React, { useState, useMemo, useCallback } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody } from '@chakra-ui/react';
import Post, { Coordinate } from '../../../classes/Post';
import useCoveyAppState from '../../../hooks/useCoveyAppState';
import ReadPost from './ReadPost';
import CreatePost from './CreatePost';
import EditPost from './EditPost';

/**
 * Properties of a post
 */
export interface PostProps {
    post?: Post;
    coordinates?: Coordinate;
    closePostModal: () => void;
}

/**
 * What a post entails
 */
type PostStates = {
    isEdit: boolean;
}

/**
 * What a post initially looks like
 */
const initalState = {
    isEdit: false,
};

/**
 * The JSX element for all parts of a post (editing, file drop zone, etc.)
 */
export default function PostModal({ post, coordinates, closePostModal }: PostProps): JSX.Element {
    const { currentTownFriendlyName } = useCoveyAppState();
    const [state, setState] = useState<PostStates>(initalState);

    /**
     * Turns editing off on the post
     */
    const toggleOffEdit = () => {
        setState(() => ({
            isEdit: false,
        }));
    };

    /**
     * Turns editing on or off on the post
     */
    const toggleEdit = () => {
        setState((prev) => ({
            isEdit: !prev.isEdit,
        }));
    };

    /**
     * Server response to closing a post
     */
    const handleOnClose = useCallback(() => {
        toggleOffEdit();
        closePostModal();
    }, [closePostModal]);

    const header = useMemo(() => {
        if (post) {
            return `Post In Town: ${currentTownFriendlyName}`;
        }
        if (coordinates) {
            return `Post To Town: ${currentTownFriendlyName}`;
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
                <ModalBody>{body}</ModalBody>
            </ModalContent>
        </Modal>
    )
}