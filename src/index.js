import accepts from 'attr-accept';
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
      isDragActive: false
    };
  }

  componentDidMount() {
    const { multiple } = this.props;

    this.enterCounter = 0;

    if (supportMultiple && multiple) {
      // see https://github.com/okonet/react-dropzone/issues/134#issuecomment-206442049
      ['webkitdirectory', 'mozdirectory', 'msdirectory', 'odirectory', 'directory'].forEach(attribute => {
        this.fileInputEl.setAttribute(attribute, true);
      });
    }
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
      isDragReject: !allFilesAccepted
    });

    if (this.props.onDragEnter) {
      this.props.onDragEnter.call(this, e);
    }
  }

  onDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    return false;
  }

  onDragLeave(e) {
    e.preventDefault();

    // Only deactivate once the dropzone and all children was left.
    if (--this.enterCounter > 0) {
      return;
    }

    this.setState({
      isDragActive: false,
      isDragReject: false
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
      isDragReject: false
    });

    let droppedFiles = e.dataTransfer ? e.dataTransfer.files : e.target.files;
    const dataTransferItems = e.dataTransfer && e.dataTransfer.items ? e.dataTransfer.items : [];

    const wrapup = () => {
      const max = this.props.multiple ? droppedFiles.length : Math.min(droppedFiles.length, 1);
      const files = [];

      for (let i = 0; i < max; i++) {
        const file = droppedFiles[i];
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
    };

    if (dataTransferItems[0] && typeof dataTransferItems[0].webkitGetAsEntry === 'function') {
      const entry = dataTransferItems[0].webkitGetAsEntry();

      return this.walkDirectory(entry.filesystem.root, walkedFiles => {
        droppedFiles = walkedFiles;
        wrapup();
      });
    }
    wrapup();
  }

  onClick() {
    if (!this.props.disableClick) {
      this.open();
    }
  }

  allFilesAccepted(files) {
    return files.every(file => accepts(file, this.props.accept));
  }

  open() {
    this.fileInputEl.value = null;
    this.fileInputEl.click();
  }

  walkDirectory(directory, callback) {
    let results = [];

    if (directory === null) {
      return callback(results);
    }

    const reader = directory.createReader();

    reader.readEntries(read => {
      if (!read.length) {
        return callback(results);
      }

      const entries = read.slice();

      const processEntry = () => {
        const current = entries.shift();

        if (current === undefined) {
          return callback(results);
        }

        if (current.isDirectory) {
          return this.walkDirectory(current, nestedResults => {
            results = results.concat(nestedResults);
            processEntry();
          });
        }

        current.file(file => {
          results.push(file);
          return processEntry();
        }, () => {
          return processEntry();
        });
      };
      processEntry();
    });
  }

  render() {
    const {
      accept,
      activeClassName,
      inputProps,
      multiple,
      name,
      rejectClassName,
      ...rest
    } = this.props;

    let {
      activeStyle,
      className,
      rejectStyle,
      style,
      ...props // eslint-disable-line prefer-const
    } = rest;

    const { isDragActive, isDragReject } = this.state;

    className = className || '';

    if (isDragActive && activeClassName) {
      className += ' ' + activeClassName;
    }
    if (isDragReject && rejectClassName) {
      className += ' ' + rejectClassName;
    }

    if (!className && !style && !activeStyle && !rejectStyle) {
      style = {
        width: 200,
        height: 200,
        borderWidth: 2,
        borderColor: '#666',
        borderStyle: 'dashed',
        borderRadius: 5
      };
      activeStyle = {
        borderStyle: 'solid',
        backgroundColor: '#eee'
      };
      rejectStyle = {
        borderStyle: 'solid',
        backgroundColor: '#ffdddd'
      };
    }

    let appliedStyle;
    if (activeStyle && isDragActive) {
      appliedStyle = {
        ...style,
        ...activeStyle
      };
    } else if (rejectStyle && isDragReject) {
      appliedStyle = {
        ...style,
        ...rejectStyle
      };
    } else {
      appliedStyle = {
        ...style
      };
    }

    const inputAttributes = {
      accept: !(supportMultiple && multiple) ? accept : null,
      type: 'file',
      style: { display: 'none' },
      multiple: supportMultiple && multiple,
      ref: el => this.fileInputEl = el,
      onChange: this.onDrop
    };

    if (name && name.length) {
      inputAttributes.name = name;
    }

    return (
      <div
        className={className}
        style={appliedStyle}
        {...props /* expand user provided props first so event handlers are never overridden */}
        onClick={this.onClick}
        onDragEnter={this.onDragEnter}
        onDragOver={this.onDragOver}
        onDragLeave={this.onDragLeave}
        onDrop={this.onDrop}
      >
        {this.props.children}
        <input
          {...inputProps /* expand user provided inputProps first so inputAttributes override them */}
          {...inputAttributes}
        />
      </div>
    );
  }
}

Dropzone.defaultProps = {
  disablePreview: false,
  disableClick: false,
  multiple: true
};

Dropzone.propTypes = {
  onDrop: React.PropTypes.func,
  onDropAccepted: React.PropTypes.func,
  onDropRejected: React.PropTypes.func,
  onDragEnter: React.PropTypes.func,
  onDragLeave: React.PropTypes.func,

  children: React.PropTypes.node,
  style: React.PropTypes.object,
  activeStyle: React.PropTypes.object,
  rejectStyle: React.PropTypes.object,
  className: React.PropTypes.string,
  activeClassName: React.PropTypes.string,
  rejectClassName: React.PropTypes.string,

  disablePreview: React.PropTypes.bool,
  disableClick: React.PropTypes.bool,

  inputProps: React.PropTypes.object,
  multiple: React.PropTypes.bool,
  accept: React.PropTypes.string,
  name: React.PropTypes.string
};

export default Dropzone;
