**Please note**, that for security reasons most browsers require popups and dialogues to originate from a direct user interaction (i.e. click). If you are calling `dropzoneRef.open()` asynchronously, there’s a good chance it’s going to be blocked by the browser. So if you are calling `dropzoneRef.open()` asynchronously, be sure there is no more than *1000ms* delay between user interaction and `dropzoneRef.open()` call. Due to the lack of official docs on this (at least we haven’t found any. If you know one, feel free to open PR), there is no guarantee that **allowed delay duration** will not be changed in later browser versions. Since implementations may differ between different browsers, avoid calling open asynchronously if possible.

You can programmatically invoke default OS file prompt. There are two ways to do that. The first is to provide a function as the child for `Dropzone` to access the `open` method as a parameter. The second way is to set the ref on your `Dropzone` instance and call the instance `open` method.

##### Open programmatically by Child Function

```
<Dropzone onDrop={files => alert(JSON.stringify(files))} disableClick>
  {({ open }) => (
    <React.Fragment>
      <button type="button" onClick={() => open()}>
        Open File Dialog
      </button>

      <p>Drop files here.</p>
    </React.Fragment>
  )}
</Dropzone>
```

##### Open programmatically by Ref

```
const dropzoneRef = React.createRef();

<div>
  <Dropzone ref={dropzoneRef} onDrop={(accepted, rejected) => { alert(JSON.stringify(accepted)) }}>
      <p>Drop files here.</p>
  </Dropzone>
  <button type="button" onClick={() => { dropzoneRef.current.open() }}>
      Open File Dialog
  </button>
</div>
```

The completion handler for the `open` function is also the `onDrop` function.
