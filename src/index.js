/* eslint prefer-template: 0 */

import React from 'react'
import PropTypes from 'prop-types'
import accepts from 'attr-accept'
import getDataTransferItems from './getDataTransferItems'
import { composeEventHandlers } from './utils'

const supportMultiple = typeof document !== 'undefined' && document && document.createElement
  ? 'multiple' in document.createElement('input')
  : true

function fileAccepted(file, accept) {
  // Firefox versions prior to 53 return a bogus MIME type for every file drag, so dragovers with
  // that MIME type will always be accepted
  return file.type === 'application/x-moz-file' || accepts(file, accept)
}

class Dropzone extends React.Component {
  static onDocumentDragOver(evt) {
    // allow the entire document to be a drag target
    evt.preventDefault()
  }

  state = {
    draggedFiles: [],
    acceptedFiles: [],
    rejectedFiles: []
  }

  componentDidMount() {
    const { preventDropOnDocument } = this.props
    this.dragTargets = []

    if (preventDropOnDocument) {
      document.addEventListener('dragover', Dropzone.onDocumentDragOver, false)
      document.addEventListener('drop', this.onDocumentDrop, false)
    }
    // Tried implementing addEventListener, but didn't work out
    document.body.onfocus = this.onFileDialogCancel
  }

  componentWillUnmount() {
    const { preventDropOnDocument } = this.props
    if (preventDropOnDocument) {
      document.removeEventListener('dragover', Dropzone.onDocumentDragOver)
      document.removeEventListener('drop', this.onDocumentDrop)
    }
    // Can be replaced with removeEventListener, if addEventListener works
    document.body.onfocus = null
  }

  onDocumentDrop = evt => {
    if (this.node.contains(evt.target)) {
      // if we intercepted an event for our instance, let it propagate down to the instance's onDrop handler
      return
    }
    evt.preventDefault()
    this.dragTargets = []
  }

  onDragStart = evt => {
    if (this.props.onDragStart) {
      this.props.onDragStart.call(this, evt)
    }
  }

  onDragEnter = evt => {
    evt.preventDefault()

    // Count the dropzone and any children that are entered.
    if (this.dragTargets.indexOf(evt.target) === -1) {
      this.dragTargets.push(evt.target)
    }

    this.setState({
      isDragActive: true, // Do not rely on files for the drag state. It doesn't work in Safari.
      draggedFiles: getDataTransferItems(evt)
    })

    if (this.props.onDragEnter) {
      this.props.onDragEnter.call(this, evt)
    }
  }

  onDragOver = evt => {
    // eslint-disable-line class-methods-use-this
    evt.preventDefault()
    evt.stopPropagation()
    try {
      evt.dataTransfer.dropEffect = 'copy' // eslint-disable-line no-param-reassign
    } catch (err) {
      // continue regardless of error
    }

    if (this.props.onDragOver) {
      this.props.onDragOver.call(this, evt)
    }
    return false
  }

  onDragLeave = evt => {
    evt.preventDefault()

    // Only deactivate once the dropzone and all children have been left.
    this.dragTargets = this.dragTargets.filter(el => el !== evt.target && this.node.contains(el))
    if (this.dragTargets.length > 0) {
      return
    }

    // Clear dragging files state
    this.setState({
      isDragActive: false,
      draggedFiles: []
    })

    if (this.props.onDragLeave) {
      this.props.onDragLeave.call(this, evt)
    }
  }

  onDrop = evt => {
    const { onDrop, onDropAccepted, onDropRejected, multiple, disablePreview, accept } = this.props
    const fileList = getDataTransferItems(evt)
    const acceptedFiles = []
    const rejectedFiles = []

    // Stop default browser behavior
    evt.preventDefault()

    // Reset the counter along with the drag on a drop.
    this.dragTargets = []
    this.isFileDialogActive = false

    fileList.forEach(file => {
      if (!disablePreview) {
        try {
          file.preview = window.URL.createObjectURL(file) // eslint-disable-line no-param-reassign
        } catch (err) {
          if (process.env.NODE_ENV !== 'production') {
            console.error('Failed to generate preview for file', file, err) // eslint-disable-line no-console
          }
        }
      }

      if (fileAccepted(file, accept) && this.fileMatchSize(file)) {
        acceptedFiles.push(file)
      } else {
        rejectedFiles.push(file)
      }
    })

    if (!multiple) {
      // if not in multi mode add any extra accepted files to rejected.
      // This will allow end users to easily ignore a multi file drop in "single" mode.
      rejectedFiles.push(...acceptedFiles.splice(1))
    }

    if (onDrop) {
      onDrop.call(this, acceptedFiles, rejectedFiles, evt)
    }

    if (rejectedFiles.length > 0 && onDropRejected) {
      onDropRejected.call(this, rejectedFiles, evt)
    }

    if (acceptedFiles.length > 0 && onDropAccepted) {
      onDropAccepted.call(this, acceptedFiles, evt)
    }

    // Clear files value
    this.draggedFiles = null

    // Reset drag state
    this.setState({
      isDragActive: false,
      draggedFiles: [],
      acceptedFiles,
      rejectedFiles
    })
  }

