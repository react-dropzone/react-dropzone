var React = require('react');

var Dropzone = React.createClass({

  displayName: 'Dropzone',

  getDefaultProps: function() {
    return {
      supportClick: true,
      multiple: true
    };
  },

  getInitialState: function() {
    return {
      isDragActive: false
    };
  },

  propTypes: {
    onDrop: React.PropTypes.func.isRequired,
    onDragOver: React.PropTypes.func,
    onDragLeave: React.PropTypes.func,

    style: React.PropTypes.object,
    className: React.PropTypes.string,
    activeClassName: React.PropTypes.string,

    supportClick: React.PropTypes.bool,
    accept: React.PropTypes.string,
    multiple: React.PropTypes.bool,
  },

  onDragLeave: function(e) {
    this.setState({
      isDragActive: false
    });

    if (this.props.onDragLeave) {
      this.props.onDragLeave(e);
    }
  },

  onDragOver: function(e) {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';

    if (this.props.onDragOver) {
      this.props.onDragOver(e);
    }
  },

  onDrop: function(e) {
    e.preventDefault();

    this.setState({
      isDragActive: false
    });

    var files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }

    var maxFiles = (this.props.multiple) ? files.length : 1;
    for (var i = 0; i < maxFiles; i++) {
      files[i].preview = URL.createObjectURL(files[i]);
    }

    if (this.props.onDrop) {
      files = Array.prototype.slice.call(files, 0, maxFiles);
      this.props.onDrop(files, e);
    }
  },

  onClick: function () {
    if (this.props.supportClick === true) {
      this.open();
    }
  },

  open: function() {
    var fileInput = React.findDOMNode(this.refs.fileInput);
    fileInput.value = null;
    fileInput.click();
  },

  render: function() {
    var className = this.props.className || 'dropzone';
    if (this.state.isDragActive) {
      className += (' ' + this.props.activeClassName) || ' active';
    }

    var style = {};
    if (this.props.style) { // user-defined inline styles take priority
      style = this.props.style;
    } else if (!this.props.className) { // if no class or inline styles defined, use defaults
      style = {
        width: 100,
        height: 100,
        borderStyle: this.state.isDragActive ? 'solid' : 'dashed'
      };
    }

    return (
      React.createElement('div',
        {
          className: className,
          style: style,
          onClick: this.onClick,
          onDragLeave: this.onDragLeave,
          onDragOver: this.onDragOver,
          onDrop: this.onDrop
        },
        React.createElement('input',
          {
            style: { display: 'none' },
            type: 'file',
            multiple: this.props.multiple,
            ref: 'fileInput',
            onChange: this.onDrop,
            accept: this.props.accept
          }
        ),
        this.props.children
      )
    );
  }

});

module.exports = Dropzone;
