/**
 * @jsx React.DOM
 */

var React = require('react');

/**
 * Props:
 *
 *  --- className: In case you want to give a custom class name to the dropzone and style it
 *
 *  --- inputFile: In case you want a fallback for your drop zone
 *
 *  --- inputFileMultiple: in case you want multiple files
 *
 */

var Dropzone = React.createClass({
  getInitialState: function() {
    return {
      isDragActive: false
    };
  },

  handleDragLeave: function() {
    this.setState({
      isDragActive: false
    });
  },

  handleDragOver: function(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";

    this.setState({
      isDragActive: true
    });
  },

  handleFileSelect: function(e){
    this.props.handler(e.target.files);
  },

  handleDrop: function(e) {
    e.preventDefault();

    this.setState({
      isDragActive: false
    });

    if (this.props.handler) {
      var files = this.props.inputFileMultiple ?
        e.dataTransfer && e.dataTransfer.files :
        e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];

      this.props.handler(files);
    } else {
      console.error('No handler specified to accept the dropped file.');
    }
  },

  createInputFile: function(){
    if(!this.props.inputFile){
      return false;
    }

    var inputConstruct = [];

    var DropzoneInput = {
      margin: '15px auto',
      width: '85px'
    };

    inputConstruct.push(<div><br/>or</div>);

    if(this.props.inputFileMultiple){
        inputConstruct.push(<input type="file" name="file" style={DropzoneInput} className="Dropzone-Input" multiple onChange={this.handleFileSelect}/>);
    }else{
        inputConstruct.push(<input type="file" name="file" style={DropzoneInput} className="Dropzone-Input" onChange={this.handleFileSelect}/>);
    }

    return inputConstruct;
  },

  render: function() {

    var borderColor = this.state.isDragActive ? 'green' : 'lightgray';

    var DropzoneStyle = {
      textAlign: 'center',
      display: 'block',
      padding: '80px',
      border: '3px dashed',
      borderColor: borderColor,
      fontSize: '15px'
    };

     var DropzoneText = {
      textAlign: 'center',
      padding: '10px 20px',
      backgroundColor: '#4376DB',
      color: '#fff',
      fontSize: '18px',
      borderRadius: '5px'
    };



    return (
      <div className={this.props.className} style={this.props.className ? '' : DropzoneStyle} onDragLeave={this.handleDragLeave} onDragOver={this.handleDragOver} onDrop={this.handleDrop}>
          {this.props.children || <span style={DropzoneText}>Drop Here</span> }
          {this.createInputFile()}
      </div>
    );
  }

});

module.exports = Dropzone;
