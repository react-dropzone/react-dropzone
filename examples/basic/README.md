The `useDropzone` hook just binds the necessary handlers to create a drag 'n' drop zone.
Use the `getRootProps()` fn to get the props required for drag 'n' drop and use them on any element.
For click and keydown behavior, use the `getInputProps()` fn and use the returned props on an `<input>`.

Furthermore, the hook supports folder drag 'n' drop by default. See [file-selector](https://github.com/react-dropzone/file-selector) for more info about supported browsers.


```jsx harmony
import React from 'react';
import {useDropzone} from 'react-dropzone';

function Basic(props) {
  const {acceptedFiles, getRootProps, getInputProps} = useDropzone();
  
  const files = acceptedFiles.map(file => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  return (
    <section>
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>
      <aside>
        <h4>Files</h4>
        <ul>{files}</ul>
      </aside>
    </section>
  );
}

<Basic />
```

Dropzone with `disabled` property:

```jsx harmony
import React, {useState} from 'react';
import {useDropzone} from 'react-dropzone';

function Basic(props) {
  const [disabled, setDisabled] = useState(true);
  const {acceptedFiles, getRootProps, getInputProps} = useDropzone({disabled});

  const files = acceptedFiles.map(file => (
    <li key={file.name}>
      {file.name} - {file.size} bytes
    </li>
  ));

  return (
    <section>
      <aside>
        <button
          type="button"
          onClick={() => setDisabled(!disabled)}
        >
          Toggle disabled
        </button>
      </aside>
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>
      <aside>
        <h4>Files</h4>
        <ul>{files}</ul>
      </aside>
    </section>
  );
}

<Basic />
```
