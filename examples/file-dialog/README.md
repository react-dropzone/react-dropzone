You can programmatically invoke the default OS file prompt; just use the `open` method returned by the hook.

**Note** that for security reasons most browsers require popups and dialogues to originate from a direct user interaction (i.e. click).

If you are calling `dropzoneRef.open()` asynchronously, there’s a good chance it’s going to be blocked by the browser. So if you are calling `dropzoneRef.open()` asynchronously, be sure there is no more than *1000ms* delay between user interaction and `dropzoneRef.open()` call.

Due to the lack of official docs on this (at least we haven’t found any. If you know one, feel free to open PR), there is no guarantee that **allowed delay duration** will not be changed in later browser versions. Since implementations may differ between different browsers, avoid calling open asynchronously if possible.

```jsx harmony
import React from 'react';
import {useDropzone} from 'react-dropzone';

function Dropzone(props) {
  const {getRootProps, getInputProps, open} = useDropzone();
  const rootProps = getRootProps({
    // Disable click and keydown behavior
    onClick: event => event.stopPropagation(),
    onKeyDown: event => {
      if (event.keyCode === 32 || event.keyCode === 13) {
        event.stopPropagation();
      }
    }
  });

  return (
    <div {...rootProps}>
      <input {...getInputProps()} />
      <p>Drag 'n' drop some files here</p>
      <button type="button" onClick={open}>
        Open File Dialog
      </button>
    </div>
  );
}

<Dropzone />
```
