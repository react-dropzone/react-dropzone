react-dropzone
=================

Simple HTML5 drag-drop zone in React.js.

![Screenshot of dropzone](https://raw.githubusercontent.com/paramaggarwal/react-dropzone/master/screenshot.png)

Usage
=====

Simply `require()` the module and specify a `handler` property as a function that accepts the dropped file.

You may additionally pass in a CSS size for the dropzone using the `size` property.

```jsx

var Dropzone = require('react-dropzone');

var component = React.createClass({

  fileHandler: function(file) {
      uploadScript(file, uploadURL, function(err, res) {
        if (res.code == 200) {console.log("Upload success.")}
      });
    }
  },

  render: function() {
    return (
      <div>
        <Dropzone handler={this.fileHandler} />
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