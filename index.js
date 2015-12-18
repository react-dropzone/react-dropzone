import accept from 'attr-accept';
import React from 'react';

const supportMultiple = (typeof document !== 'undefined' && document && document.createElement) ?
  'multiple' in document.createElement('input') :
  true;

class Dropzone extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.onClick = this.onClick.bind(this);
    this.onDragEnter = this.onDragEnter.bind(this);
    this.onDragLeave = this.onDragLeave.bind(this);
    this.onDragOver = this.onDragOver.bind(this);
    this.onDrop = this.onDrop.bind(this);

    this.state = {
      isDragActive: false,
    };
  }

  componentDidMount() {
    this.enterCounter = 0;

    // Since the webkitdirectory and directory attributes are not allowed in react render
    // Hence adding it in componentDidMount
    if (this.props.onlyFolders) {
      this.refs.fileInput.setAttribute('webkitdirectory', '');
      this.refs.fileInput.setAttribute('directory', '');
    }
  }

  allFilesAccepted(files) {
    return files.every(file => accept(file, this.props.accept));
  }

  onDragEnter(e) {
    e.preventDefault();

    // Count the dropzone and any children that are entered.
    ++this.enterCounter;

    // This is tricky. During the drag even the dataTransfer.files is null
    // But Chrome implements some drag store, which is accesible via dataTransfer.items
    const dataTransferItems = e.dataTransfer && e.dataTransfer.items ? e.dataTransfer.items : [];

    // Now we need to convert the DataTransferList to Array
    const allFilesAccepted = this.allFilesAccepted(Array.prototype.slice.call(dataTransferItems));

    this.setState({
      isDragActive: allFilesAccepted,
      isDragReject: !allFilesAccepted,
    });

    if (this.props.onDragEnter) {
      this.props.onDragEnter.call(this, e);
    }
  }

  onDragOver(e) {
    e.preventDefault();
  }

  onDragLeave(e) {
    e.preventDefault();

    // Only deactivate once the dropzone and all children was left.
    if (--this.enterCounter > 0) {
      return;
    }

    this.setState({
      isDragActive: false,
      isDragReject: false,
    });

    if (this.props.onDragLeave) {
      this.props.onDragLeave.call(this, e);
    }
  }

  onDrop(e) {
    e.preventDefault();

    // Reset the counter along with the drag on a drop.
    this.enterCounter = 0;

    this.setState({
      isDragActive: false,
      isDragReject: false,
    });

    const droppedFiles = e.dataTransfer ? e.dataTransfer.files : e.target.files;
    const max = this.props.multiple ? droppedFiles.length : 1;
    const files = [];

    for (let i = 0; i < max; i++) {
      let file = droppedFiles[i];

      // We might want to disable the preview creation to support big files
      if (!this.props.disablePreview) {
        file.preview = window.URL.createObjectURL(file);
      }

      files.push(file);
    }

    if (this.props.onDrop) {
      this.props.onDrop.call(this, files, e);
    }

    if (this.allFilesAccepted(files)) {
      if (this.props.onDropAccepted) {
        this.props.onDropAccepted.call(this, files, e);
      }
    } else {
      if (this.props.onDropRejected) {
        this.props.onDropRejected.call(this, files, e);
      }
    }
  }

  onClick() {
    if (!this.props.disableClick) {
      this.open();
    }
  }

  open() {
    const fileInput = this.refs.fileInput;
    fileInput.value = null;
    fileInput.click();
  }

  render() {
    let className, style, activeStyle, rejectStyle;

    className = this.props.className || '';

    if (this.state.isDragActive && this.props.activeClassName) {
      className += ' ' + this.props.activeClassName;
    }

    if (this.state.isDragReject && this.props.rejectClassName) {
      className += ' ' + this.props.rejectClassName;
    }

    if (this.props.style || this.props.activeStyle || this.props.rejectStyle) {
      if (this.props.style) {
        style = this.props.style;
      }

      if (this.props.activeStyle) {
        activeStyle = this.props.activeStyle;
      }

      if (this.props.rejectStyle) {
        rejectStyle = this.props.rejectStyle;
      }
    } else if (!className) {
      style = {
        width: 200,
        height: 200,
        borderWidth: 2,
        borderColor: '#666',
        borderStyle: 'dashed',
        borderRadius: 5,
      };
      activeStyle = {
        borderStyle: 'solid',
        backgroundColor: '#eee',
      };
      rejectStyle = {
        borderStyle: 'solid',
        backgroundColor: '#ffdddd',
      };
    }

    let appliedStyle;
    if (activeStyle && this.state.isDragActive) {
      appliedStyle = {
        ...style,
        ...activeStyle,
      };
    }    else if (rejectStyle && this.state.isDragReject) {
      appliedStyle = {
        ...style,
        ...rejectStyle,
      };
    } else {
      appliedStyle = {
        ...style,
      };
    }

    const inputAttributes = {
      type: 'file',
      style: { display: 'none'},
      ref: 'fileInput',
      accept: this.props.accept,
      onChange: this.onDrop,
    };

    supportMultiple && (inputAttributes.multiple = this.props.multiple);
    this.props.name && (inputAttributes.name = this.props.name);

    return (
      <div
        className={className}
        style={appliedStyle}
        onClick={this.onClick}
        onDragEnter={this.onDragEnter}
        onDragOver={this.onDragOver}
        onDragLeave={this.onDragLeave}
        onDrop={this.onDrop}
      >
        {this.props.children}
        <input {...inputAttributes} />
      </div>
    );
  }
}

Dropzone.defaultProps = {
  disablePreview: false,
  disableClick: false,
  multiple: true,
};

Dropzone.propTypes = {
  onDrop: React.PropTypes.func,
  onDropAccepted: React.PropTypes.func,
  onDropRejected: React.PropTypes.func,
  onDragEnter: React.PropTypes.func,
  onDragLeave: React.PropTypes.func,

  style: React.PropTypes.object,
  activeStyle: React.PropTypes.object,
  rejectStyle: React.PropTypes.object,
  className: React.PropTypes.string,
  activeClassName: React.PropTypes.string,
  rejectClassName: React.PropTypes.string,

  disablePreview: React.PropTypes.bool,
  disableClick: React.PropTypes.bool,
  multiple: React.PropTypes.bool,
  accept: React.PropTypes.string,
  name: React.PropTypes.string,
};

export default Dropzone;
