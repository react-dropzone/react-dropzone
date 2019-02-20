import { useState, useEffect, useRef } from 'react';
import {
  isIeOrEdge,
  fileAccepted,
  fileMatchSize,
  supportMultiple,
  allFilesAccepted,
  onDocumentDragOver,
  isDefaultPrevented,
  isDragDataWithFiles,
  composeEventHandlers,
  isPropagationStopped,
  getDataTransferItems as defaultGetDataTransferItem,
} from './utils';

const useDropzone = ({
  accept = '',
  minSize = 0,
  multiple = true,
  disabled = false,
  maxSize = Infinity,
  disableClick = false,
  preventDropOnDocument = true,
  getDataTransferItems = defaultGetDataTransferItem,
  ...props
}) => {
  let dragTargets = [];
  const nodeRef = useRef(null);
  const inputRef = useRef(null);
  const [isFocused, setFocusStatus] = useState(false);
  const [isDragActive, setDragStatus] = useState(false);
  const [draggedFiles, setDraggedFiles] = useState([]);
  const [acceptedFiles, setAcceptedFiles] = useState([]);
  const [rejectedFiles, setRejectedFiles] = useState([]);
  const [isFileDialogActive, setFileDialogStatus] = useState(false);

  const onInputElementClick = evt => evt.stopPropagation();
  const composeHandler = handler => props.disabled ? null : handler;

  const openFileDialog = () => {
    setFileDialogStatus(true);

    if (inputRef) {
      inputRef.value = null;
      inputRef.click();
    }
  };

  const onFileDialogCancel = () => {
    if (isFileDialogActive) {
      setTimeout(() => {
        if (inputRef !== null) {
          const { files } = inputRef;

          if (!files.length) {
            setFileDialogStatus(false);

            if (typeof props.onFileDialogCancel === 'function') {
              // timeout will not recognize context of this method
              props.onFileDialogCancel()
            }
          }
        }
      }, 300);
    }
  };

  const onDocumentDrop = evt => {
    if (!(nodeRef && nodeRef.contains(evt.target))) {
      // if we intercepted an event for our instance, let it propagate down to the instance's onDrop handler
      dragTargets = [];
      evt.preventDefault();
    }
  };

  const onDragStart = evt => {
    evt.persist();

    if (props.onDragStart && isDragDataWithFiles(evt)) {
      props.onDragStart.call(evt);
    }
  };

  const onDragEnter = evt => {
    evt.preventDefault();

    // Count the dropzone and any children that are entered.
    if (dragTargets.indexOf(evt.target) === -1) {
      dragTargets.push(evt.target);
    }

    evt.persist();

    if (isDragDataWithFiles(evt)) {
      Promise.resolve(getDataTransferItems(evt)).then(newDraggedFiles => {
        if (!isPropagationStopped(evt)) {
          // Do not rely on files for the drag state. It doesn't work in Safari.
          setDragStatus(true);
          setDraggedFiles(newDraggedFiles);
        }
      });

      if (props.onDragEnter) {
        props.onDragEnter.call(evt);
      }
    }
  };

  const onDragOver = evt => {
    evt.preventDefault();
    evt.persist();

    if (evt.dataTransfer) {
      evt.dataTransfer.dropEffect = 'copy';
    }

    if (props.onDragOver && isDragDataWithFiles(evt)) {
      props.onDragOver.call(evt);
    }

    return false;
  };

  const onDragLeave = evt => {
    evt.preventDefault();
    evt.persist();

    // Only deactivate once the dropzone and all children have been left.
    dragTargets = dragTargets.filter(el => el !== evt.target && nodeRef.contains(el));

    if (dragTargets.length > 0) {
      // Clear dragging files state
      setDraggedFiles([]);
      setDragStatus(false);

      if (props.onDragLeave && isDragDataWithFiles(evt)) {
        props.onDragLeave.call(evt);
      }
    }
  };

  const onDrop = evt => {
    const {
      onDropAccepted,
      onDropRejected,
    } = props;

    evt.preventDefault();
    evt.persist();

    // Reset the counter along with the drag on a drop.
    dragTargets = [];
    setDraggedFiles([]);
    setFileDialogStatus(false);

    if (isDragDataWithFiles(evt)) {
      Promise.resolve(getDataTransferItems(evt)).then(fileList => {
        const localAcceptedFiles = []
        const localRejectedFiles = []

        if (isPropagationStopped(evt)) {
          return
        }

        fileList.forEach(file => {
          if (
            fileAccepted(file, accept) &&
            fileMatchSize(file, props.maxSize, props.minSize)
          ) {
            localAcceptedFiles.push(file)
          } else {
            localRejectedFiles.push(file)
          }
        });

        if (!multiple && localAcceptedFiles.length > 1) {
          // if not in multi mode add any extra accepted files to rejected.
          // This will allow end users to easily ignore a multi file drop in "single" mode.
          localRejectedFiles.push(...localAcceptedFiles.splice(0))
        }

        // Update `acceptedFiles` and `rejectedFiles` state
        // This will make children render functions receive the appropriate
        // values
        setAcceptedFiles(localAcceptedFiles);
        setRejectedFiles(localRejectedFiles);

        if (props.onDrop) {
          props.onDrop.call(localAcceptedFiles, localRejectedFiles, evt);
        }

        if (localRejectedFiles.length > 0 && onDropRejected) {
          onDropRejected.call(localRejectedFiles, evt);
        }

        if (localAcceptedFiles.length > 0 && onDropAccepted) {
          onDropAccepted.call(localAcceptedFiles, evt);
        }
      });
    }
  };

  const onClick = evt => {
    if (props.onClick) {
      props.onClick.call(evt);
    }

    // if disableClick is not set and the event hasn't been default prefented within
    // the onClick listener, open the file dialog
    if (!(props.disableClick && isDefaultPrevented(evt))) {
      evt.stopPropagation();

      // in IE11/Edge the file-browser dialog is blocking, ensure this is behind setTimeout
      // this is so react can handle state changes in the onClick prop above above
      // see: https://github.com/react-dropzone/react-dropzone/issues/450
      if (isIeOrEdge()) {
        setTimeout(openFileDialog, 0)
      } else {
        openFileDialog();
      }
    }
  };

  const onFocus = evt => {
    if (props.onFocus) {
      props.onFocus.call(evt);
    }
    if (!isDefaultPrevented(evt)) {
      setFocusStatus(true);
    }
  };

  const onBlur = evt => {
    if (props.onBlur) {
      props.onBlur.call(evt);
    }
    if (!isDefaultPrevented(evt)) {
      setFocusStatus(false);
    }
  };

  const onKeyDown = evt => {
    if (nodeRef.isEqualNode(evt.target)) {
      if (props.onKeyDown) {
        props.onKeyDown.call(evt)
      }

      if (!isDefaultPrevented(evt) && (evt.keyCode === 32 || evt.keyCode === 13)) {
        evt.preventDefault()
        openFileDialog();
      }
    }
  };

  useEffect(() => {
    if (props.preventDropOnDocument) {
      document.addEventListener('dragover', onDocumentDragOver, false);
      document.addEventListener('drop', onDocumentDrop, false);
    }

    window.addEventListener('focus', onFileDialogCancel, false);

    return () => {
      if (props.preventDropOnDocument) {
        document.removeEventListener('dragover', onDocumentDragOver);
        document.removeEventListener('drop', onDocumentDrop);
      }

      window.removeEventListener('focus', onFileDialogCancel, false);
    };
  });

  const getRootProps = ({
    refKey = 'ref',
    onDrop: onDropOverride,
    onBlur: onBlurOverride,
    onClick: onClickOverride,
    onFocus: onFocusOverride,
    onKeyDown: onKeyDownOverride,
    onDragOver: onDragOverOverride,
    onDragLeave: onDragLeaveOverride,
    onDragStart: onDragStartOverride,
    onDragEnter: onDragEnterOverride,
    ...rest
  } = {}) => ({
    [refKey]: nodeRef,
    tabIndex: disabled ? -1 : 0,
    onBlur: composeHandler(
      onBlur ? composeEventHandlers(onBlur, onBlur) : onBlur
    ),
    onDrop: composeHandler(
      onDropOverride ? composeEventHandlers(onDropOverride, onDrop) : onDrop
    ),
    onClick: composeHandler(
      onClickOverride ? composeEventHandlers(onClickOverride, onClick) : onClick
    ),
    onFocus: composeHandler(
      onFocusOverride ? composeEventHandlers(onFocusOverride, onFocus) : onFocus
    ),
    onKeyDown: composeHandler(
      onKeyDownOverride ? composeEventHandlers(onKeyDownOverride, onKeyDown) : onKeyDown
    ),
    onDragOver: composeHandler(
      onDragOverOverride ? composeEventHandlers(onDragOverOverride, onDragOver) : onDragOver
    ),
    onDragLeave: composeHandler(
      onDragLeaveOverride ? composeEventHandlers(onDragLeaveOverride, onDragLeave) : onDragLeave
    ),
    onDragStart: composeHandler(
      onDragStartOverride ? composeEventHandlers(onDragStartOverride, onDragStart) : onDragStart
    ),
    onDragEnter: composeHandler(
      onDragEnterOverride ? composeEventHandlers(onDragEnterOverride, onDragEnter) : onDragEnter
    ),
    ...rest
  });

  const getInputProps = ({
    refKey = 'ref',
    onClick: onClickOverride,
    onChange: onChangeOverride,
    ...rest,
  } = {}) => {
    const inputProps = {
      accept,
      type: 'file',
      tabIndex: -1,
      [refKey]: inputRef,
      autoComplete: 'off',
      style: { display: 'none' },
      multiple: supportMultiple && multiple,
      onChange: composeEventHandlers(onChangeOverride, onDrop),
      onClick: composeEventHandlers(onClickOverride, onInputElementClick),
    }

    if (props.name && props.name.length) {
      inputProps.name = props.name
    }
    return {
      ...inputProps,
      ...rest
    }
  };

  const isMultipleAllowed = multiple || (filesCount <= 1);
  const isDragAccept = (draggedFiles.length > 0) && allFilesAccepted(draggedFiles, accept);
  const isDragReject = (draggedFiles.length > 0) && (!isDragAccept || !isMultipleAllowed);

  return {
    isDragActive,
    isDragAccept,
    isDragReject,
    getRootProps,
    draggedFiles,
    getInputProps,
    acceptedFiles,
    rejectedFiles,
    openFileDialog,
    isFocused: isFocused && !props.disabled,
  };
};

export default useDropzone;
