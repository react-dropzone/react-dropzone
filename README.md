react-dropzone [![Build Status](https://travis-ci.org/okonet/react-dropzone.svg?branch=master)](https://travis-ci.org/okonet/react-dropzone) [![npm version](https://badge.fury.io/js/react-dropzone.svg)](https://badge.fury.io/js/react-dropzone) [![codecov](https://codecov.io/gh/okonet/react-dropzone/branch/master/graph/badge.svg)](https://codecov.io/gh/okonet/react-dropzone) [![OpenCollective](https://opencollective.com/react-dropzone/backers/badge.svg)](#backers) 
[![OpenCollective](https://opencollective.com/react-dropzone/sponsors/badge.svg)](#sponsors)


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

Simply `require('react-dropzone')` and specify an `onDrop` method which accepts two arguments. The first argument represents the accepted files and the second argument the rejected files.

The `onDrop` method gets always called if a file was uploaded, regardless if it was accepted or rejected. The library provides two additional methods named `onDropAccepted` and `onDropRejected`. The `onDropAccepted` method will be called if all dropped files were accepted and the `onDropRejected` method will be called if any of the dropped files was rejected.

Example
=====

```jsx

/** @jsx React.DOM */
var React = require('react');
var Dropzone = require('react-dropzone');

var DropzoneDemo = React.createClass({
    onDrop: function (acceptedFiles, rejectedFiles) {
      console.log('Accepted files: ', acceptedFiles);
      console.log('Rejected files: ', rejectedFiles);
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

Reacting to user input
=====

By default, the component picks up some default styling to get you started. You can customize `<Dropzone>` by specifying a `style` and `activeStyle` which is applied when a file is dragged over the zone. You can also specify `className` and `activeClassName` if you would rather style using CSS.

You have a third option : providing a function that returns the component's children.

```
<Dropzone>
  {({ isDragActive, isDragReject, acceptedFiles, rejectedFiles }) => {
    if (isDragActive) {
      return "This file is authorized";
    }
    if (isDragReject) {
      return "This file is not authorized";
    }
    return acceptedFiles.length || rejectedFiles.length
      ? `Accepted ${acceptedFiles.length}, rejected ${rejectedFiles.length} files`
      : "Try dropping some files";
  }}
</Dropzone>
```

Features
========

- `preventDropOnDocument` `[Boolean | **true**]` — When a file is dropped outside of any `<Dropzone>` instance, whether to prevent the browser from navigating to it.
- `disableClick` `[Boolean | **false**]` — Clicking the `<Dropzone>` brings up the browser file picker.
- `multiple` `[Boolean | **true**]` — Accept multiple files
- `minSize` `[Number | **0**]` —  Only accept file(s) larger than  `minSize` bytes.
- `maxSize` `[Number | **Infinity**]` — Only accept file(s) smaller than  `maxSize` bytes.
- `accept` - Accept only specified mime types. Must be a valid [MIME type](http://www.iana.org/assignments/media-types/media-types.xhtml) according to [input element specification](https://www.w3.org/wiki/HTML/Elements/input/file), for example `application/pdf`, `image/*`, `audio/aiff,audio/midi`

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

    onDrop: function (acceptedFiles) {
      this.setState({
        files: acceptedFiles
      });
    },

    onOpenClick: function () {
      this.dropzone.open();
    },

    render: function () {
        return (
            <div>
                <Dropzone ref={(node) => { this.dropzone = node; }} onDrop={this.onDrop}>
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
    onDrop: function(acceptedFiles){
        var req = request.post('/upload');
        acceptedFiles.forEach((file)=> {
            req.attach(file.name, file);
        });
        req.end(callback);
    }
```

Support
=======
### Backers
Support us with a monthly donation and help us continue our activities. [[Become a backer](https://opencollective.com/react-dropzone#backer)]

<a href="https://opencollective.com/react-dropzone/backer/0/website" target="_blank"><img src="https://opencollective.com/react-dropzone/backer/0/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/backer/1/website" target="_blank"><img src="https://opencollective.com/react-dropzone/backer/1/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/backer/2/website" target="_blank"><img src="https://opencollective.com/react-dropzone/backer/2/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/backer/3/website" target="_blank"><img src="https://opencollective.com/react-dropzone/backer/3/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/backer/4/website" target="_blank"><img src="https://opencollective.com/react-dropzone/backer/4/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/backer/5/website" target="_blank"><img src="https://opencollective.com/react-dropzone/backer/5/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/backer/6/website" target="_blank"><img src="https://opencollective.com/react-dropzone/backer/6/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/backer/7/website" target="_blank"><img src="https://opencollective.com/react-dropzone/backer/7/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/backer/8/website" target="_blank"><img src="https://opencollective.com/react-dropzone/backer/8/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/backer/9/website" target="_blank"><img src="https://opencollective.com/react-dropzone/backer/9/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/backer/10/website" target="_blank"><img src="https://opencollective.com/react-dropzone/backer/10/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/backer/11/website" target="_blank"><img src="https://opencollective.com/react-dropzone/backer/11/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/backer/12/website" target="_blank"><img src="https://opencollective.com/react-dropzone/backer/12/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/backer/13/website" target="_blank"><img src="https://opencollective.com/react-dropzone/backer/13/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/backer/14/website" target="_blank"><img src="https://opencollective.com/react-dropzone/backer/14/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/backer/15/website" target="_blank"><img src="https://opencollective.com/react-dropzone/backer/15/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/backer/16/website" target="_blank"><img src="https://opencollective.com/react-dropzone/backer/16/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/backer/17/website" target="_blank"><img src="https://opencollective.com/react-dropzone/backer/17/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/backer/18/website" target="_blank"><img src="https://opencollective.com/react-dropzone/backer/18/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/backer/19/website" target="_blank"><img src="https://opencollective.com/react-dropzone/backer/19/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/backer/20/website" target="_blank"><img src="https://opencollective.com/react-dropzone/backer/20/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/backer/21/website" target="_blank"><img src="https://opencollective.com/react-dropzone/backer/21/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/backer/22/website" target="_blank"><img src="https://opencollective.com/react-dropzone/backer/22/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/backer/23/website" target="_blank"><img src="https://opencollective.com/react-dropzone/backer/23/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/backer/24/website" target="_blank"><img src="https://opencollective.com/react-dropzone/backer/24/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/backer/25/website" target="_blank"><img src="https://opencollective.com/react-dropzone/backer/25/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/backer/26/website" target="_blank"><img src="https://opencollective.com/react-dropzone/backer/26/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/backer/27/website" target="_blank"><img src="https://opencollective.com/react-dropzone/backer/27/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/backer/28/website" target="_blank"><img src="https://opencollective.com/react-dropzone/backer/28/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/backer/29/website" target="_blank"><img src="https://opencollective.com/react-dropzone/backer/29/avatar.svg"></a>


### Sponsors
Become a sponsor and get your logo on our README on Github with a link to your site. [[Become a sponsor](https://opencollective.com/react-dropzone#sponsor)]

<a href="https://opencollective.com/react-dropzone/sponsor/0/website" target="_blank"><img src="https://opencollective.com/react-dropzone/sponsor/0/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/sponsor/1/website" target="_blank"><img src="https://opencollective.com/react-dropzone/sponsor/1/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/sponsor/2/website" target="_blank"><img src="https://opencollective.com/react-dropzone/sponsor/2/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/sponsor/3/website" target="_blank"><img src="https://opencollective.com/react-dropzone/sponsor/3/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/sponsor/4/website" target="_blank"><img src="https://opencollective.com/react-dropzone/sponsor/4/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/sponsor/5/website" target="_blank"><img src="https://opencollective.com/react-dropzone/sponsor/5/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/sponsor/6/website" target="_blank"><img src="https://opencollective.com/react-dropzone/sponsor/6/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/sponsor/7/website" target="_blank"><img src="https://opencollective.com/react-dropzone/sponsor/7/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/sponsor/8/website" target="_blank"><img src="https://opencollective.com/react-dropzone/sponsor/8/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/sponsor/9/website" target="_blank"><img src="https://opencollective.com/react-dropzone/sponsor/9/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/sponsor/10/website" target="_blank"><img src="https://opencollective.com/react-dropzone/sponsor/10/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/sponsor/11/website" target="_blank"><img src="https://opencollective.com/react-dropzone/sponsor/11/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/sponsor/12/website" target="_blank"><img src="https://opencollective.com/react-dropzone/sponsor/12/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/sponsor/13/website" target="_blank"><img src="https://opencollective.com/react-dropzone/sponsor/13/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/sponsor/14/website" target="_blank"><img src="https://opencollective.com/react-dropzone/sponsor/14/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/sponsor/15/website" target="_blank"><img src="https://opencollective.com/react-dropzone/sponsor/15/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/sponsor/16/website" target="_blank"><img src="https://opencollective.com/react-dropzone/sponsor/16/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/sponsor/17/website" target="_blank"><img src="https://opencollective.com/react-dropzone/sponsor/17/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/sponsor/18/website" target="_blank"><img src="https://opencollective.com/react-dropzone/sponsor/18/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/sponsor/19/website" target="_blank"><img src="https://opencollective.com/react-dropzone/sponsor/19/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/sponsor/20/website" target="_blank"><img src="https://opencollective.com/react-dropzone/sponsor/20/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/sponsor/21/website" target="_blank"><img src="https://opencollective.com/react-dropzone/sponsor/21/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/sponsor/22/website" target="_blank"><img src="https://opencollective.com/react-dropzone/sponsor/22/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/sponsor/23/website" target="_blank"><img src="https://opencollective.com/react-dropzone/sponsor/23/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/sponsor/24/website" target="_blank"><img src="https://opencollective.com/react-dropzone/sponsor/24/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/sponsor/25/website" target="_blank"><img src="https://opencollective.com/react-dropzone/sponsor/25/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/sponsor/26/website" target="_blank"><img src="https://opencollective.com/react-dropzone/sponsor/26/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/sponsor/27/website" target="_blank"><img src="https://opencollective.com/react-dropzone/sponsor/27/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/sponsor/28/website" target="_blank"><img src="https://opencollective.com/react-dropzone/sponsor/28/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/sponsor/29/website" target="_blank"><img src="https://opencollective.com/react-dropzone/sponsor/29/avatar.svg"></a>

License
=======

MIT
