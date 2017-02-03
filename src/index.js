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
  ref: (el: HTMLInputElement) => {},
  onChange: (event: SyntheticDragEvent) => void
};

type FileType = File & {
  preview?: string
};

export type Props = {
  onClick: (event: SyntheticMouseEvent) => void,
  onDrop: (acceptedFiles: Array<FileType>, rejectedFiles: Array<FileType>, event: SyntheticDragEvent) => void,
  onDropAccepted: (acceptedFiles: Array<FileType>, event: SyntheticDragEvent) => void,
  onDropRejected: (rejectedFiles: Array<FileType>, event: SyntheticDragEvent) => void,
  onDragStart: (event: SyntheticMouseEvent) => void,
  onDragEnter: (event: SyntheticMouseEvent) => void,
  onDragOver: (event: SyntheticMouseEvent) => void,
  onDragLeave: (event: SyntheticMouseEvent) => void,

  children: any, // Contents of the dropzone
  style: Object, // CSS styles to apply
  activeStyle: Object, // CSS styles to apply when drop will be accepted
  rejectStyle: Object, // CSS styles to apply when drop will be rejected
  className: string, // Optional className
  activeClassName: string, // className for accepted state
  rejectClassName: string, // className for rejected state

  disablePreview: boolean, // Enable/disable preview generation
  disableClick: boolean, // Disallow clicking on the dropzone container to open file dialog
  onFileDialogCancel: () => void, // Provide a callback on clicking the cancel button of the file dialog

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

  onClick: (event: SyntheticMouseEvent) => void;
  onDragStart: (event: SyntheticDragEvent) => void;
  onDragEnter: (event: SyntheticDragEvent) => void;
  onDragLeave: (event: SyntheticDragEvent) => void;
  onDragOver: (event: SyntheticDragEvent) => void;
  onDrop: (event: SyntheticDragEvent) => void;
  onFileDialogCancel: () => void;
  fileAccepted: (file: File) => void;

  fileInputEl: HTMLInputElement;
  isFileDialogActive: boolean;
  enterCounter: number;

  constructor(props: Object, context: Object) {
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

  onDragStart(event: SyntheticDragEvent): void {
    if (this.props.onDragStart) {
      this.props.onDragStart.call(this, event);
    }
  }

  onDragEnter(event: SyntheticDragEvent): void {
    event.preventDefault();

    // Count the dropzone and any children that are entered.
    ++this.enterCounter;

    const allFilesAccepted: boolean = this.allFilesAccepted(getDataTransferItems(event, this.props.multiple));

    this.setState({
      isDragActive: allFilesAccepted,
      isDragReject: !allFilesAccepted
    });

    if (this.props.onDragEnter) {
      this.props.onDragEnter.call(this, event);
    }
  }

  onDragOver(event: SyntheticDragEvent): void { // eslint-disable-line class-methods-use-this
    event.preventDefault();
    event.stopPropagation();
    try {
      event.dataTransfer.dropEffect = 'copy'; // eslint-disable-line no-param-reassign
    } catch (err) {
      // continue regardless of error
    }

    if (this.props.onDragOver) {
      this.props.onDragOver.call(this, event);
    }
  }

  onDragLeave(event: SyntheticDragEvent): void {
    event.preventDefault();

    // Only deactivate once the dropzone and all children was left.
    if (--this.enterCounter > 0) {
      return;
    }

    this.setState({
      isDragActive: false,
      isDragReject: false
    });

    if (this.props.onDragLeave) {
      this.props.onDragLeave.call(this, event);
    }
  }

  onDrop(event: SyntheticDragEvent): void {
    const { onDrop, onDropAccepted, onDropRejected, multiple, disablePreview } = this.props;
    const fileList: Array<File> = getDataTransferItems(event, multiple);
    const acceptedFiles: Array<FileType> = [];
    const rejectedFiles: Array<FileType> = [];

    // Stop default browser behavior
    event.preventDefault();

    // Reset the counter along with the drag on a drop.
    this.enterCounter = 0;
    this.isFileDialogActive = false;

    fileList.forEach((file: FileType) => {
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
      onDrop.call(this, acceptedFiles, rejectedFiles, event);
    }

    if (rejectedFiles.length > 0 && onDropRejected) {
      onDropRejected.call(this, rejectedFiles, event);
    }

    if (acceptedFiles.length > 0 && onDropAccepted) {
      onDropAccepted.call(this, acceptedFiles, event);
    }

    // Reset drag state
    this.setState({
      isDragActive: false,
      isDragReject: false
    });
  }

  onClick(event: SyntheticMouseEvent): void {
    const { onClick, disableClick } = this.props;
    if (!disableClick) {
      event.stopPropagation();
      this.open();
      if (onClick) {
        onClick.call(this, event);
      }
    }
  }

  onFileDialogCancel(): void {
    // timeout will not recognize context of this method
    const { onFileDialogCancel } = this.props;
    const { fileInputEl } = this;
    let { isFileDialogActive } = this;
    // execute the timeout only if the onFileDialogCancel is defined and FileDialog
    // is opened in the browser
    if (onFileDialogCancel && isFileDialogActive) {
      setTimeout(() => {
        // Returns an object as FileList
        const fileList: FileList = fileInputEl.files;
        if (!fileList.length) {
          isFileDialogActive = false;
          onFileDialogCancel();
        }
      }, 300);
    }
  }

  fileAccepted(file: FileType): boolean {
    return accepts(file, this.props.accept);
  }

  fileMatchSize(file: FileType): boolean {
    return file.size <= this.props.maxSize && file.size >= this.props.minSize;
  }

  allFilesAccepted(files: Array<FileType>): boolean {
    return files.every(this.fileAccepted);
  }

  open(): void {
    this.isFileDialogActive = true;
    this.fileInputEl.value = '';
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

Dropzone.propTypes = {
  onClick: React.PropTypes.func,
  onDrop: React.PropTypes.func,
  onDropAccepted: React.PropTypes.func,
  onDropRejected: React.PropTypes.func,
  onDragStart: React.PropTypes.func,
  onDragEnter: React.PropTypes.func,
  onDragOver: React.PropTypes.func,
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
  accept: React.PropTypes.string, // Allow specific types of files. See https://github.com/okonet/attrccept for more information
  name: React.PropTypes.string, // name attribute for the input tag
  maxSize: React.PropTypes.number,
  minSize: React.PropTypes.number
};

export default Dropzone;
