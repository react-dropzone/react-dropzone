import {fromEvent} from "file-selector";
import type {FileWithPath} from "file-selector";
import type * as React from "react";
import {forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useReducer, useRef} from "react";
import {
  acceptPropAsAcceptAttr,
  allFilesAccepted,
  canUseFileSystemAccessAPI,
  composeEventHandlers,
  ErrorCode,
  fileAccepted,
  fileMatchSize,
  isAbort,
  isEvtWithFiles,
  isIeOrEdge,
  isPropagationStopped,
  isSecurityError,
  onDocumentDragOver,
  pickerOptionsFromAccept,
  TOO_MANY_FILES_REJECTION
} from "./utils";
import type {Accept, FileError} from "./utils";

export type {Accept, FileError, FileWithPath};
export {ErrorCode};

export interface DropzoneProps extends DropzoneOptions {
  children?: (state: DropzoneState) => React.ReactElement;
}

export interface FileRejection {
  file: FileWithPath;
  errors: readonly FileError[];
}

type SharedProps = "multiple" | "onDragEnter" | "onDragOver" | "onDragLeave";

export type DropzoneOptions = Pick<React.HTMLProps<HTMLElement>, SharedProps> & {
  accept?: Accept;
  minSize?: number;
  maxSize?: number;
  maxFiles?: number;
  preventDropOnDocument?: boolean;
  noClick?: boolean;
  noKeyboard?: boolean;
  noDrag?: boolean;
  noDragEventsBubbling?: boolean;
  disabled?: boolean;
  onDrop?: <T extends File>(acceptedFiles: T[], fileRejections: FileRejection[], event: DropEvent) => void;
  onDropAccepted?: <T extends File>(files: T[], event: DropEvent) => void;
  onDropRejected?: (fileRejections: FileRejection[], event: DropEvent) => void;
  getFilesFromEvent?: (event: DropEvent) => Promise<Array<File | DataTransferItem>>;
  onFileDialogCancel?: () => void;
  onFileDialogOpen?: () => void;
  onError?: (err: Error) => void;
  validator?: <T extends File>(file: T) => FileError | readonly FileError[] | null;
  useFsAccessApi?: boolean;
  autoFocus?: boolean;
};

export type DropEvent =
  | React.DragEvent<HTMLElement>
  | React.ChangeEvent<HTMLInputElement>
  | DragEvent
  | Event
  | Array<FileSystemFileHandle>;

export interface DropzoneRef {
  open: () => void;
}

export type DropzoneState = DropzoneRef & {
  isFocused: boolean;
  isDragActive: boolean;
  isDragAccept: boolean;
  isDragReject: boolean;
  isDragGlobal: boolean;
  isFileDialogActive: boolean;
  acceptedFiles: readonly FileWithPath[];
  fileRejections: readonly FileRejection[];
  rootRef: React.RefObject<HTMLElement>;
  inputRef: React.RefObject<HTMLInputElement>;
  getRootProps: <T extends DropzoneRootProps>(props?: T) => T;
  getInputProps: <T extends DropzoneInputProps>(props?: T) => T;
};

export interface DropzoneRootProps extends React.HTMLAttributes<HTMLElement> {
  refKey?: string;
  [key: string]: any;
}

export interface DropzoneInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  refKey?: string;
}

/**
 * Convenience wrapper component for the `useDropzone` hook
 *
 * ```jsx
 * <Dropzone>
 *   {({getRootProps, getInputProps}) => (
 *     <div {...getRootProps()}>
 *       <input {...getInputProps()} />
 *       <p>Drag 'n' drop some files here, or click to select files</p>
 *     </div>
 *   )}
 * </Dropzone>
 * ```
 */
const Dropzone: React.ForwardRefExoticComponent<DropzoneProps & React.RefAttributes<DropzoneRef>> = forwardRef<
  DropzoneRef,
  DropzoneProps
>(({children, ...params}, ref) => {
  const {open, ...props} = useDropzone(params);

  useImperativeHandle(ref, () => ({open}), [open]);

  return <>{children?.({...props, open})}</>;
});

Dropzone.displayName = "Dropzone";

export default Dropzone;

interface DropzoneInternalState {
  isFocused: boolean;
  isFileDialogActive: boolean;
  isDragActive: boolean;
  isDragAccept: boolean;
  isDragReject: boolean;
  isDragGlobal: boolean;
  acceptedFiles: FileWithPath[];
  fileRejections: FileRejection[];
}

const initialState: DropzoneInternalState = {
  isFocused: false,
  isFileDialogActive: false,
  isDragActive: false,
  isDragAccept: false,
  isDragReject: false,
  isDragGlobal: false,
  acceptedFiles: [],
  fileRejections: []
};

