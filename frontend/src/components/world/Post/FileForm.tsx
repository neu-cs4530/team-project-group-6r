/* eslint-disable react/jsx-props-no-spreading */
// Note: the lint is complainting about the code snippet I got from the 
// the external API for the file dropping
import React from 'react';
import { useDropzone } from 'react-dropzone';
import { Button, Text } from '@chakra-ui/react';

export interface FileFormProps {
    setFile: (file: File) => void;
}

const dropZoneStyle = {
    width: '90%',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    padding: '20px',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#eeeeee',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    color: '#bdbdbd',
    outline: 'none',
    transition: 'border .24s ease-in-out'
};

/**
 * The JSX element for the file drop zone
 */
export default function FileForm({ setFile }: FileFormProps): JSX.Element {

    const handleDropFile = (files: File[]) => {
        setFile(files[0]);
    }

    const { getRootProps, getInputProps, open } = useDropzone({
        noClick: true,
        noKeyboard: true,
        maxFiles: 1,
        onDrop: handleDropFile,
    });

    return (
        <div {...getRootProps({ style: dropZoneStyle })}>
            <input {...getInputProps()} />
            <Text display='inline'>Drag & Drop a file</Text>
            <Button display='inline' variant='outline' colorScheme='teal' size='xs' onClick={open} >
                Open File Dialog
            </Button>
        </div>
    )
}
