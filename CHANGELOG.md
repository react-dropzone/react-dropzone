# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### BREAKING CHANGES

#### `isDragReject` no longer persists after drop event

**Previous Behavior:**
- `isDragReject` would remain `true` after dropping rejected files, creating a "sticky" state
- This caused visual issues where rejection styles would persist after the drop was complete

**New Behavior:**
- `isDragReject` is now `true` **only during an active drag** when some dragged files would be rejected
- After a drop event, `isDragReject` resets to `false` regardless of whether files were accepted or rejected
- The `fileRejections` state property and the second parameter of `onDrop` callback remain the authoritative sources for post-drop file rejections

**Migration Guide:**

If you were relying on `isDragReject` to show post-drop error states, you should now use one of these alternatives:

1. **Use the `fileRejections` state property:**
   ```jsx
   const { getRootProps, getInputProps, isDragReject, fileRejections } = useDropzone({
     accept: { 'image/*': [] }
   });
   
   return (
     <div {...getRootProps()}>
       {/* During drag: show rejection state */}
       {isDragReject && <p>Some files will be rejected</p>}
       
       {/* After drop: show rejected files */}
       {fileRejections.length > 0 && (
         <div>
           <p>Rejected files:</p>
           <ul>
             {fileRejections.map(({ file, errors }) => (
               <li key={file.name}>
                 {file.name} - {errors.map(e => e.message).join(', ')}
               </li>
             ))}
           </ul>
         </div>
       )}
     </div>
   );
   ```

2. **Use the second parameter of `onDrop` callback:**
   ```jsx
   const onDrop = useCallback((acceptedFiles, fileRejections, event) => {
     if (fileRejections.length > 0) {
       // Handle rejected files
       console.log('Rejected files:', fileRejections);
     }
     
     if (acceptedFiles.length > 0) {
       // Handle accepted files
       console.log('Accepted files:', acceptedFiles);
     }
   }, []);
   
   const { getRootProps, getInputProps } = useDropzone({ onDrop });
   ```

3. **Use the `onDropRejected` callback:**
   ```jsx
   const onDropRejected = useCallback((fileRejections, event) => {
     // Handle rejected files specifically
     console.log('Files were rejected:', fileRejections);
   }, []);
   
   const { getRootProps, getInputProps } = useDropzone({ onDropRejected });
   ```

**Rationale:**
- This change aligns `isDragReject` with the behavior of other drag state properties like `isDragActive` and `isDragAccept`, which only reflect the current drag state
- It fixes the bug where rejection styling would persist after a drop, providing a better user experience
- It makes the API more consistent and predictable
