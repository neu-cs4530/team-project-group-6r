// import React, { useCallback } from 'react';
// import { useDropzone } from 'react-dropzone';
// import { Center, useColorModeValue, Icon } from '@chakra-ui/react';
// import { AiFillFileAdd } from 'react-icons/ai';

// export default function Dropzone({ onFileAccepted } : any) {
//   const onDrop = useCallback((acceptedFiles) => {
//     onFileAccepted(acceptedFiles[0]);
//   }, [onFileAccepted]);

//   const { getRootProps, getInputProps, isDragActive } = useDropzone({
//     onDrop, accept: '.pdf', maxFiles: 1, multiple: false,
//   });

//   const dropText = isDragActive ? 'Drop the files here ...' : 'Drag \'n\' drop .pdf file here, or click to select files';

//   const activeBg = useColorModeValue('gray.100', 'gray.600');
//   const borderColor = useColorModeValue(
//     isDragActive ? 'teal.300' : 'gray.300',
//     isDragActive ? 'teal.500' : 'gray.500',
//   );

//   return (
//     <Center
//       p={10}
//       cursor="pointer"
//       bg={isDragActive ? activeBg : 'transparent'}
//       _hover={{ bg: activeBg }}
//       transition="background-color 0.2s ease"
//       borderRadius={4}
//       border="3px dashed"
//       borderColor={borderColor}
//       {...getRootProps()}
//     >
//       <input {...getInputProps()} />
//       <Icon as={AiFillFileAdd} mr={2} />
//       <p>{dropText}</p>
//     </Center>
//   );
// }

import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Center, useColorModeValue, Icon } from '@chakra-ui/react';
import { AiFillFileAdd } from 'react-icons/ai';


// Define interface for component props/api:
export interface DropZoneProps {
  onDragStateChange?: (isDragActive: boolean) => void
  onDrag?: () => void
  onDragIn?: () => void
  onDragOut?: () => void
  onDrop?: () => void
  onFilesDrop?: (files: any[]) => void
}

export const DropZone = React.memo(
  (props: React.PropsWithChildren<DropZoneProps>) => {
    const {
      onDragStateChange,
      onFilesDrop,
      onDrag,
      onDragIn,
      onDragOut,
      onDrop,
    } = props

    // Create state to keep track when dropzone is active/non-active:
    const [isDragActive, setIsDragActive] = React.useState(false)
    // Prepare ref for dropzone element:
    const dropZoneRef = React.useRef<null | HTMLDivElement>(null)

    // Create helper method to map file list to array of files:
    const mapFileListToArray = (files: FileList) => {
      const array = []

      for (let i = 0; i < files.length; i++) {
        array.push(files.item(i))
      }

      return array
    }

    // Create handler for dragenter event:
    const handleDragIn = React.useCallback(
      (event) => {
        event.preventDefault()
        event.stopPropagation()
        onDragIn?.()

        if (event.dataTransfer.items && event.dataTransfer.items.length > 0) {
          setIsDragActive(true)
        }
      },
      [onDragIn]
    )

    // Create handler for dragleave event:
    const handleDragOut = React.useCallback(
      (event) => {
        event.preventDefault()
        event.stopPropagation()
        onDragOut?.()

        setIsDragActive(false)
      },
      [onDragOut]
    )

    // Create handler for dragover event:
    const handleDrag = React.useCallback(
      (event) => {
        event.preventDefault()
        event.stopPropagation()

        onDrag?.()
        if (!isDragActive) {
          setIsDragActive(true)
        }
      },
      [isDragActive, onDrag]
    )

    // Create handler for drop event:
    const handleDrop = React.useCallback(
      (event) => {
        event.preventDefault()
        event.stopPropagation()

        setIsDragActive(false)
        onDrop?.()

        if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
          const files = mapFileListToArray(event.dataTransfer.files)
          if(files.length !== 0) {
          onFilesDrop?.(files)
          }
          event.dataTransfer.clearData()
        }
      },
      [onDrop, onFilesDrop]
    )

    // Obser active state and emit changes:
    React.useEffect(() => {
      onDragStateChange?.(isDragActive)
    }, [isDragActive])

    // Attach listeners to dropzone on mount:
    React.useEffect(() => {
      const tempZoneRef = dropZoneRef?.current
      if (tempZoneRef) {
        tempZoneRef.addEventListener('dragenter', handleDragIn)
        tempZoneRef.addEventListener('dragleave', handleDragOut)
        tempZoneRef.addEventListener('dragover', handleDrag)
        tempZoneRef.addEventListener('drop', handleDrop)
      }

      // Remove listeners from dropzone on unmount:
      return () => {
        tempZoneRef?.removeEventListener('dragenter', handleDragIn)
        tempZoneRef?.removeEventListener('dragleave', handleDragOut)
        tempZoneRef?.removeEventListener('dragover', handleDrag)
        tempZoneRef?.removeEventListener('drop', handleDrop)
      }
    }, [])

    // Render <div> with ref and children:
    return <div ref={dropZoneRef}>{props.children}</div>
  }
)

DropZone.displayName = 'DropZone'