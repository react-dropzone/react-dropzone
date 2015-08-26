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
                  <img src={f.preview} width={100}/>
                  <div>{f.name + ' : ' + f.size + ' bytes.'}</div>
                </li>
              );
            })}
          </ul>
        </div>
        );
    },

    render: function () {
      var styles = {
        border: '2px black dashed',
        borderRadius: 5,
        margin: 30,
        padding: 30,
        width: 200,
      };

      return (
          <div>
            <Dropzone onDrop={this.onDrop} style={styles}>
              Try dropping some files here, or click to select files to upload.
            </Dropzone>
            {this.showFiles()}
          </div>
      );
    }
});

React.render(<DropzoneDemo />, document.getElementById('example'));

module.exports = DropzoneDemo;