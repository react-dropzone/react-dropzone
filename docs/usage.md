# Usage

The dropzone hook `useDropzone` returns two property getters which are just functions that return objects with properties which you need to use to create the drag 'n' drop zone.

The `getRootProps()` properties can be applied to whatever element you want, whereas the `getInputProps()` properties must be applied to an `<input>`:

```jsx
import React from 'react'
import {useDropzone} from 'react-dropzone'

function MyDropzone() {
  const {getRootProps, getInputProps} = useDropzone()

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <p>Drag 'n' drop some files here, or click to select files</p>
    </div>
  )
}
```

When you need to set other props on the element where the props from `getRootProps()` are set, you should always pass them through that function rather than applying them on the element itself.

This is in order to avoid your props being overwritten or overwriting the props returned by `getRootProps()`:
```jsx
<div
  {...getRootProps({
    onClick: event => console.log(event),
    role: 'button',
    'aria-label': 'drag and drop area',
    // ...
  })}
/>
```

In the above example, the provided `{onClick}` handler will be invoked before the internal one, therefore, internal callbacks can be prevented by simply using [stopPropagation](https://developer.mozilla.org/en-US/docs/Web/API/Event/stopPropagation).
See [Events Propagation](/examples/event-propagation) for more examples.

> [!IMPORTANT]
> If you omit rendering an `<input>` and/or binding the props from `getInputProps()`, opening a file dialog will not be possible unless you've enabled the  `useFsAccessApi` and if the [File System Access API](https://developer.mozilla.org/en-US/docs/Web/API/File_System_API) is supported in the browser where your app is running.
