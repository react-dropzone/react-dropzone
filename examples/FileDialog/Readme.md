You can programmatically invoke default OS file prompt. In order to do that you'll have to set the ref on your `Dropzone` instance and call the instance `open` method.

**Please note**, that for security reasons most browsers require popups and dialogues to result from a direct user’s action, in other cases, there’s a good chance it’s going to be blocked. So if you are calling `dropzoneRef.open()` asynchronously, be sure there is no more than *1000ms* delay between user interaction and `dropzoneRef.open()` call. Due to the lack of official docs on this (at least we haven’t found any. If you know one, feel free to open PR), I cannot guarantee that **allowed delay duration** will not be changed in later browser versions. Besides, chances are it could be different in older versions. So try to omit it if possible

```
let dropzoneRef;

<div>
  <Dropzone ref={(node) => { dropzoneRef = node; }} onDrop={(accepted, rejected) => { alert(accepted) }}>
      <p>Drop files here.</p>
  </Dropzone>
  <button type="button" onClick={() => { dropzoneRef.open() }}>
      Open File Dialog
  </button>
</div>
```

The completion handler for the `open` function is also the `onDrop` function.
