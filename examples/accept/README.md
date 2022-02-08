By providing `accept` prop you can make the dropzone accept specific file types and reject the others.

The value must be a comma-separated list of unique content type specifiers:
* A file extension starting with the STOP character (U+002E). (e.g. .jpg, .png, .doc).
* A valid MIME type with no extensions.
* audio/* representing sound files.
* video/* representing video files.
* image/* representing image files.

For more information see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Input.

**IMPORTANT** As of [v12.0.0](https://github.com/react-dropzone/react-dropzone/releases/tag/v12.0.0), there has been some changes that affect how `accept` works.
See [file dialog cancel callback](../../README.md#file-dialog-cancel-callback) to read more about why this change was introduced. In summary:
1. In browsers that **do not support** the FS access API, the `accept` attr works exactly the same as in previous versions of react-dropozone, for both file picker and dag 'n' drop
2. In browsers that **support** the FS access API, when passing file extensions to `accept` (e.g `".jpg,.png"`), the file picker will not apply those filters, but drag 'n' drop will - though, the [browser limitations](#browser-limitations) described in this document still apply
3. If you want the same behaviour in all browsers, regardless of using the FS access API or not, you need to use MIME types - [browser limitations](#browser-limitations) still apply
4. The use of FS access API can be turned off via `useDropzone({useFsAccessApi: false})`

```jsx harmony
import React from 'react';
import {useDropzone} from 'react-dropzone';

function Accept(props) {
  const {
    acceptedFiles,
    fileRejections,
    getRootProps,
    getInputProps
  } = useDropzone({
    accept: 'image/jpeg,image/png'
  });

  const acceptedFileItems = acceptedFiles.map(file => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  const fileRejectionItems = fileRejections.map(({ file, errors }) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
      <ul>
        {errors.map(e => (
          <li key={e.code}>{e.message}</li>
        ))}
      </ul>
    </li>
  ));

  return (
    <section className="container">
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
        <em>(Only *.jpeg and *.png images will be accepted)</em>
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

<Accept />
```

### Browser limitations

Because of HTML5 File API differences across different browsers during the drag, Dropzone might not be able to detect whether the files are accepted or rejected in Safari nor IE.

Furthermore, at this moment it's not possible to read file names (and thus, file extensions) during the drag operation. For that reason, if you want to react on different file types _during_ the drag operation, _you have to use_ mime types and not extensions! For example, the following example won't work even in Chrome:

```jsx harmony
import React from 'react';
import {useDropzone} from 'react-dropzone';

function Accept(props) {
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject
  } = useDropzone({
    accept: '.jpeg,.png'
  });

  return (
    <div className="container">
      <div {...getRootProps({className: 'dropzone'})}>
        <input {...getInputProps()} />
        {isDragAccept && (<p>All files will be accepted</p>)}
        {isDragReject && (<p>Some files will be rejected</p>)}
        {!isDragActive && (<p>Drop some files here ...</p>)}
      </div>
    </div>
  );
}

<Accept />
```

but this one will:

```jsx harmony
import React from 'react';
import {useDropzone} from 'react-dropzone';

function Accept(props) {
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject
  } = useDropzone({
    accept: 'image/jpeg,image/png'
  });

  return (
    <div className="container">
      <div {...getRootProps({className: "dropzone"})}>
        <input {...getInputProps()} />
        {isDragAccept && (<p>All files will be accepted</p>)}
          {isDragReject && (<p>Some files will be rejected</p>)}
          {!isDragActive && (<p>Drop some files here ...</p>)}
      </div>
    </div>
  );
}

<Accept />
```

### Notes

Mime type determination is not reliable across platforms. CSV files, for example, are reported as text/plain under macOS but as application/vnd.ms-excel under Windows. In some cases there might not be a mime type set at all.

