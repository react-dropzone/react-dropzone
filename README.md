react-dropzone
=================

Simple HTML5 drag-drop zone for file uploads in React.js.

[![Screenshot of Dropzone](https://raw.githubusercontent.com/paramaggarwal/react-dropzone/master/screenshot.png)](http://paramaggarwal.github.io/react-dropzone/)

Demo: http://paramaggarwal.github.io/react-dropzone/

Installation
=====
The easiest way to use react-dropzone is to install it from npm and include it in your React build process (using [Webpack](http://webpack.github.io/), [Browserify](http://browserify.org/), etc).
```sh
npm install --save react-dropzone
```

Usage
=====

Simply `require('react-dropzone')` and specify an `onDrop` method that accepts an array of dropped files. You can customize the content of the Dropzone by specifying children to the component.

You can specify a `style` object to apply some basic styles to the `Dropzone` component, or alternatively use the `className` property to style the component with custom CSS.

If no `style` or `className` properties are defined, the style object will default to the `width` and `height` properties (or `100px` if they aren't defined) along with a `borderStyle` of "solid" or "dashed" depending on if drag actions are taking place.

You can alternatively specify a `size` property which is an integer that sets both `style.width` and `style.height` to the same value.

By default the drop zone can be clicked to bring up the browser file picker. To disable this the `supportClick` property should be set to `false`.

Also multiple files can be uploaded to the drop zone, but this can be disabled by setting the `multiple` property to `false`. The allowed file types can be controlled by the `accept` property, using the same syntax as the [HTML <input> accept Attribute](http://www.w3schools.com/tags/att_input_accept.asp).

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
            <Dropzone onDrop={this.onDrop} width={150} height={100}>
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
