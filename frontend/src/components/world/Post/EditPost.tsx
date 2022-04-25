import React, { useState, useMemo } from 'react';
import { VStack, HStack, Textarea, Input, Text, CloseButton, Button, useToast } from '@chakra-ui/react';
import { calculateBytes } from '../../../Util';
import useCoveyAppState from '../../../hooks/useCoveyAppState';
import Post from '../../../classes/Post';
import { PostUpdateRequest } from '../../../classes/TownsServiceClient';
import useApi from './useApi';
import FileForm from './FileForm';

/**
 * The properties of editing a post
 */
interface EditPostProps {
    post: Post;
    toggleEdit: () => void;
}

/**
 * What editing a post entails
 */
type EditPostStates = {
    content: string;
    file?: File,
    deletePrevFile: boolean,
}

/**
 * The JSX element for a post being edited
 */
export default function EditPost({ post, toggleEdit }: EditPostProps): JSX.Element {
    const { currentTownID, sessionToken, apiClient } = useCoveyAppState();
    const [state, setState] = useState<EditPostStates>({
        content: post.postContent,
        file: undefined,
        deletePrevFile: false,
    });
    const editPost = useApi(apiClient.editPost.bind(apiClient));
    const toast = useToast();

    /**
     * Adds a file to the post
     * @param file The file we're adding
     */
    const handleAddFile: (file: File) => void = (file) => {
        setState((prev: EditPostStates) => ({
            ...prev,
            file,
            deletePrevFile: true,
        }));
    }

    /**
     * Removes a file from the post
     */
    const handleRemoveFile = () => {
        setState((prev: EditPostStates) => ({
            ...prev,
            file: undefined,
            deletePrevFile: false,
        }));
    }

    /**
     * Undos deleting a file
     */
    const hanldeUndoDeletePrevFile = () => {
        setState((prev: EditPostStates) => ({
            ...prev,
            deletePrevFile: false,
        }));
    }

    /**
     * Deletes a file from a post 
     */
    const hanldeDeletePrevFile = () => {
        setState((prev: EditPostStates) => ({
            ...prev,
            deletePrevFile: true,
        }));
    }

    /**
     * Edits text in a post
     * @param value The new text
     */
    const handleTextInputChange = (value: string) => {
        setState((prev: EditPostStates) => ({
            ...prev,
            content: value,
        }));
    };

    /**
     * Server's response to editing a post
     * @param result The message the server sends on if the post was edited succesfully
     */
    const editPostCallback = () => {
        toast({
            title: 'Edited post successfully',
            description: `Post ID: ${post.id}`,
            status: 'success',
        });
        toggleEdit();
    };

    /**
     * Server's response to an error being thrown in the process of editing a post
     * @param error The error caused in the process of editing a post
     */
    const editPostError = (error: string) => {
        toast({
            title: 'Unable to edit the post',
            description: error,
            status: 'error',
        });
    };

    /**
     * Server's response for when the edit button is pressed
     */
    const editPostWrapper = () => {
        const request: PostUpdateRequest = {
            coveyTownID: currentTownID,
            sessionToken,
            postID: post.id || '',
            post: {
                ...post.toServerPost(),
                postContent: state.content || '',
            },
            deletePrevFile: state.deletePrevFile,
            file: state.file,
        };
        editPost.request(request, editPostCallback, editPostError);
    };

    /**
     * Servers response to adding a file to a post
     */
    const fileFooter = useMemo(() => {
        if (state.file) {
            return (
                <>
                    <Text fontSize='xs'>{`File Type: ${state.file.type}, Size: ${calculateBytes(state.file.size)}`}</Text>
                    <CloseButton onClick={handleRemoveFile} size='sm' />
                </>
            )
        }
        if (post.file.filename) {
            return state.deletePrevFile ?
                <>
                    <Text fontSize='xs' color="red" as='s'>{`Filename: ${post.file.filename} File Type: ${post.file.contentType}`}</Text>
                    <Button onClick={hanldeUndoDeletePrevFile} size='sm'>Undo</Button>
                </>
                :
                <>
                    <Text fontSize='xs'>{`Filename: ${post.file.filename} File Type: ${post.file.contentType}`}</Text>
                    <CloseButton onClick={hanldeDeletePrevFile} size='sm' />
                </>
        }
        return <></>;
    }, [post.file, state.deletePrevFile, state.file]);

    return (
        <VStack space='5px'>
            <Input
                disabled
                placeholder='Title'
                size='md'
                value={post.title} />
            <Textarea
                placeholder='Text (optional)'
                resize='vertical'
                height='250px'
                maxHeight='450px'
                value={state.content}
                onChange={({ target }) => handleTextInputChange(target.value)} />
            <FileForm setFile={handleAddFile} />
            <HStack alignItems='center' width='100%'>
                {fileFooter}
            </HStack>
            <HStack justify='end' width='100%'>
                <Button size='sm' onClick={toggleEdit}>Cancel</Button>
                <Button size='sm' colorScheme="gray" isLoading={editPost.loading} loadingText="Committing" onClick={editPostWrapper}>Commit</Button>
            </HStack>
        </VStack>
    )
}