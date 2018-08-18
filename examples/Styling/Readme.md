By default, the Dropzone component doesn't render any styles. By providing a function that returns the component's children you can not only style Dropzone appropriately but also render appropriate content.

```
const baseStyle = {
  width: 200,
  height: 200,
  borderWidth: 2,
  borderColor: '#666',
  borderStyle: 'dashed',
  borderRadius: 5
};
const activeStyle = {
  borderStyle: 'solid',
  borderColor: '#6c6',
  backgroundColor: '#eee'
};
const rejectStyle = {
  borderStyle: 'solid',
  borderColor: '#c66',
  backgroundColor: '#eee'
};

<Dropzone>
  {({ getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject, acceptedFiles, rejectedFiles }) => {
    let styles = {...baseStyle}
    styles = isDragActive ? {...styles, ...activeStyle} : styles
    styles = isDragReject ? {...styles, ...rejectStyle} : styles
          
    return (
      <div 
        {...getRootProps()}
        style={styles}
      >
        <input {...getInputProps()} />
        <div>
          {isDragAccept ? `Drop ${acceptedFiles.length}` : 'Drag'} files here...
        </div>
        {isDragReject && <div>Unsupported file type...</div>}
      </div>
    )
  }}
</Dropzone>
```
