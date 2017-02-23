# Styling Dropzone and its contents

If you want to style dropzone contents depending on user action, i.e. change the appearance when files are being dragging over the dropzone, you can render a function that returns children with appropriate styles applied.

## Class names

For convinience we will be using [classnames](https://github.com/JedWatson/classnames).

```javascript
const cx = require('classnames')

<Dropzone style={{}}>
  {({ isDragActive, isDragReject }) => {
    const classNames = cx('dropzoneBase', {
      'dropzoneActive': isDragActive,
      'dropzoneRejected': isDragReject,
    })
    return (
      <div className={classNames}>
        Try dropping some files
      </div>
    );
  }}
</Dropzone>
```

## CSS-in-JS or inline styles 

Same technique can be applied with CSS-in-JS solutions. Consider following example:

```
<Dropzone style={{}}>
  {({ isDragActive, isDragReject }) => {
    let styles = {
      width: '100%',
      height: 200,
      textAlign: 'center',
      borderWidth: 2,
      borderColor: '#666',
      borderStyle: 'dashed',
      borderRadius: 5
    };
        
    if (isDragActive) {
      styles = {
        ...styles,
        borderStyle: 'solid',
        borderColor: '#6c6',
        backgroundColor: '#eee'
      };
    }
    if (isDragReject) {
      styles = {
        ...styles,
        borderStyle: 'solid',
        borderColor: '#c66',
        backgroundColor: '#eee'
      };
    }
    return (
      <div style={styles}>
        Try dropping some files
      </div>
    );
  }}
</Dropzone>
```

## Updating the content

The real power of this approach, though, is that you can also change the contents of the dropzone dynamically.

```
<Dropzone style={{}}>
  {({ isDragActive, isDragReject }) => {
    let styles = {
      width: '100%',
      height: 200,
      textAlign: 'center',
      borderWidth: 2,
      borderColor: '#666',
      borderStyle: 'dashed',
      borderRadius: 5
    }
        
    const acceptedStyles = {
      ...styles,
      borderStyle: 'solid',
      borderColor: '#6c6',
      backgroundColor: '#eee'
    }
    
    const rejectStyles = {
      ...styles,
      borderStyle: 'solid',
      borderColor: '#c66',
      backgroundColor: '#eee'
    }
    
    if (isDragActive) {
      return (
        <div style={acceptedStyles}>
          File will be accepted
        </div>
      )
    }
    if (isDragReject) {
      return (
        <div style={rejectStyles}>
          File will be rejected
        </div>
      )
    }
    // Default case
    return (
      <div style={styles}>
        Drop some files here...
      </div>
    )
  }}
</Dropzone>
```

