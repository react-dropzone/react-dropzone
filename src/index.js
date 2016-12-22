/* eslint prefer-template: 0 */
import React from 'react';
import accepts from 'attr-accept';
import getDataTransferItems from './getDataTransferItems';

const supportMultiple = (typeof document !== 'undefined' && document && document.createElement) ?
  'multiple' in document.createElement('input') :
  true;

class Dropzone extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.onClick = this.onClick.bind(this);
    this.onDragStart = this.onDragStart.bind(this);
    this.onDragEnter = this.onDragEnter.bind(this);
    this.onDragLeave = this.onDragLeave.bind(this);
    this.onDragOver = this.onDragOver.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.onFileDialogCancel = this.onFileDialogCancel.bind(this);
    this.fileAccepted = this.fileAccepted.bind(this);
    this.isFileDialogActive = false;
    this.state = {
      isDragActive: false
    };
  }

  componentDidMount() {
    this.enterCounter = 0;
    // Tried implementing addEventListener, but didn't work out
    document.body.onfocus = this.onFileDialogCancel;
  }

  componentWillUnmount() {
    // Can be replaced with removeEventListener, if addEventListener works
    document.body.onfocus = null;
  }

  onDragStart(e) {
    if (this.props.onDragStart) {
      this.props.onDragStart.call(this, e);
    }
  }

  onDragEnter(e) {
    e.preventDefault();

    // Count the dropzone and any children that are entered.
    ++this.enterCounter;

    const allFilesAccepted = this.allFilesAccepted(getDataTransferItems(e, this.props.multiple));

    this.setState({
      isDragActive: allFilesAccepted,
      isDragReject: !allFilesAccepted
    });

    if (this.props.onDragEnter) {
      this.props.onDragEnter.call(this, e);
    }
  }

  onDragOver(e) { // eslint-disable-line class-methods-use-this
    e.preventDefault();
    e.stopPropagation();
    try {
      e.dataTransfer.dropEffect = 'copy'; // eslint-disable-line no-param-reassign
    } catch (err) {
      // continue regardless of error
    }
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
    const { onDrop, onDropAccepted, onDropRejected, multiple, disablePreview } = this.props;
    const fileList = getDataTransferItems(e, multiple);
    const acceptedFiles = [];
    const rejectedFiles = [];

    // Stop default browser behavior
    e.preventDefault();

    // Reset the counter along with the drag on a drop.
    this.enterCounter = 0;
    this.isFileDialogActive = false;

    fileList.forEach((file) => {
      if (!disablePreview && accepts(file, 'image/*')) {
        file.preview = window.URL.createObjectURL(file); // eslint-disable-line no-param-reassign
      }

      if (this.fileAccepted(file) && this.fileMatchSize(file)) {
        acceptedFiles.push(file);
      } else {
        rejectedFiles.push(file);
      }
    });

    if (onDrop) {
      onDrop.call(this, acceptedFiles, rejectedFiles, e);
    }

    if (rejectedFiles.length > 0 && onDropRejected) {
      onDropRejected.call(this, rejectedFiles, e);
    }

    if (acceptedFiles.length > 0 && onDropAccepted) {
      onDropAccepted.call(this, acceptedFiles, e);
    }

    // Reset drag state
    this.setState({
      isDragActive: false,
      isDragReject: false
    });
  }

  onClick(e) {
    e.stopPropagation();
    const { onClick, disableClick } = this.props;
    if (!disableClick) {
      this.open();
      if (onClick) {
        onClick.call(this, e);
      }
    }
  }

  onFileDialogCancel() {
    // timeout will not recognize context of this method
    const { onFileDialogCancel } = this.props;
    const { fileInputEl } = this;
    let { isFileDialogActive } = this;
    // execute the timeout only if the onFileDialogCancel is defined and FileDialog
    // is opened in the browser
    if (onFileDialogCancel && isFileDialogActive) {
      setTimeout(() => {
        // Returns an object as FileList
        const FileList = fileInputEl.files;
        if (!FileList.length) {
          isFileDialogActive = false;
          onFileDialogCancel();
        }
      }, 300);
    }
  }

  fileAccepted(file) {
    return accepts(file, this.props.accept);
  }

  fileMatchSize(file) {
    return file.size <= this.props.maxSize && file.size >= this.props.minSize;
  }

  allFilesAccepted(files) {
    return files.every(this.fileAccepted);
  }

  open() {
    this.isFileDialogActive = true;
    this.fileInputEl.value = null;
    this.fileInputEl.click();
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
      accept,
      type: 'file',
      style: { display: 'none' },
      multiple: supportMultiple && multiple,
      ref: el => this.fileInputEl = el, // eslint-disable-line
      onChange: this.onDrop
    };

    if (name && name.length) {
      inputAttributes.name = name;
    }

    // Remove custom properties before passing them to the wrapper div element
    const customProps = [
      'acceptedFiles',
      'disablePreview',
      'disableClick',
      'onDropAccepted',
      'onDropRejected',
      'onFileDialogCancel',
      'maxSize',
      'minSize'
    ];
    const divProps = { ...props };
    customProps.forEach(prop => delete divProps[prop]);

    return (
      <div
        className={className}
        style={appliedStyle}
        {...divProps/* expand user provided props first so event handlers are never overridden */}
        onClick={this.onClick}
        onDragStart={this.onDragStart}
        onDragEnter={this.onDragEnter}
        onDragOver={this.onDragOver}
        onDragLeave={this.onDragLeave}
        onDrop={this.onDrop}
      >
        {this.props.children}
        <input
          {...inputProps/* expand user provided inputProps first so inputAttributes override them */}
          {...inputAttributes}
        />
      </div>
    );
  }
}

Dropzone.defaultProps = {
  disablePreview: false,
  disableClick: false,
  multiple: true,
  maxSize: Infinity,
  minSize: 0
};

Dropzone.propTypes = {
  onClick: React.PropTypes.func,
  onDrop: React.PropTypes.func,
  onDropAccepted: React.PropTypes.func,
  onDropRejected: React.PropTypes.func,
  onDragStart: React.PropTypes.func,
  onDragEnter: React.PropTypes.func,
  onDragLeave: React.PropTypes.func,

  children: React.PropTypes.node, // Contents of the dropzone
  style: React.PropTypes.object, // CSS styles to apply
  activeStyle: React.PropTypes.object, // CSS styles to apply when drop will be accepted
  rejectStyle: React.PropTypes.object, // CSS styles to apply when drop will be rejected
  className: React.PropTypes.string, // Optional className
  activeClassName: React.PropTypes.string, // className for accepted state
  rejectClassName: React.PropTypes.string, // className for rejected state

  disablePreview: React.PropTypes.bool, // Enable/disable preview generation
  disableClick: React.PropTypes.bool, // Disallow clicking on the dropzone container to open file dialog
  onFileDialogCancel: React.PropTypes.func, // Provide a callback on clicking the cancel button of the file dialog

  inputProps: React.PropTypes.object, // Pass additional attributes to the <input type="file"/> tag
  multiple: React.PropTypes.bool, // Allow dropping multiple files
  accept: React.PropTypes.string, // Allow specific types of files. See https://github.com/okonet/attr-accept for more information
  name: React.PropTypes.string, // name attribute for the input tag
  maxSize: React.PropTypes.number,
  minSize: React.PropTypes.number
};

export default Dropzone;
