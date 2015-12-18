var React = require('react');
var ReactDOM = require('react-dom');
var Dropzone = require('react-dropzone');

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
      var style = {
        borderWidth: 2,
        borderColor: 'black',
        borderStyle: 'dashed',
        borderRadius: 4,
        margin: 30,
        padding: 30,
        width: 200,
        transition: 'all 0.5s'
      };

      var activeStyle = {
        borderStyle: 'solid',
        backgroundColor: '#eee',
        borderRadius: 8
      };

      return (
          <div>
            <Dropzone onDrop={this.onDrop} style={style} activeStyle={activeStyle}>
              Try dropping some files here, or click to select files to upload.
            </Dropzone>
            {this.showFiles()}
          </div>
      );
    }
});

ReactDOM.render(<DropzoneDemo />, document.getElementById('example'));

module.exports = DropzoneDemo;
