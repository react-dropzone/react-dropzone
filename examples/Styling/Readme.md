By default, the Dropzone component doesn't render any styles. By providing a function that returns the component's children you can not only style Dropzone appropriately but also render appropriate content.



### Using inline styles

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

### Using styled-components

```
const styled = require('styled-components').default;

const getColor = (props) => {
    if (props.isDragActive) {    
        return '#6c6';
    } 
    if (props.isDragReject) {
        return '#c66';
    }
    return '#666';
};

const Container = styled.div`
  width: 200px;
  height: 200px;
  border-width: 2px;
  border-radius: 5px;
  border-color: ${props => getColor(props)};
  border-style: ${props => props.isDragReject || props.isDragActive ? 'solid' : 'dashed'};
  background-color: ${props => props.isDragReject || props.isDragActive ? '#eee' : ''};
`;

<Dropzone accept="image/*">
  {({ isDragActive, isDragAccept, isDragReject, acceptedFiles, rejectedFiles }) => {
    return (
      <Container isDragActive={isDragActive} isDragReject={isDragReject}>
        {isDragAccept ? `Drop ${acceptedFiles.length}` : 'Drag'} files here...
      </Container>
    )
  }}
</Dropzone>
```