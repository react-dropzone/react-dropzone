/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');

var component = React.createClass({

  getInitialState: function() {
    return {
      isDragActive: false
    }
  },

  dragLeaveHandler: function(e) {
    this.setState({
      isDragActive: false
    });
  },

  dragOverHandler: function(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    
    this.setState({
      isDragActive: true
    });
  },

  dropHandler: function(e) {
    e.preventDefault();

    this.setState({
      isDragActive: false
    });

    if (this.props.handler) {
      var file = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
      this.props.handler(file);
    }
  },

  render: function() {

    var size = this.props.size || "100pt";
    var dropzoneStyle = {
      width: size,
      height: size,
      borderRadius: "10%",
      borderWidth: "2pt",
      borderColor: "#666",
      borderStyle: this.state.isDragActive ? "solid" : "dashed"
    };

    var messageStyle = {
      display: "table-cell",
      width: size,
      height: size,
      textAlign: "center",
      verticalAlign: "middle",
      fontSize: "10pt",
      textTransform: "uppercase",
      color: "#666"
    };

    return (
      <div ref="container" className="dropzone-container" style={dropzoneStyle} onDragLeave={this.dragLeaveHandler} onDragOver={this.dragOverHandler} onDrop={this.dropHandler}>
        <span className="dropzone-message" style={messageStyle}>Drop Here</span>
      </div>
    );
  }
});

module.exports = component;