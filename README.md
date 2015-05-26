react-dropzone
=================

Simple HTML5 drag-drop zone in React.js.

[![Screenshot of Dropzone](https://raw.githubusercontent.com/paramaggarwal/react-dropzone/master/screenshot.png)](http://paramaggarwal.github.io/react-dropzone/)

Demo: http://paramaggarwal.github.io/react-dropzone/

Usage
=====

Simply `require('react-dropzone')` and specify an `onDrop` method that accepts an array of dropped files. You can customize the content of the Dropzone by specifying children to the component.

You can also specify a `style` object to apply to the `Dropzone` component. Optionally pass in a `size` property to configure the size of the Dropzone.

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
            <Dropzone onDrop={this.onDrop} size={150} >
              <div>Try dropping some files here, or click to select files to upload.</div>
            </Dropzone>
          </div>
      );
    }
});

React.render(<DropzoneDemo />, document.body);
```


Using `react-dropzone` is similar to using a file form field, but instead of getting the `files` property from the field, you listen to the `onDrop` callback to handle the files. Simple explanation here: http://abandon.ie/notebook/simple-file-uploads-using-jquery-ajax

The `onDrop` provides you with an array of [Files](https://developer.mozilla.org/en-US/docs/Web/API/File) which you can then send to a server. For example, with [SuperAgent](https://github.com/visionmedia/superagent) as a http/ajax library:

```javascript
    onDrop: function(files){
        var req = request.post('/upload');
        files.forEach((file)=> {
            req.attach(file.name, file);
        });
        req.end(callback);
    }
```

Starting `v1.1`, you can now immediately show a preview of the dropped file while it uploads. The `file.preview` property can be specified as the image source: `<img src={file.preview} />` to display a preview of the image dropped.

Triggers
========

It may be useful to trigger the dropzone manually (opening the file prompt), to do that, you can call the component's `open` function.

For example:

```jsx

/** @jsx React.DOM */
var React = require('react');
var Dropzone = require('react-dropzone');

var DropzoneDemo = React.createClass({
    onDrop: function (files) {
      console.log('Received files: ', files);
    },

    onOpenClick: function () {
      this.refs.dropzone.open();
    },

    render: function () {
      return (
          <div>
            <Dropzone ref="dropzone" onDrop={this.onDrop} size={150} >
              <div>Try dropping some files here, or click to select files to upload.</div>
            </Dropzone>
            <button type="button" onClick={this.onOpenClick}>
                Open Dropzone
            </button>
          </div>
      );
    }
});

React.render(<DropzoneDemo />, document.body);
```

License
=======

MIT
