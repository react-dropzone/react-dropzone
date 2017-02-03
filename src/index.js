/* @flow */
/* eslint prefer-template: 0 */
import React from 'react';
import accepts from 'attr-accept';
import getDataTransferItems from './getDataTransferItems';

type InputAttributes = {
  accept: string,
  type: string,
  style: Object,
  multiple: boolean,
  name?: string,
  ref: Function,
  onChange: Function
};

export type Props = {
  onClick: Function,
  onDrop: Function,
  onDropAccepted: Function,
  onDropRejected: Function,
  onDragStart: Function,
  onDragEnter: Function,
  onDragOver: Function,
  onDragLeave: Function,

  children: any, // Contents of the dropzone
  style: Object, // CSS styles to apply
  activeStyle: Object, // CSS styles to apply when drop will be accepted
  rejectStyle: Object, // CSS styles to apply when drop will be rejected
  className: string, // Optional className
  activeClassName: string, // className for accepted state
  rejectClassName: string, // className for rejected state

  disablePreview: boolean, // Enable/disable preview generation
  disableClick: boolean, // Disallow clicking on the dropzone container to open file dialog
  onFileDialogCancel: Function, // Provide a callback on clicking the cancel button of the file dialog

  inputProps: Object, // Pass additional attributes to the <input type="file"/> tag
  multiple: boolean, // Allow dropping multiple files
  accept: string, // Allow specific types of files. See https://github.com/okonet/attr-accept for more information
  name: string, // name attribute for the input tag
  maxSize: number,
  minSize: number
};


const supportMultiple = (typeof document !== 'undefined' && document && document.createElement) ?
  'multiple' in document.createElement('input') :
  true;

class Dropzone extends React.Component {
  props: Props;

  static defaultProps: {
    disablePreview: boolean,
    disableClick: boolean,
    multiple: boolean,
    maxSize: number,
    minSize: number
  };

  state: {
    isDragActive: boolean,
    isDragReject?: boolean
  };

  fileInputEl: Object;
  isFileDialogActive: boolean;
  enterCounter: number;

  constructor(props: Object, context: Object) {
    super(props, context);
    (this:any).onClick = this.onClick.bind(this);
    (this:any).onDragStart = this.onDragStart.bind(this);
    (this:any).onDragEnter = this.onDragEnter.bind(this);
    (this:any).onDragLeave = this.onDragLeave.bind(this);
    (this:any).onDragOver = this.onDragOver.bind(this);
    (this:any).onDrop = this.onDrop.bind(this);
    (this:any).onFileDialogCancel = this.onFileDialogCancel.bind(this);
    (this:any).fileAccepted = this.fileAccepted.bind(this);
    this.isFileDialogActive = false;
    this.state = {
      isDragActive: false
    };
  }

  componentDidMount() {
    this.enterCounter = 0;
    // Tried implementing addEventListener, but didn't work out
    if (document.body instanceof HTMLElement) {
      document.body.onfocus = this.onFileDialogCancel;
    }
  }

  componentWillUnmount() {
    // Can be replaced with removeEventListener, if addEventListener works
    if (document.body instanceof HTMLElement) {
      document.body.onfocus = null;
    }
  }

  onDragStart(e: Object) {
    if (this.props.onDragStart) {
      this.props.onDragStart.call(this, e);
    }
  }

  onDragEnter(e: Object) {
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

  onDragOver(e: Object) { // eslint-disable-line class-methods-use-this
    e.preventDefault();
    e.stopPropagation();
    try {
      e.dataTransfer.dropEffect = 'copy'; // eslint-disable-line no-param-reassign
    } catch (err) {
      // continue regardless of error
    }

    if (this.props.onDragOver) {
      this.props.onDragOver.call(this, e);
    }
    return false;
  }

  onDragLeave(e: Object) {
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

  onDrop(e: Object) {
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
      if (!disablePreview) {
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

  onClick(e: Object) {
    const { onClick, disableClick } = this.props;
    if (!disableClick) {
      e.stopPropagation();
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

  fileAccepted(file: Object) {
    return accepts(file, this.props.accept);
  }

  fileMatchSize(file: Object) {
    return file.size <= this.props.maxSize && file.size >= this.props.minSize;
  }

  allFilesAccepted(files: Array<Object>) {
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

    const inputAttributes: InputAttributes = {
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

export default Dropzone;
