/* eslint-disable */
import React from 'react'
import classNames from 'classnames'

// Import dropzone and file list components:
import { DropZone } from './components/uiFolder/FileUpload'
import { FileList } from './components/uiFolder/UIUploading'

function App() {
    // Create "active" state for dropzone:
    const [isDropActive, setIsDropActive] = React.useState(false)
    // Create state for dropped files:
    const [files, setFiles] = React.useState<File[]>([])
  
    // Create handler for dropzone's onDragStateChange:
    const onDragStateChange = React.useCallback((dragActive: boolean) => {
      setIsDropActive(dragActive)
    }, [])
  
    // Create handler for dropzone's onFilesDrop:
    const onFilesDrop = React.useCallback((files: File[]) => {
      setFiles(files)
    }, [])
  
    return (
      <div
        className={classNames('dropZoneWrapper', {
          'dropZoneActive': isDropActive,
        })}
      >
        {/* Render the dropzone */}
        <DropZone onDragStateChange={onDragStateChange} onFilesDrop={onFilesDrop}>
          <h2>Drop your files here</h2>
  
          {files.length === 0 ? (
            <h3>No files to upload</h3>
          ) : (
            <h3>Files to upload: {files.length}</h3>
          )}
  
          {/* Render the file list */}
          <FileList files={files} />
        </DropZone>
      </div>
    )
  }
  
export default App;
// export const App = React.memo(() => {
//   // Create "active" state for dropzone:
//   const [isDropActive, setIsDropActive] = React.useState(false)
//   // Create state for dropped files:
//   const [files, setFiles] = React.useState<File[]>([])

//   // Create handler for dropzone's onDragStateChange:
//   const onDragStateChange = React.useCallback((dragActive: boolean) => {
//     setIsDropActive(dragActive)
//   }, [])

//   // Create handler for dropzone's onFilesDrop:
//   const onFilesDrop = React.useCallback((files: File[]) => {
//     setFiles(files)
//   }, [])

//   return (
//     <div
//       className={classNames('dropZoneWrapper', {
//         'dropZoneActive': isDropActive,
//       })}
//     >
//       {/* Render the dropzone */}
//       <DropZone onDragStateChange={onDragStateChange} onFilesDrop={onFilesDrop}>
//         <h2>Drop your files here</h2>

//         {files.length === 0 ? (
//           <h3>No files to upload</h3>
//         ) : (
//           <h3>Files to upload: {files.length}</h3>
//         )}

//         {/* Render the file list */}
//         <FileList files={files} />
//       </DropZone>
//     </div>
//   )
// })

// App.displayName = 'App'
// import React, {Component} from 'react';
// import ReactDOM from 'react-dom'
// import Dropzone from './components/uiFolder/FileUpload';

// function App() {
//     return (
//       <div className="App">
//           <h1>HI hih hihih</h1>
//           <Dropzone />
//       </div>
//     );
//   }
  
//   export default App;




// import React from 'react';
// import Button from '@material-ui/core/Button';
// import PhotoCamera from '@material-ui/icons/PhotoCamera';
// import IconButton from '@material-ui/core/IconButton';
 
// const App = () => {
 
//   return (
//     <div style={{
//       display: 'flex',
//       margin: 'auto',
//       width: 400,
//       flexWrap: 'wrap',
//     }}>
//       <div style={{ width: '100%', float: 'left' }}>
//         <h3>How to use create button to choose file in ReactJS?</h3> <br />
//       </div>
//       <input
//         type="file"
//         accept="image/*"
//         style={{ display: 'none' }}
//         id="contained-button-file"
//       />
//       <label htmlFor="contained-button-file">
//         <Button variant="contained" color="primary" component="span">
//           Upload
//         </Button>
//       </label>
//       <h3>  OR  </h3>
//       <input accept="image/*" id="icon-button-file"
//         type="file" style={{ display: 'none' }} />
//       <label htmlFor="icon-button-file">
//         <IconButton color="primary" aria-label="upload picture"
//         component="span">
//           <PhotoCamera />
//         </IconButton>
//       </label>
//     </div>
//   );
// }
 
//export default App;