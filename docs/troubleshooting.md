# Troubleshooting

Before you head to [react-dropzone](https://github.com/react-dropzone/react-dropzone/issues/new/choose) and file an issue, it may be useful to checkout these common/known issues.

## Required React Version

React [16.8](https://reactjs.org/blog/2019/02/06/react-v16.8.0.html) or above is required because we use [hooks](https://reactjs.org/docs/hooks-intro.html) (the lib itself is a hook).

## File Paths

Files returned by the hook or passed as arg. to the `onDrop` cb won't have the properties `path` or `fullPath`.
For more info check [this SO question](https://stackoverflow.com/a/23005925/2275818) and [this issue](https://github.com/react-dropzone/react-dropzone/issues/477).

## File Upload

This library is not a file uploader; as such, it does not process files or provide any way to make HTTP requests to some server; if you're looking for that, checkout [filepond](https://pqina.nl/filepond) or [uppy.io](https://uppy.io/).

## Using \<label\> as Root

If you use [\<label\>](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label) as the root element, the file dialog will be opened twice; see [#1107](https://github.com/react-dropzone/react-dropzone/issues/1107) for an explanation. To avoid this, use `noClick`:

```jsx
import React, {useCallback} from 'react'
import {useDropzone} from 'react-dropzone'

function MyDropzone() {
  const {getRootProps, getInputProps} = useDropzone({noClick: true})

  return (
    <label {...getRootProps()}>
      <input {...getInputProps()} />
    </label>
  )
}
```

## Using open() on Click

If you bind a click event on an inner element and use `open()`, it will trigger a click on the root element too, resulting in the file dialog opening twice. To prevent this, use the `noClick` on the root:

```jsx
import React, {useCallback} from 'react'
import {useDropzone} from 'react-dropzone'

function MyDropzone() {
  const {getRootProps, getInputProps, open} = useDropzone({noClick: true})

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <button type="button" onClick={open}>
        Open
      </button>
    </div>
  )
}
```

## File Dialog Cancel Callback

The `onFileDialogCancel()` cb is unstable in most browsers, meaning, there's a good chance of it being triggered even though you have selected files.

We rely on using a timeout of `300ms` after the window is focused (the window `onfocus` event is triggered when the file select dialog is closed) to check if any files were selected and trigger `onFileDialogCancel` if none were selected.

As one can imagine, this doesn't really work if there's a lot of files or large files as by the time we trigger the check, the browser is still processing the files and no `onchange` events are triggered yet on the input. Check [#1031](https://github.com/react-dropzone/react-dropzone/issues/1031) for more info.

Fortunately, there's the [File System Access API](https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API), which is currently a working draft and some browsers support it (see [browser compatibility](https://developer.mozilla.org/en-US/docs/Web/API/window/showOpenFilePicker#browser_compatibility)), that provides a reliable way to prompt the user for file selection and capture cancellation. 

Also keep in mind that the FS access API can only be used in [secure contexts](https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts).

> [!NOTE]
> You can enable using the FS access API with the `useFsAccessApi` property: `useDropzone({useFsAccessApi: true})`.

## File System Access API

When setting `useFsAccessApi` to `true`, you're switching to the [File System API](https://developer.mozilla.org/en-US/docs/Web/API/File_System_API) (see the [file system access](https://wicg.github.io/file-system-access/) RFC).

What this essentially does is that it will use the [showOpenFilePicker](https://developer.mozilla.org/en-US/docs/Web/API/Window/showOpenFilePicker) method to open the file picker window so that the user can select files.

In contrast, the traditional way (when the `useFsAccessApi` is not set to `true` or not specified) uses an `<input type="file">` (see [docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file)) on which a click event is triggered.

With the use of the file system access API enabled, there's a couple of caveats to keep in mind:
1. The users will not be able to select directories
2. It requires the app to run in a [secure context](https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts)
3. In [Electron](https://www.electronjs.org/), the path may not be set (see [#1249](https://github.com/react-dropzone/react-dropzone/issues/1249))
