react-dropzone [![Build Status](https://travis-ci.org/okonet/react-dropzone.svg)](https://travis-ci.org/okonet/react-dropzone)
==============

Simple HTML5 drag-drop zone for files with React.js.

Try it out here: http://okonet.ru/react-dropzone/

Installation
============

The easiest way to use react-dropzone is to install it from npm and include it in your React build process (using [Webpack](http://webpack.github.io/), [Browserify](http://browserify.org/), etc).

```
npm install --save react-dropzone
```

Create a standalone module using *WebPack*:
```
> npm install
> webpack
```

React 0.13 users
=====

Vesion 3.x is not compatible with React 0.13. If you can't upgrade to React 0.14 right now, you should use v 2.x of this package.

```
npm install --save react-dropzone@2.x
```

Usage
=====

Simply `require('react-dropzone')` and specify an `onDrop` method that accepts an array of dropped files.

By default, the component picks up some default styling to get you started. You can customize `<Dropzone>` by specifying a `style` and `activeStyle` which is applied when a file is dragged over the zone. You can also specify `className` and `activeClassName` if you would rather style using CSS.

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

- `disableClick` `[Boolean | **false**]` — Clicking the `<Dropzone>` brings up the browser file picker.
- `multiple` `[Boolean | **true**]` — Accept multiple files
- `minSize` `[Number | **0**]` —  Only accept file(s) larger than  `minSize` bytes.
- `maxSize` `[Number | **Infinity**]` — Only accept file(s) smaller than  `maxSize` bytes.
- `accept` - Accept only specified mime types. Must be a valid MIME type according to [input element specification](http://www.w3.org/TR/html-markup/input.file.html), for example `application/pdf`, `image/*`, `audio/aiff,audio/midi`

To show a preview of the dropped file while it uploads, use the `file.preview` property. Use `<img src={file.preview} />` to display a preview of the image dropped.
You can disable the creation of the preview (for example if you drop big files) by setting the `disablePreview` prop to `true`.

#### Manual Upload
* To trigger the dropzone manually (open the file prompt), call the component's `open` function.
* The completion handler for the `open` function is also the `onDrop` function.

```jsx
/** @jsx React.DOM */
var React = require('react');
var Dropzone = require('react-dropzone');

var DropzoneDemo = React.createClass({
    getInitialState: function () {
        return {
          files: []
        };
    },

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
                <Dropzone ref="dropzone" onDrop={this.onDrop}>
                    <div>Try dropping some files here, or click to select files to upload.</div>
                </Dropzone>
                <button type="button" onClick={this.onOpenClick}>
                    Open Dropzone
                </button>
                {this.state.files.length > 0 ? <div>
                <h2>Uploading {this.state.files.length} files...</h2>
                <div>{this.state.files.map((file) => <img src={file.preview} /> )}</div>
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
