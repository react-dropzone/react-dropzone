react-dropzone
=================

Simple HTML5 drag-drop zone in React.js.

![Screenshot of dropzone](https://raw.githubusercontent.com/paramaggarwal/react-dropzone/master/screenshot.png)

Usage
=====

Simply `require()` the module and specify a `handler` property as a function that accepts the dropped file.

Optionally pass in a CSS size for the dropzone using the `size` property and a message to be shown inside the dropzone using the `message` property.

```jsx

var Dropzone = require('react-dropzone');

var component = React.createClass({

  fileHandler: function(file) {
    uploadScript(file, uploadURL, function(err, res) {
      if (res.code == 200) {console.log("Upload success.")}
    });
  },

  render: function() {
    return (
      <div>
        <Dropzone handler={this.fileHandler} size={200} message="Drag and drop a file here"/>
      </div>
    );
  }
});
```

If you'd like more customizability, you can specify children for the component and all the default styling will be overridden.

```jsx

var Dropzone = require('react-dropzone');

var component = React.createClass({

  fileHandler: function(file) {
    this.setState({
      uploading: true
    });
    
    uploadScript(file, uploadURL, function(err, res) {
      if (res.code == 200) {console.log("Upload success.")}
    });
  },

  render: function() {
    return (
      <div>
        <Dropzone handler={this.fileHandler}>
          <span>{this.state.uploading ? "Uploading... " : "Drop an image here."}</span>
        </Dropzone>
      </div>
    );
  }
});
```

Author
======

Param Aggarwal (paramaggarwal@gmail.com)

License
=======

MIT
