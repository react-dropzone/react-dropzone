var Dropzone = require('react-dropzone');
var React = require('react');

var DropzoneDemo = React.createClass({
    getInitialState: function () {
      return {
        files: []
      };
    },

    onDrop: function (files) {
      console.log('Received files: ', files);
      this.setState({
        files: files
      });
    },

    showFiles: function () {
      var files = this.state.files;

      if (files.length <= 0) {
        return '';
      }

      return (
        <div>
          <h3>Dropped files: </h3>
          <ul>
            {[].map.call(files, function (f, i) {
              return (
                <li key={i}>
                  {f.name + ' : ' + f.size + ' bytes.'}
                  <img src={f.preview} />
                </li>
              );
            })}
          </ul>
        </div>
        );
    },

    render: function () {
      var styles = {
        padding: 30
      };

      return (
          <div>
            <Dropzone onDrop={this.onDrop}>
              <div style={styles}>
                Try dropping some files here, or click to select files to upload.
              </div>
            </Dropzone>
            {this.showFiles()}
          </div>
      );
    }
});

React.render(<DropzoneDemo />, document.body);

module.exports = DropzoneDemo;