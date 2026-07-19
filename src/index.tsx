import {fromEvent} from "file-selector";
import type {FileWithPath} from "file-selector";
import type * as React from "react";
import {forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useReducer, useRef} from "react";
import {
  acceptPropAsAcceptAttr,
  canUseFileSystemAccessAPI,
  composeEventHandlers,
  ErrorCode,
  fileAccepted,
  fileMatchSize,
  getDragVerdict,
  isAbort,
  isEvtWithFiles,
  isIeOrEdge,
  isNotAllowedError,
  isThenable,
  isPropagationStopped,
  isSecurityError,
  onDocumentDragOver,
  pickerOptionsFromAccept,
  TOO_MANY_FILES_REJECTION
} from "./utils";
import type {Accept, FileError, ValidatorResult} from "./utils";

export type {Accept, FileError, FileWithPath, ValidatorResult};
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
  getFilesFromEvent?: (event: DropEvent | Array<FileSystemFileHandle>) => Promise<Array<File | DataTransferItem>>;
  onFileDialogCancel?: () => void;
  onFileDialogOpen?: () => void;
  onError?: (err: Error) => void;
  /**
   * Custom validation, run once per file on drop/selection. Return `null` to accept the file, or a
   * {@link FileError} (or array of them) to reject it. May be `async` (return a `Promise`) to support
   * checks that can't run synchronously - e.g. reading image dimensions, inspecting file contents,
   * or calling an external service. While an async validator is pending, {@link DropzoneState.isProcessing}
   * is `true`, and `onDrop`/`onDropAccepted`/`onDropRejected` fire only once it settles. If the
   * validator throws or rejects, `onError` is called and the drop is discarded.
   *
   * Note: the validator never runs during a drag (a `DataTransferItem` has no name/size), so a
   * validator-configured dropzone is `isDragUnknown` until drop.
   */
  validator?: <T extends File>(file: T) => ValidatorResult | Promise<ValidatorResult>;
  /**
   * Override the message of any rejection error (built-in or custom). Called once per error;
   * receives the error and the file it belongs to and returns the message to use. Return
   * `error.message` for codes you don't want to change. Useful for localizing error messages.
   */
  getErrorMessage?: (error: FileError, file: File) => string;
  useFsAccessApi?: boolean;
  autoFocus?: boolean;
};

export type DropEvent = React.DragEvent<HTMLElement> | React.ChangeEvent<HTMLInputElement> | DragEvent | Event;

export interface DropzoneRef {
  open: () => void;
}

export type DropzoneState = DropzoneRef & {
  isFocused: boolean;
  isDragActive: boolean;
  isDragAccept: boolean;
  isDragReject: boolean;
  isDragUnknown: boolean;
  isDragGlobal: boolean;
  isFileDialogActive: boolean;
  /**
   * `true` while a drop/selection is being processed asynchronously - i.e. while `getFilesFromEvent`
   * reads the files and/or an async {@link DropzoneOptions.validator} runs. Spans the whole pipeline,
   * from when files start being read until validation settles. When both are synchronous (the default
   * `getFilesFromEvent` with no/async-free validator) the work resolves within a microtask, so it's
   * only observable for genuinely async work. Use it to show a spinner or disable UI while processing.
   */
  isProcessing: boolean;
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
  isDragUnknown: boolean;
  isDragGlobal: boolean;
  isProcessing: boolean;
  acceptedFiles: FileWithPath[];
  fileRejections: FileRejection[];
}

/**
 * The per-file outcome of the built-in checks plus the (resolved) custom validator, assembled in
 * setFiles before the accepted/rejected split.
 */
interface PerFileResult {
  file: FileWithPath;
  accepted: boolean;
  acceptError: FileError | null;
  sizeMatch: boolean;
  sizeError: FileError | null;
  customErrors: ValidatorResult;
}

