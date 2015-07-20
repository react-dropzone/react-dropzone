react-dropzone
=================

Simple HTML5 drag-drop zone in React.js.

[![Screenshot of Dropzone](https://raw.githubusercontent.com/paramaggarwal/react-dropzone/master/screenshot.png)](http://paramaggarwal.github.io/react-dropzone/)

Demo: http://paramaggarwal.github.io/react-dropzone/

Usage
=====

Simply `require('react-dropzone')` and specify an `onDrop` method that accepts an array of dropped files. You can customize the content of the Dropzone by specifying children to the component.

You can specify a `style` object to apply some basic styles to the `Dropzone` component. The style object includes `width`, `height`, and `borderStyle` properties (`width` and `height` can be integers, whereas `borderStyle` can be one of any CSS border-style).

You can also specify a `size` property which is an integer that sets both `style.width` and `style.height` to the same value.

Finally, you can set `noDefaultStyles` to *true* to disable the default `style` object completely and allow your custom CSS from `className` to take over (see below).

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

Custom CSS
==========

You may want to use your own, custom, CSS styles to control how the Dropzone element looks. You can add any classes you like to the `className` property and then disable the default style object by setting `noDefaultStyles` to *true*.

For example, your custom stylesheet might have this class:

```css

.myCustomClass {
  width: 480px;
  height: 640px;
  border: 3px dotted rgba(0, 0, 0, .5);
  background-color: #fefefe;
  color: #333;
  cursor: pointer;
}
```

You can apply your custom class to the Dropzone element like this:

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
            <Dropzone className="myCustomClass" noDefaultStyles={true} onDrop={this.onDrop}>
              <div>Try dropping some files here, or click to select files to upload.</div>
            </Dropzone>
          </div>
      );
    }
});

React.render(<DropzoneDemo />, document.body);
```

License
=======

MIT