/**
 * A React hook that creates a drag 'n' drop area.
 *
 * ```jsx
 * function MyDropzone(props) {
 *   const {getRootProps, getInputProps} = useDropzone({
 *     onDrop: acceptedFiles => {
 *       // do something with the File objects, e.g. upload to some server
 *     }
 *   });
 *   return (
 *     <div {...getRootProps()}>
 *       <input {...getInputProps()} />
 *       <p>Drag and drop some files here, or click to select files</p>
 *     </div>
 *   )
 * }
 * ```
 */
export function useDropzone(props: DropzoneOptions = {}): DropzoneState {
  const {
    accept,
    disabled = false,
    getFilesFromEvent = fromEvent,
    maxSize = Number.POSITIVE_INFINITY,
    minSize = 0,
    multiple = true,
    maxFiles = 0,
    onDragEnter,
    onDragLeave,
    onDragOver,
    onDrop,
    onDropAccepted,
    onDropRejected,
    onFileDialogCancel,
    onFileDialogOpen,
    useFsAccessApi = false,
    autoFocus = false,
    preventDropOnDocument = true,
    noClick = false,
    noKeyboard = false,
    noDrag = false,
    noDragEventsBubbling = false,
    onError,
    validator
  } = props;

  const acceptAttr = useMemo(() => acceptPropAsAcceptAttr(accept), [accept]);
  const pickerTypes = useMemo(() => pickerOptionsFromAccept(accept), [accept]);

  const onFileDialogOpenCb = useMemo<(...args: any[]) => void>(
    () => (typeof onFileDialogOpen === "function" ? onFileDialogOpen : noop),
    [onFileDialogOpen]
  );
  const onFileDialogCancelCb = useMemo<(...args: any[]) => void>(
    () => (typeof onFileDialogCancel === "function" ? onFileDialogCancel : noop),
    [onFileDialogCancel]
  );

  const rootRef = useRef<HTMLElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [state, dispatch] = useReducer(reducer, initialState);
  const {isFocused, isFileDialogActive} = state;

  const fsAccessApiWorksRef = useRef(
    typeof window !== "undefined" && window.isSecureContext && useFsAccessApi && canUseFileSystemAccessAPI()
  );

  // Update file dialog active state when the window is focused on
  const onWindowFocus = () => {
    // Execute the timeout only if the file dialog is opened in the browser
    if (!fsAccessApiWorksRef.current && isFileDialogActive) {
      setTimeout(() => {
        if (inputRef.current) {
          const {files} = inputRef.current;

          if (!files?.length) {
            dispatch({type: "closeDialog"});
            onFileDialogCancelCb();
          }
        }
      }, 300);
    }
  };
  useEffect(() => {
    window.addEventListener("focus", onWindowFocus, false);
    return () => {
      window.removeEventListener("focus", onWindowFocus, false);
    };
  }, [inputRef, isFileDialogActive, onFileDialogCancelCb, fsAccessApiWorksRef]);

  const dragTargetsRef = useRef<EventTarget[]>([]);
  const globalDragTargetsRef = useRef<EventTarget[]>([]);
  const onDocumentDrop = (event: DragEvent) => {
    if (rootRef.current && event.target && rootRef.current.contains(event.target as Node)) {
      // If we intercepted an event for our instance, let it propagate down to the instance's onDrop handler
      return;
    }
    event.preventDefault();
    dragTargetsRef.current = [];
  };

  useEffect(() => {
    if (preventDropOnDocument) {
      document.addEventListener("dragover", onDocumentDragOver, false);
      document.addEventListener("drop", onDocumentDrop, false);
    }

    return () => {
      if (preventDropOnDocument) {
        document.removeEventListener("dragover", onDocumentDragOver);
        document.removeEventListener("drop", onDocumentDrop);
      }
    };
  }, [rootRef, preventDropOnDocument]);

  // Track global drag state for document-level drag events
  useEffect(() => {
    const onDocumentDragEnter = (event: DragEvent) => {
      if (event.target) {
        globalDragTargetsRef.current = [...globalDragTargetsRef.current, event.target];
      }

      if (isEvtWithFiles(event)) {
        dispatch({isDragGlobal: true, type: "setDragGlobal"});
      }
    };

    const onDocumentDragLeave = (event: DragEvent) => {
      // Only deactivate once we've left all children
      globalDragTargetsRef.current = globalDragTargetsRef.current.filter(el => el !== event.target && el !== null);

      if (globalDragTargetsRef.current.length > 0) {
        return;
      }

      dispatch({isDragGlobal: false, type: "setDragGlobal"});
    };

    const onDocumentDragEnd = () => {
      globalDragTargetsRef.current = [];
      dispatch({isDragGlobal: false, type: "setDragGlobal"});
    };

    const onDocumentDropGlobal = () => {
      globalDragTargetsRef.current = [];
      dispatch({isDragGlobal: false, type: "setDragGlobal"});
    };

    document.addEventListener("dragenter", onDocumentDragEnter, false);
    document.addEventListener("dragleave", onDocumentDragLeave, false);
    document.addEventListener("dragend", onDocumentDragEnd, false);
    document.addEventListener("drop", onDocumentDropGlobal, false);

    return () => {
      document.removeEventListener("dragenter", onDocumentDragEnter);
      document.removeEventListener("dragleave", onDocumentDragLeave);
      document.removeEventListener("dragend", onDocumentDragEnd);
      document.removeEventListener("drop", onDocumentDropGlobal);
    };
  }, [rootRef]);

  // Auto focus the root when autoFocus is true
  useEffect(() => {
    if (!disabled && autoFocus && rootRef.current) {
      rootRef.current.focus();
    }
    return () => {};
  }, [rootRef, autoFocus, disabled]);

  const onErrCb = useCallback(
    (e: Error) => {
      if (onError) {
        onError(e);
      } else {
        // Let the user know something's gone wrong if they haven't provided the onError cb.
        console.error(e);
      }
    },
    [onError]
  );

  const onDragEnterCb = useCallback(
    (event: any) => {
      event.preventDefault();
      // Persist here because we need the event later after getFilesFromEvent() is done
      event.persist?.();
      stopPropagation(event);

      dragTargetsRef.current = [...dragTargetsRef.current, event.target];

      if (isEvtWithFiles(event)) {
        Promise.resolve(getFilesFromEvent(event))
          .then(files => {
            if (isPropagationStopped(event) && !noDragEventsBubbling) {
              return;
            }

            const fileCount = files.length;
            const isDragAccept =
              fileCount > 0 &&
              allFilesAccepted({
                files: files as File[],
                accept: acceptAttr,
                minSize,
                maxSize,
                multiple,
                maxFiles,
                validator
              });
            const isDragReject = fileCount > 0 && !isDragAccept;

            dispatch({
              isDragAccept,
              isDragReject,
              isDragActive: true,
              type: "setDraggedFiles"
            });

            if (onDragEnter) {
              onDragEnter(event);
            }
          })
          .catch(e => onErrCb(e));
      }
    },
    [
      getFilesFromEvent,
      onDragEnter,
      onErrCb,
      noDragEventsBubbling,
      acceptAttr,
      minSize,
      maxSize,
      multiple,
      maxFiles,
      validator
    ]
  );

  const onDragOverCb = useCallback(
    (event: any) => {
      event.preventDefault();
      event.persist?.();
      stopPropagation(event);

      const hasFiles = isEvtWithFiles(event);
      if (hasFiles && event.dataTransfer) {
        try {
          event.dataTransfer.dropEffect = "copy";
        } catch {
          /* no-op */
        }
      }

      if (hasFiles && onDragOver) {
        onDragOver(event);
      }

      return false;
    },
    [onDragOver, noDragEventsBubbling]
  );

  const onDragLeaveCb = useCallback(
    (event: any) => {
      event.preventDefault();
      event.persist?.();
      stopPropagation(event);

      // Only deactivate once the dropzone and all children have been left
      const targets = dragTargetsRef.current.filter(target => rootRef.current?.contains(target as Node));
      // Make sure to remove a target present multiple times only once
      // (Firefox may fire dragenter/dragleave multiple times on the same element)
      const targetIdx = targets.indexOf(event.target);
      if (targetIdx !== -1) {
        targets.splice(targetIdx, 1);
      }
      dragTargetsRef.current = targets;
      if (targets.length > 0) {
        return;
      }

      dispatch({
        type: "setDraggedFiles",
        isDragActive: false,
        isDragAccept: false,
        isDragReject: false
      });

      if (isEvtWithFiles(event) && onDragLeave) {
        onDragLeave(event);
      }
    },
    [rootRef, onDragLeave, noDragEventsBubbling]
  );

  const setFiles = useCallback(
    (files: FileWithPath[], event: any) => {
      const acceptedFiles: FileWithPath[] = [];
      const fileRejections: FileRejection[] = [];

      files.forEach(file => {
        const [accepted, acceptError] = fileAccepted(file, acceptAttr);
        const [sizeMatch, sizeError] = fileMatchSize(file, minSize, maxSize);
        const customErrors = validator ? validator(file) : null;

        if (accepted && sizeMatch && !customErrors) {
          acceptedFiles.push(file);
        } else {
          let errors: Array<FileError | null> = [acceptError, sizeError];

          if (customErrors) {
            errors = errors.concat(customErrors);
          }

          fileRejections.push({file, errors: errors.filter((e): e is FileError => e != null)});
        }
      });

      if ((!multiple && acceptedFiles.length > 1) || (multiple && maxFiles >= 1 && acceptedFiles.length > maxFiles)) {
        // Reject everything and empty accepted files
        acceptedFiles.forEach(file => {
          fileRejections.push({file, errors: [TOO_MANY_FILES_REJECTION]});
        });
        acceptedFiles.splice(0);
      }

      dispatch({
        acceptedFiles,
        fileRejections,
        type: "setFiles"
      });

      if (onDrop) {
        onDrop(acceptedFiles, fileRejections, event);
      }

      if (fileRejections.length > 0 && onDropRejected) {
        onDropRejected(fileRejections, event);
      }

      if (acceptedFiles.length > 0 && onDropAccepted) {
        onDropAccepted(acceptedFiles, event);
      }
    },
    [dispatch, multiple, acceptAttr, minSize, maxSize, maxFiles, onDrop, onDropAccepted, onDropRejected, validator]
  );

  const onDropCb = useCallback(
    (event: any) => {
      event.preventDefault();
      // Persist here because we need the event later after getFilesFromEvent() is done
      event.persist?.();
      stopPropagation(event);

      dragTargetsRef.current = [];

      if (isEvtWithFiles(event)) {
        Promise.resolve(getFilesFromEvent(event))
          .then(files => {
            if (isPropagationStopped(event) && !noDragEventsBubbling) {
              return;
            }
            setFiles(files as FileWithPath[], event);
          })
          .catch(e => onErrCb(e));
      }
      dispatch({type: "reset"});
    },
    [getFilesFromEvent, setFiles, onErrCb, noDragEventsBubbling]
  );

  // Fn for opening the file dialog programmatically
  const openFileDialog = useCallback(() => {
    // No point to use FS access APIs if context is not secure
    // https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts#feature_detection
    if (fsAccessApiWorksRef.current) {
      dispatch({type: "openDialog"});
      onFileDialogOpenCb();
      // https://developer.mozilla.org/en-US/docs/Web/API/window/showOpenFilePicker
      const opts = {
        multiple,
        types: pickerTypes
      };
      (window as any)
        .showOpenFilePicker(opts)
        .then((handles: any) => getFilesFromEvent(handles))
        .then((files: Array<File | DataTransferItem>) => {
          setFiles(files as FileWithPath[], null);
          dispatch({type: "closeDialog"});
        })
        .catch((e: any) => {
          // AbortError means the user canceled
          if (isAbort(e)) {
            onFileDialogCancelCb(e);
            dispatch({type: "closeDialog"});
          } else if (isSecurityError(e)) {
            fsAccessApiWorksRef.current = false;
            // CORS, so cannot use this API
            // Try using the input
            if (inputRef.current) {
              inputRef.current.value = "";
              inputRef.current.click();
            } else {
              onErrCb(
                new Error(
                  "Cannot open the file picker because the https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API is not supported and no <input> was provided."
                )
              );
            }
          } else {
            onErrCb(e);
          }
        });
      return;
    }

    if (inputRef.current) {
      dispatch({type: "openDialog"});
      onFileDialogOpenCb();
      inputRef.current.value = "";
      inputRef.current.click();
    }
  }, [dispatch, onFileDialogOpenCb, onFileDialogCancelCb, useFsAccessApi, setFiles, onErrCb, pickerTypes, multiple]);

  // Cb to open the file dialog when SPACE/ENTER occurs on the dropzone
  const onKeyDownCb = useCallback(
    (event: any) => {
      // Ignore keyboard events bubbling up the DOM tree
      if (!rootRef.current?.isEqualNode(event.target)) {
        return;
      }

      if (event.key === " " || event.key === "Enter" || event.keyCode === 32 || event.keyCode === 13) {
        event.preventDefault();
        openFileDialog();
      }
    },
    [rootRef, openFileDialog]
  );

  // Update focus state for the dropzone
  const onFocusCb = useCallback(() => {
    dispatch({type: "focus"});
  }, []);
  const onBlurCb = useCallback(() => {
    dispatch({type: "blur"});
  }, []);

  // Cb to open the file dialog when click occurs on the dropzone
  const onClickCb = useCallback(() => {
    if (noClick) {
      return;
    }

    // In IE11/Edge the file-browser dialog is blocking, therefore, use setTimeout()
    // to ensure React can handle state changes
    // See: https://github.com/react-dropzone/react-dropzone/issues/450
    if (isIeOrEdge()) {
      setTimeout(openFileDialog, 0);
    } else {
      openFileDialog();
    }
  }, [noClick, openFileDialog]);

  const composeHandler = (fn: any) => {
    return disabled ? null : fn;
  };

  const composeKeyboardHandler = (fn: any) => {
    return noKeyboard ? null : composeHandler(fn);
  };

  const composeDragHandler = (fn: any) => {
    return noDrag ? null : composeHandler(fn);
  };

  const stopPropagation = (event: any) => {
    if (noDragEventsBubbling) {
      event.stopPropagation();
    }
  };

  const getRootProps = useMemo(
    () =>
      ({
        refKey = "ref",
        role,
        onKeyDown,
        onFocus,
        onBlur,
        onClick,
        onDragEnter,
        onDragOver,
        onDragLeave,
        onDrop,
        ...rest
      }: DropzoneRootProps = {}) => ({
        onKeyDown: composeKeyboardHandler(composeEventHandlers(onKeyDown, onKeyDownCb)),
        onFocus: composeKeyboardHandler(composeEventHandlers(onFocus, onFocusCb)),
        onBlur: composeKeyboardHandler(composeEventHandlers(onBlur, onBlurCb)),
        onClick: composeHandler(composeEventHandlers(onClick, onClickCb)),
        onDragEnter: composeDragHandler(composeEventHandlers(onDragEnter, onDragEnterCb)),
        onDragOver: composeDragHandler(composeEventHandlers(onDragOver, onDragOverCb)),
        onDragLeave: composeDragHandler(composeEventHandlers(onDragLeave, onDragLeaveCb)),
        onDrop: composeDragHandler(composeEventHandlers(onDrop, onDropCb)),
        role: typeof role === "string" && role !== "" ? role : "presentation",
        [refKey]: rootRef,
        ...(!disabled && !noKeyboard ? {tabIndex: 0} : {}),
        ...rest
      }),
    [
      rootRef,
      onKeyDownCb,
      onFocusCb,
      onBlurCb,
      onClickCb,
      onDragEnterCb,
      onDragOverCb,
      onDragLeaveCb,
      onDropCb,
      noKeyboard,
      noDrag,
      disabled
    ]
  );

  const onInputElementClick = useCallback((event: any) => {
    event.stopPropagation();
  }, []);

  const getInputProps = useMemo(
    () =>
      ({refKey = "ref", onChange, onClick, ...rest}: DropzoneInputProps = {}) => {
        const inputProps = {
          accept: acceptAttr,
          multiple,
          type: "file",
          style: {
            border: 0,
            clip: "rect(0, 0, 0, 0)",
            clipPath: "inset(50%)",
            height: "1px",
            margin: "0 -1px -1px 0",
            overflow: "hidden",
            padding: 0,
            position: "absolute",
            width: "1px",
            whiteSpace: "nowrap"
          },
          onChange: composeHandler(composeEventHandlers(onChange, onDropCb)),
          onClick: composeHandler(composeEventHandlers(onClick, onInputElementClick)),
          tabIndex: -1,
          [refKey]: inputRef
        };

        return {
          ...inputProps,
          ...rest
        };
      },
    [inputRef, accept, multiple, onDropCb, disabled]
  );

  return {
    ...state,
    isFocused: isFocused && !disabled,
    getRootProps,
    getInputProps,
    rootRef,
    inputRef,
    open: composeHandler(openFileDialog)
  } as unknown as DropzoneState;
}

function reducer(state: DropzoneInternalState, action: any): DropzoneInternalState {
  switch (action.type) {
    case "focus":
      return {
        ...state,
        isFocused: true
      };
    case "blur":
      return {
        ...state,
        isFocused: false
      };
    case "openDialog":
      return {
        ...initialState,
        isFileDialogActive: true
      };
    case "closeDialog":
      return {
        ...state,
        isFileDialogActive: false
      };
    case "setDraggedFiles":
      return {
        ...state,
        isDragActive: action.isDragActive,
        isDragAccept: action.isDragAccept,
        isDragReject: action.isDragReject
      };
    case "setFiles":
      return {
        ...state,
        acceptedFiles: action.acceptedFiles,
        fileRejections: action.fileRejections,
        isDragReject: false
      };
    case "setDragGlobal":
      return {
        ...state,
        isDragGlobal: action.isDragGlobal
      };
    case "reset":
      return {
        ...initialState
      };
    default:
      return state;
  }
}

function noop() {}
