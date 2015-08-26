react-dropzone
==============

Simple HTML5 drag-drop zone for files in React.js.

[![Screenshot of Dropzone](https://raw.githubusercontent.com/paramaggarwal/react-dropzone/master/screenshot.png)](http://paramaggarwal.github.io/react-dropzone/)

Demo: http://paramaggarwal.github.io/react-dropzone/

Installation
============

The easiest way to use react-dropzone is to install it from npm and include it in your React build process (using [Webpack](http://webpack.github.io/), [Browserify](http://browserify.org/), etc).

```
npm install --save react-dropzone
```

Usage
=====

Simply `require('react-dropzone')` and specify an `onDrop` method that accepts an array of dropped files. 

You can customize `<Dropzone>` by specifying children and passing a `style` or `className`. By default, the component picks up some default styling to get you started.

Example
=====

```jsx

/** @jsx React.DOM */
var React = require('react');
var Dropzone = require('react-dropzone');

var DropzoneDemo = React.createClass({
    onDrop: function (files) {
      console.log('Received files: ', files);
    },

    render: function () {
      return (
          <div>
            <Dropzone onDrop={this.onDrop}>
              <div>Try dropping some files here, or click to select files to upload.</div>
            </Dropzone>
          </div>
      );
    }
});

React.render(<DropzoneDemo />, document.body);
```

Features
========

- `supportClick` - Clicking the `<Dropzone>` brings up the browser file picker. To disable, set to `false`.
- `multiple` - To accept only a single file, set this to `false`.
- `accept` - The allowed file types can be controlled by the `accept` property, using the same syntax as the [HTML <input> accept Attribute](http://www.w3schools.com/tags/att_input_accept.asp).

To show a preview of the dropped file while it uploads, use the `file.preview` property. Use `<img src={file.preview} />` to display a preview of the image dropped.

To trigger the dropzone manually (open the file prompt), call the component's `open` function.

```jsx
/** @jsx React.DOM */
var React = require('react');
var Dropzone = require('react-dropzone');

var DropzoneDemo = React.createClass({
    onDrop: function (files) {
      this.setState({
        files: files
      });
    },

    onOpenClick: function () {
      this.refs.dropzone.open();
    },

    render: function () {
      return (
          <div>
            <Dropzone ref="dropzone" onDrop={this.onDrop} >
              <div>Try dropping some files here, or click to select files to upload.</div>
            </Dropzone>
            <button type="button" onClick={this.onOpenClick}>
                Open Dropzone
            </button>
            {this.state.files ? <div>
            <h2>Uploading {files.length} files...</h2>
            <div>this.state.files.map((file) => <img src={file.preview} />)</div>
            </div> : null}
          </div>
      );
    }
});

React.render(<DropzoneDemo />, document.body);
```

Uploads
=======

Using `react-dropzone` is similar to using a file form field, but instead of getting the `files` property from the field, you listen to the `onDrop` callback to handle the files. Simple explanation here: http://abandon.ie/notebook/simple-file-uploads-using-jquery-ajax

Specifying the `onDrop` method, provides you with an array of [Files](https://developer.mozilla.org/en-US/docs/Web/API/File) which you can then send to a server. For example, with [SuperAgent](https://github.com/visionmedia/superagent) as a http/ajax library:

```javascript
    onDrop: function(files){
        var req = request.post('/upload');
        files.forEach((file)=> {
            req.attach(file.name, file);
        });
        req.end(callback);
    }
```

License
=======

MIT
