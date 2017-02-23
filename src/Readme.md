## Installation

Install it from npm and include it in your React build process (using [Webpack](http://webpack.github.io/), [Browserify](http://browserify.org/), etc).

```bash
npm install --save react-dropzone
```

## Usage

Import `Dropzone` in your React component:

```javascript
import Dropzone from 'react-dropzone'
``` 
  
  and specify the `onDrop` method that accepts two arguments. The first argument represents the accepted files and the second argument the rejected files.
  
```javascript
function onDrop(acceptedFiles, rejectedFiles) {
  // do stuff with files...
}
``` 

Files accepted or rejected based on `accept` prop. This must be a valid [MIME type](http://www.iana.org/assignments/media-types/media-types.xhtml) according to [input element specification](https://www.w3.org/wiki/HTML/Elements/input/file).

Please note that `onDrop` method will always be called regardless if dropped file was accepted or rejected. The `onDropAccepted` method will be called if all dropped files were accepted and the `onDropRejected` method will be called if any of the dropped files was rejected.

## Styling Dropzone and its contents

If you want to style dropzone contents depending on user action, i.e. change the appearance when files are being dragging over the dropzone, you can render a function that returns children with appropriate styles applied.

### Class names

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

### CSS-in-JS or inline styles 

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

### Updating the content

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

## Validation

You should implement validation of files yourself. Here is a simple example of file size validation and filtering:

```
initialState = { files: [] };

<section>
  <Dropzone
    onDrop={(files) => {
      setState({ 
        showError: files.some(f => f.size >= 10 * 1024),
        files: files.filter(f => f.size < 10 * 1024)
      })
    }}
  >
    <div className="dropzone">
      {
        state.showError ? 
          <p>Some files exceed 10KB limit!</p> :
          <p>Only files under 10KB allowed.</p>
      }
    </div>
  </Dropzone>
  <aside>
    <h2>Dropped files under 10 KB</h2>
    <ul>
      {
        state.files.map(f => <li>{f.name} - {f.size} bytes</li>)
      }
    </ul>
  </aside>
</section>
```

## Open file dialog programmatically

You can open file dialog programmatically from your app. To do that you'll need to get the reference to the Dropzone.

`onFileDialogCancel` callback will be called if user will decides to cancel uploading.

```
<div>
  <Dropzone
    disableClick
    ref={(node) => { this.dropzone = node; }}
  >
    <div className="dropzone">Dropzone Content</div>
  </Dropzone>
  
  <button onClick={() => { this.dropzone.open(); }}>Open file dialog...</button>
</div>
```

## How to upload files?

Using `react-dropzone` is similar to using a file form field, but instead of getting the `files` property from the field, you listen to the `onDrop` callback to handle the files. Simple explanation here: http://abandon.ie/notebook/simple-file-uploads-using-jquery-ajax

Specifying the `onDrop` method, provides you with an array of [Files](https://developer.mozilla.org/en-US/docs/Web/API/File) which you can then send to a server. For example, with [SuperAgent](https://github.com/visionmedia/superagent) as a http/ajax library:

```javascript
    onDrop: (acceptedFiles) => {
        const req = request.post('/upload');
        acceptedFiles.forEach((file) => {
            req.attach(file.name, file);
        });
        req.end(callback);
    }
```