  onClick = evt => {
    const { onClick, disableClick } = this.props
    if (!disableClick) {
      evt.stopPropagation()

      if (onClick) {
        onClick.call(this, evt)
      }

      // in IE11/Edge the file-browser dialog is blocking, ensure this is behind setTimeout
      // this is so react can handle state changes in the onClick prop above above
      // see: https://github.com/okonet/react-dropzone/issues/450
      setTimeout(this.open.bind(this), 0)
    }
  }

  /* eslint-disable */
  onInputElementClick = evt => {
    evt.stopPropagation()
  }
  /* eslint-enable */

  onFileDialogCancel = () => {
    // timeout will not recognize context of this method
    const { onFileDialogCancel } = this.props
    const { fileInputEl } = this
    let { isFileDialogActive } = this
    // execute the timeout only if the onFileDialogCancel is defined and FileDialog
    // is opened in the browser
    if (onFileDialogCancel && isFileDialogActive) {
      setTimeout(() => {
        // Returns an object as FileList
        const FileList = fileInputEl.files
        if (!FileList.length) {
          isFileDialogActive = false
          onFileDialogCancel()
        }
      }, 300)
    }
  }

  setRef = ref => {
    this.node = ref
  }

  setInputRef = ref => {
    this.fileInputEl = ref
  }

  fileMatchSize(file) {
    return file.size <= this.props.maxSize && file.size >= this.props.minSize
  }

  allFilesAccepted(files) {
    return files.every(file => fileAccepted(file, this.props.accept))
  }

  getRootProps = (
    {
      refKey = 'ref',
      onClick,
      onDragStart,
      onDragEnter,
      onDragOver,
      onDragLeave,
      onDrop,
      ...rest
    } = {}
  ) => ({
    onClick: onClick ? composeEventHandlers(onClick, this.onClick) : this.onClick,
    onDragStart: onDragStart
      ? composeEventHandlers(onDragStart, this.onDragStart)
      : this.onDragStart,
    onDragEnter: onDragEnter
      ? composeEventHandlers(onDragEnter, this.onDragEnter)
      : this.onDragEnter,
    onDragOver: onDragOver ? composeEventHandlers(onDragOver, this.onDragOver) : this.onDragOver,
    onDragLeave: onDragLeave
      ? composeEventHandlers(onDragLeave, this.onDragLeave)
      : this.onDragLeave,
    onDrop: onDrop ? composeEventHandlers(onDrop, this.onDrop) : this.onDrop,
    [refKey]: this.setRef,
    ...rest
  })

  getInputProps = ({ refKey = 'ref', onChange, onClick, ...rest } = {}) => {
    const { accept, multiple, name } = this.props
    const inputProps = {
      accept,
      type: 'file',
      style: { display: 'none' },
      multiple: supportMultiple && multiple,
      onChange: composeEventHandlers(onChange, this.onDrop),
      onClick: composeEventHandlers(onClick, this.onInputElementClick),
      autoComplete: 'off',
      [refKey]: this.setInputRef
    }

    if (name && name.length) {
      inputProps.name = name
    }

    return {
      ...inputProps,
      ...rest
    }
  }

  /**
   * Open system file upload dialog.
   *
   * @public
   */
  open = () => {
    this.isFileDialogActive = true
    this.fileInputEl.value = null
    this.fileInputEl.click()
  }