const initialState: DropzoneInternalState = {
  isFocused: false,
  isFileDialogActive: false,
  isDragActive: false,
  isDragAccept: false,
  isDragReject: false,
  isDragUnknown: false,
  isDragGlobal: false,
  isProcessing: false,
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
    validator,
    getErrorMessage
  } = props;

  // `acceptAttr` keeps wildcard MIME types (e.g. `image/*`) so the drag-time
  // `isDragAccept`/`isDragReject` check can react to a file's MIME type - file names
  // (hence extensions) aren't readable during a drag.
  const acceptAttr = useMemo(() => acceptPropAsAcceptAttr(accept), [accept]);
  // `inputAcceptAttr` drops a wildcard MIME type when it is paired with extensions, so the
  // native picker and drop-time validation enforce the extensions instead of accepting any
  // file of that type. See https://github.com/react-dropzone/react-dropzone/issues/1220
  const inputAcceptAttr = useMemo(
    () =>
      acceptPropAsAcceptAttr(accept, {
        omitWildcardMimeTypesWithExtensions: true
      }),
    [accept]
  );
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

  // Mirror {isFileDialogActive} into a ref so the memoized drag handlers can read the current value
  // without being recreated (and churning getRootProps/getInputProps) every time the dialog toggles.
  const isFileDialogActiveRef = useRef(isFileDialogActive);
  isFileDialogActiveRef.current = isFileDialogActive;

  // Tracks the in-flight processing run - reading files (getFilesFromEvent) plus running an async
  // validator. A newer drop/selection aborts the previous run so slow async work can't resolve late
  // and clobber the state with stale results.
  const processingAbortRef = useRef<AbortController | null>(null);

  // Begin a processing run: supersede any run still in flight and flip {isProcessing} on. Returns
  // the run's AbortSignal, which downstream async steps check to bail if a newer run took over.
  const beginProcessing = useCallback(() => {
    processingAbortRef.current?.abort();
    const controller = new AbortController();
    processingAbortRef.current = controller;
    dispatch({type: "setProcessing", isProcessing: true});
    return controller.signal;
  }, []);

  // End a processing run by clearing {isProcessing} - but only if this run is still the active one.
  // A superseded run (signal aborted) leaves the flag to the run that replaced it.
  const endProcessing = useCallback((signal: AbortSignal) => {
    if (!signal.aborted) {
      dispatch({type: "setProcessing", isProcessing: false});
    }
  }, []);

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
    // This is a document-level, bubble-phase listener, so it runs *after* the event has already
    // bubbled through the dropzone root. If the drop landed inside the root and the instance's own
    // onDrop handler already prevented the default, there's nothing left to do.
    //
    // We must NOT bail out on `contains()` alone: when the dropzone is `disabled` or has `noDrag`,
    // the root has no onDrop handler, so nothing prevents the browser's default action and the file
    // is opened in the tab. Falling through to `preventDefault()` here keeps that from happening.
    // See https://github.com/react-dropzone/react-dropzone/issues/1362
    if (rootRef.current && event.target && rootRef.current.contains(event.target as Node) && event.defaultPrevented) {
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

      // Ignore drags onto the dropzone while the file picker dialog is open: the page underneath a
      // live picker shouldn't react to (or accept) dropped files. See #1455. preventDefault() above
      // still runs so the browser doesn't try to open/navigate to a dropped file.
      if (isFileDialogActiveRef.current) {
        return;
      }

      dragTargetsRef.current = [...dragTargetsRef.current, event.target];

      if (isEvtWithFiles(event)) {
        Promise.resolve(getFilesFromEvent(event))
          .then(files => {
            if (isPropagationStopped(event) && !noDragEventsBubbling) {
              return;
            }

            const fileCount = files.length;
            // During a drag we only have DataTransferItems (MIME type, no name/size), so the
            // custom validator can't run yet - a validator-configured dropzone is "unknown" until
            // drop rather than a misleading accept/reject. See getDragVerdict for the details.
            const verdict =
              fileCount > 0
                ? getDragVerdict({
                    files: files as Array<File | DataTransferItem>,
                    accept: acceptAttr,
                    minSize,
                    maxSize,
                    multiple,
                    maxFiles,
                    validator
                  })
                : null;

            dispatch({
              isDragAccept: verdict === "accept",
              isDragReject: verdict === "reject",
              isDragUnknown: verdict === "unknown",
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

      // Ignore drags over the dropzone while the file picker dialog is open. See #1455.
      if (isFileDialogActiveRef.current) {
        return false;
      }

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
        isDragReject: false,
        isDragUnknown: false
      });

      if (isEvtWithFiles(event) && onDragLeave) {
        onDragLeave(event);
      }
    },
    [rootRef, onDragLeave, noDragEventsBubbling]
  );

  const setFiles = useCallback(
    async (files: FileWithPath[], event: any, signal: AbortSignal) => {
      const localizeError = (error: FileError, file: File): FileError =>
        getErrorMessage ? {...error, message: getErrorMessage(error, file)} : error;

      // Commit the per-file verdicts: split accepted/rejected, cap the surplus, update state and
      // fire the onDrop callbacks. Runs synchronously so nested-dropzone ordering is preserved on
      // the fast path (an onDrop handler calling stopPropagation must do so before a parent's onDrop
      // check - see the noDragEventsBubbling tests).
      const commit = (results: Array<PerFileResult>) => {
        const acceptedFiles: FileWithPath[] = [];
        const fileRejections: FileRejection[] = [];

        results.forEach(({file, accepted, acceptError, sizeMatch, sizeError, customErrors}) => {
          if (accepted && sizeMatch && !customErrors) {
            acceptedFiles.push(file);
          } else {
            let errors: Array<FileError | null> = [acceptError, sizeError];

            if (customErrors) {
              errors = errors.concat(customErrors);
            }

            fileRejections.push({
              file,
              errors: errors.filter((e): e is FileError => e != null).map(error => localizeError(error, file))
            });
          }
        });

        // Cap the accepted files at the configured limit and reject only the surplus (the files past
        // the limit) with a too-many-files error, instead of rejecting the whole batch. The limit is 1
        // when {multiple} is false, and {maxFiles} when {multiple} is true (0 means no limit). Files
        // that already failed the per-file checks above are in {fileRejections} and don't count here.
        // See https://github.com/react-dropzone/react-dropzone/issues/1355
        // and https://github.com/react-dropzone/react-dropzone/issues/1358
        const acceptedFilesLimit = multiple ? (maxFiles >= 1 ? maxFiles : Number.POSITIVE_INFINITY) : 1;
        if (acceptedFiles.length > acceptedFilesLimit) {
          const surplusFiles = acceptedFiles.splice(acceptedFilesLimit);
          surplusFiles.forEach(file => {
            fileRejections.push({file, errors: [localizeError(TOO_MANY_FILES_REJECTION, file)]});
          });
        }

        // Clears isProcessing back to false (see the reducer) in the same update that sets the files.
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
      };

      // Run the built-in checks synchronously and invoke the validator (which may return a value or
      // a Promise). customErrors is left as-is here so we can tell sync from async below.
      const pending = files.map(file => {
        const [accepted, acceptError] = fileAccepted(file, inputAcceptAttr);
        const [sizeMatch, sizeError] = fileMatchSize(file, minSize, maxSize);
        const customErrors = validator ? validator(file) : null;
        return {file, accepted, acceptError, sizeMatch, sizeError, customErrors};
      });

      // Callers check signal.aborted right before invoking setFiles (synchronously, no await in
      // between), so this run is guaranteed live here - the supersession guards below only matter
      // after we await the validator.

      // Fast path: no validator, or a synchronous one. Commit synchronously - no extra microtask
      // hop, so nested-dropzone ordering is preserved (an onDrop handler calling stopPropagation
      // must run before a parent's onDrop check - see the noDragEventsBubbling tests). commit's
      // dispatch also clears isProcessing.
      if (!pending.some(({customErrors}) => isThenable(customErrors))) {
        commit(pending as Array<PerFileResult>);
        return;
      }

      // Async path: at least one validator returned a Promise. isProcessing is already on (set when
      // the run began, before getFilesFromEvent); keep guarding against supersession while we await.
      let results: Array<PerFileResult>;
      try {
        results = await Promise.all(
          pending.map(async ({customErrors, ...rest}) => ({...rest, customErrors: await customErrors}))
        );
      } catch (e) {
        // A validator threw/rejected. If a newer run already superseded this one, let it own the
        // state; otherwise clear the processing flag and report the error via onError.
        if (!signal.aborted) {
          endProcessing(signal);
          onErrCb(e as Error);
        }
        return;
      }

      // A newer drop landed while we were validating - discard these stale results.
      if (signal.aborted) {
        return;
      }

      commit(results);
    },
    [
      dispatch,
      multiple,
      inputAcceptAttr,
      minSize,
      maxSize,
      maxFiles,
      onDrop,
      onDropAccepted,
      onDropRejected,
      validator,
      getErrorMessage,
      onErrCb,
      endProcessing
    ]
  );

  const onDropCb = useCallback(
    (event: any) => {
      event.preventDefault();
      // Persist here because we need the event later after getFilesFromEvent() is done
      event.persist?.();
      stopPropagation(event);

      dragTargetsRef.current = [];

      // Ignore a drop landing on the dropzone while the file picker dialog is open (see #1455).
      // Guard on {event.dataTransfer} so only real drag-drops are suppressed: the input's change
      // event (a file picked from the dialog) also runs through here while the dialog is still
      // flagged active, and that path must keep working. Returning before the reset below leaves
      // the dialog flag intact.
      if (isFileDialogActiveRef.current && event.dataTransfer) {
        return;
      }

      // Clear drag state before we begin processing so beginProcessing's isProcessing isn't reset.
      dispatch({type: "reset"});

      if (isEvtWithFiles(event)) {
        // Processing spans reading the files (getFilesFromEvent) and running the validator.
        const signal = beginProcessing();
        Promise.resolve(getFilesFromEvent(event))
          .then(files => {
            // A newer drop superseded this one while reading files - it owns isProcessing now.
            if (signal.aborted) {
              return;
            }
            if (isPropagationStopped(event) && !noDragEventsBubbling) {
              endProcessing(signal);
              return;
            }
            // setFiles handles validator errors internally (routing them to onError); the outer
            // catch here only fires for a getFilesFromEvent failure.
            return setFiles(files as FileWithPath[], event, signal);
          })
          .catch(e => {
            if (!signal.aborted) {
              endProcessing(signal);
              onErrCb(e);
            }
          });
      }
    },
    [getFilesFromEvent, setFiles, onErrCb, noDragEventsBubbling, beginProcessing, endProcessing]
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
      // Set once the user has picked file(s); processing then spans reading them (getFilesFromEvent)
      // and running the validator. Picker rejections (cancel, security) happen before this, so it
      // stays undefined there and no processing state is touched.
      let signal: AbortSignal | undefined;
      (window as any)
        .showOpenFilePicker(opts)
        .then((handles: any) => {
          signal = beginProcessing();
          return getFilesFromEvent(handles);
        })
        .then((files: Array<File | DataTransferItem>) => {
          // Close the dialog as soon as we have the selection; validation runs afterwards and is
          // reflected by isProcessing rather than by keeping the dialog "active".
          dispatch({type: "closeDialog"});
          // A drop elsewhere superseded this selection while reading files - it owns isProcessing.
          if (signal!.aborted) {
            return;
          }
          return setFiles(files as FileWithPath[], null, signal!);
        })
        .catch((e: any) => {
          // Clear any processing this run started (e.g. a getFilesFromEvent failure).
          if (signal) {
            endProcessing(signal);
          }
          // AbortError means the user canceled
          if (isAbort(e)) {
            onFileDialogCancelCb(e);
            dispatch({type: "closeDialog"});
          } else if (isSecurityError(e) || isNotAllowedError(e)) {
            // The FS access API is unusable here: either the context forbids it (SecurityError,
            // e.g. CORS) or the browser/platform blocked the picker (NotAllowedError, e.g. Edge
            // for Business - see https://github.com/react-dropzone/react-dropzone/issues/1429).
            // Stop using it and fall back to the native <input>.
            fsAccessApiWorksRef.current = false;
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
  }, [
    dispatch,
    onFileDialogOpenCb,
    onFileDialogCancelCb,
    useFsAccessApi,
    setFiles,
    onErrCb,
    pickerTypes,
    multiple,
    beginProcessing,
    endProcessing
  ]);

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
        ...(disabled ? {"aria-disabled": true} : {}),
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
          accept: inputAcceptAttr,
          multiple,
          type: "file",
          "aria-label": "file upload",
          // Hide the input without taking it out of flow. A visually-hidden input with
          // {position: absolute} makes the browser scroll the page to it whenever it gets
          // focus (e.g. inside a collapsed accordion), see #1413. Keeping it in flow as a
          // zero-size, transparent block avoids that while staying focusable so a {required}
          // input still triggers form validation, see #1268. Don't use {display: none} or
          // {visibility: hidden}: those make the input unfocusable and reintroduce #1268.
          style: {
            border: 0,
            display: "block",
            height: 0,
            margin: 0,
            opacity: 0,
            overflow: "hidden",
            padding: 0,
            width: 0
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
        isDragReject: action.isDragReject,
        isDragUnknown: action.isDragUnknown
      };
    case "setProcessing":
      return {
        ...state,
        isProcessing: action.isProcessing
      };
    case "setFiles":
      return {
        ...state,
        acceptedFiles: action.acceptedFiles,
        fileRejections: action.fileRejections,
        isProcessing: false,
        isDragReject: false,
        isDragUnknown: false
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
