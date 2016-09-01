/* eslint prefer-template: 0 */

import accepts from 'attr-accept';
import React from 'react';

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

    this.state = {
      isDragActive: false
    };
  }

  componentDidMount() {
    this.enterCounter = 0;
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
    e.dataTransfer.dropEffect = 'copy'; // eslint-disable-line no-param-reassign
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

    const droppedFiles = e.dataTransfer ? e.dataTransfer.files : e.target.files;
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

    if (this.allFilesAccepted(files) && this.allFilesMatchSize(files)) {
      if (this.props.onDrop) {
        this.props.onDrop.call(this, files, e);
      }

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

  allFilesAccepted(files) {
    return files.every(file => accepts(file, this.props.accept));
  }

  allFilesMatchSize(files) {
    return files.every(file => (file.size <= this.props.maxSize && file.size >= this.props.minSize));
  }

  open() {
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
    const customProps = ['disablePreview', 'disableClick', 'onDropAccepted', 'onDropRejected', 'maxSize', 'minSize'];
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
  // Overriding drop behavior
  onDrop: React.PropTypes.func,
  onDropAccepted: React.PropTypes.func,
  onDropRejected: React.PropTypes.func,

  // Overriding drag behavior
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

  inputProps: React.PropTypes.object, // Pass additional attributes to the <input type="file"/> tag
  multiple: React.PropTypes.bool, // Allow dropping multiple files
  accept: React.PropTypes.string, // Allow specific types of files. See https://github.com/okonet/attr-accept for more information
  name: React.PropTypes.string, // name attribute for the input tag
  maxSize: React.PropTypes.number,
  minSize: React.PropTypes.number
};

export default Dropzone;
