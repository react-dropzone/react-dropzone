You can programmatically invoke default OS file prompt. In order to do that you'll have to set the ref on your `Dropzone` instance and call the instance `open` method.

```
const {getDroppedOrSelectedFiles} = require('html5-file-selector')
let dropzoneRef;

<div>
  <Dropzone ref={(node) => { dropzoneRef = node; }} getDataTransferItems={evt => getDroppedOrSelectedFiles(evt).then(list => console.log(list, 'list') || list.map(({fileObject, ...rest}) => fileObject))}>
      <p>Drop files here.</p>
  </Dropzone>
  <button type="button" onClick={() => { dropzoneRef.open() }}>
      Open File Dialog
  </button>
</div>
```

The completion handler for the `open` function is also the `onDrop` function.