  render() {
    const { multiple, children, render } = this.props
    const { isDragActive, draggedFiles, acceptedFiles, rejectedFiles } = this.state

    const filesCount = draggedFiles.length
    const isMultipleAllowed = multiple || filesCount <= 1
    const isDragAccept = filesCount > 0 && this.allFilesAccepted(draggedFiles)
    const isDragReject = filesCount > 0 && (!isDragAccept || !isMultipleAllowed)

    const renderFn = children || render
    return renderFn({
      getRootProps: this.getRootProps,
      getInputProps: this.getInputProps,
      isDragActive,
      isDragAccept,
      isDragReject,
      draggedFiles,
      acceptedFiles,
      rejectedFiles
    })
  }
}

Dropzone.propTypes = {
  /**
   * Allow specific types of files. See https://github.com/okonet/attr-accept for more information.
   * Keep in mind that mime type determination is not reliable accross platforms. CSV files,
   * for example, are reported as text/plain under macOS but as application/vnd.ms-excel under
   * Windows. In some cases there might not be a mime type set at all.
   * See: https://github.com/okonet/react-dropzone/issues/276
   */
  accept: PropTypes.string,

  /**
   * Render function that renders the actual component. It receives object with the following properties,
   * @param {Function} getRootProps
   * @param {Function} getInputProps
   * @param {Boolean} isDragActive
   * @param {Boolean} isDragAccept
   * @param {Boolean} isDragReject
   * @param {Array} draggedFiles
   * @param {Array} acceptedFiles
   * @param {Array} rejectedFiles
   */
  children: PropTypes.func,

  /**
   * Alternative render function to children prop
   */
  render: PropTypes.func,

  /**
   * Disallow clicking on the dropzone container to open file dialog
   */
  disableClick: PropTypes.bool,

  /**
   * Enable/disable preview generation
   */
  disablePreview: PropTypes.bool,

  /**
   * If false, allow dropped items to take over the current browser window
   */
  preventDropOnDocument: PropTypes.bool,

  /**
   * Allow dropping multiple files
   */
  multiple: PropTypes.bool,

  /**
   * `name` attribute for the input tag
   */
  name: PropTypes.string,

  /**
   * Maximum file size
   */
  maxSize: PropTypes.number,

  /**
   * Minimum file size
   */
  minSize: PropTypes.number,

  /**
   * onClick callback
   * @param {Event} event
   */
  onClick: PropTypes.func,

  /** The `onDrop` method that accepts two arguments. The first argument represents the accepted files and the second argument the rejected files.

   ```javascript
   function onDrop(acceptedFiles, rejectedFiles) {
  // do stuff with files...
}
   ```

   Files accepted or rejected based on `accept` prop. This must be a valid [MIME type](http://www.iana.org/assignments/media-types/media-types.xhtml) according to [input element specification](https://www.w3.org/wiki/HTML/Elements/input/file).

   Please note that `onDrop` method will always be called regardless if dropped file was accepted or rejected. The `onDropAccepted` method will be called if all dropped files were accepted and the `onDropRejected` method will be called if any of the dropped files was rejected.

   Using `react-dropzone` is similar to using a file form field, but instead of getting the `files` property from the field, you listen to the `onDrop` callback to handle the files. Simple explanation here: http://abandon.ie/notebook/simple-file-uploads-using-jquery-ajax

   Specifying the `onDrop` method, provides you with an array of [Files](https://developer.mozilla.org/en-US/docs/Web/API/File) which you can then send to a server. For example, with [SuperAgent](https://github.com/visionmedia/superagent) as a http/ajax library:

   ```javascript
   function onDrop(acceptedFiles) {
  const req = request.post('/upload')
  acceptedFiles.forEach(file => {
      req.attach(file.name, file)
  })
  req.end(callback)
}
   ```
   */
  onDrop: PropTypes.func,

  /**
   * onDropAccepted callback
   */
  onDropAccepted: PropTypes.func,

  /**
   * onDropRejected callback
   */
  onDropRejected: PropTypes.func,

  /**
   * onDragStart callback
   */
  onDragStart: PropTypes.func,

  /**
   * onDragEnter callback
   */
  onDragEnter: PropTypes.func,

  /**
   * onDragOver callback
   */
  onDragOver: PropTypes.func,

  /**
   * onDragLeave callback
   */
  onDragLeave: PropTypes.func,

  /**
   * Provide a callback on clicking the cancel button of the file dialog
   */
  onFileDialogCancel: PropTypes.func
}

Dropzone.defaultProps = {
  preventDropOnDocument: true,
  disablePreview: false,
  disableClick: false,
  multiple: true,
  maxSize: Infinity,
  minSize: 0
}

export default Dropzone
