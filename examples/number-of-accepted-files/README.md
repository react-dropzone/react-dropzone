By providing `maxNumber` prop you can make the dropzone accept specific number of files.

Attention this prop is enabled when the `multiple` props in true.
by default, this props has 0 value which means no limitation in the accepted number of files.

```jsx harmony
import React from 'react';
import {useDropzone} from 'react-dropzone';

function AcceptNumberOfFiles(props) {
  const {
    acceptedFiles,
    fileRejections,
    getRootProps,
    getInputProps
  } = useDropzone({    
    maxNumber:2
  });

  const acceptedFileItems = acceptedFiles.map(file => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  const fileRejectionItems = fileRejections.map( ( { file, errors  } ) => { 
   return(
     <li key={file.path}>
          {file.path} - {file.size} bytes
          <ul>
         {errors.map(e => <li key={e.code}>{e.message}</li>)
         }
         </ul>

     </li>
   ) 
  }  );
  

  return (
    <section className="container">
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
        <em>(2 files are the maximum number of file you can drop here)</em>
      </div>
      <aside>
        <h4>Accepted files</h4>
        <ul>{acceptedFileItems}</ul>
        <h4>Rejected files</h4>
        <ul>{fileRejectionItems}</ul>
      </aside>
    </section>
  );
}

<AcceptNumberOfFiles />
```
