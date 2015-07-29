var React = require('react');

var Dropzone = React.createClass({
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
    size: React.PropTypes.number,
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    style: React.PropTypes.object,
    supportClick: React.PropTypes.bool,
    accept: React.PropTypes.string,
    multiple: React.PropTypes.bool
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

    // set active drag state only when file is dragged into
    // (in mozilla when file is dragged effect is "uninitialized")
    var effectAllowed = e.dataTransfer.effectAllowed;
    if (effectAllowed === 'all' || effectAllowed === 'uninitialized') {
      this.setState({
        isDragActive: true
      });
    }

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
      className += ' active';
    }

    var style = {};
    if (this.props.style) { // user-defined inline styles take priority
      style = this.props.style;
    } else if (!this.props.className) { // if no class or inline styles defined, use defaults
      style = {
        width: this.props.width || this.props.size || 100,
        height: this.props.height || this.props.size || 100,
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
