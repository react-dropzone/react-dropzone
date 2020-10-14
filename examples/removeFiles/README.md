You can use `removeFiles` function to remove any file either in acceptedFiles ro fileRejections.
There is also a callback `onRemoveFiles` that fires when you call `removeFiles` it provides removed files.

```jsx harmony
import React from "react";
import { useDropzone } from "react-dropzone";

function RemoveFiles(props) {
  const {
    acceptedFiles,
    fileRejections,
    getRootProps,
    getInputProps,
    onRemoveFiles,
    removeFiles
  } = useDropzone({});

  const acceptedFileItems = acceptedFiles.map(file => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));
  console.log(fileRejections);
  const fileRejectionItems = fileRejections.map(({ file, errors }) => {
    return (
      <li key={file.path}>
        {file.path} - {file.size} bytes
        <ul>
          {errors.map(e => (
            <li key={e.code}>{e.message}</li>
          ))}
        </ul>
      </li>
    );
  });

  return (
    <section className="container">
      <div
        {...getRootProps({
          className: "dropzone",
          onRemoveFiles: files => console.log(files)
        })}
      >
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>
      <aside>
        <button
          onClick={() => {
            console.log("remove");
            removeFiles([acceptedFiles[0]]);
          }}
        >
          remove
        </button>
        <h4>Accepted files</h4>
        <ul>{acceptedFileItems}</ul>
        <h4>Rejected files</h4>
        <ul>{fileRejectionItems}</ul>
      </aside>
    </section>
  );
}

<RemoveFiles />;
```
