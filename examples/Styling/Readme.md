By default, the Dropzone component picks up some default styling to get you started. You can customize `<Dropzone>` by specifying a `style`, `activeStyle` or `rejectStyle` which is applied when a file is dragged over the zone. You can also specify `className`,  `activeClassName` or `rejectClassName` if you would rather style using CSS.

## Updating styles and contents based on user input

By providing a function that returns the component's children you can not only style Dropzone appropriately but also render appropriate content.

```jsx
<Dropzone
  accept="image/png"
>
  {({ isDragAccept, isDragReject, acceptedFiles, rejectedFiles }) => {
    if (acceptedFiles.length || rejectedFiles.length) {
      return `Accepted ${acceptedFiles.length}, rejected ${rejectedFiles.length} files`;
    }
    if (isDragAccept) {
      return "This file is authorized";
    }
    if (isDragReject) {
      return "This file is not authorized";
    }
    return "Try dropping some files.";
  }}
</Dropzone>
```
