import attrAccept from "attr-accept";

// attr-accept ships as a CommonJS module (`module.exports = { __esModule: true, default: fn }`).
// Bundler interop surfaces its default export inconsistently — as the function under Node/Vitest,
// but as `{ default: fn }` in some browser bundles. Normalize to the function.
const accepts =
  typeof attrAccept === "function" ? attrAccept : (attrAccept as unknown as {default: typeof attrAccept}).default;

/**
 * A map of accepted MIME types to file extensions, as passed to the `accept` prop.
 */
export interface Accept {
  [key: string]: readonly string[];
}

/**
 * A file rejection error.
 */
export interface FileError {
  message: string;
  code: ErrorCode | string;
}

/**
 * What a custom `validator` returns: a single error, a list of errors, or `null` when the file
 * passes. A validator may return the result directly (synchronous) or wrapped in a `Promise`
 * (asynchronous, e.g. reading image dimensions or calling an external service).
 */
export type ValidatorResult = FileError | readonly FileError[] | null;

// Error codes
export const FILE_INVALID_TYPE = "file-invalid-type";
export const FILE_TOO_LARGE = "file-too-large";
export const FILE_TOO_SMALL = "file-too-small";
export const TOO_MANY_FILES = "too-many-files";

export enum ErrorCode {
  FileInvalidType = "file-invalid-type",
  FileTooLarge = "file-too-large",
  FileTooSmall = "file-too-small",
  TooManyFiles = "too-many-files"
}

export function getInvalidTypeRejectionErr(accept: string = ""): FileError {
  const acceptArr = accept.split(",");
  const msg = acceptArr.length > 1 ? `one of ${acceptArr.join(", ")}` : acceptArr[0];

  return {
    code: FILE_INVALID_TYPE,
    message: `File type must be ${msg}`
  };
}

const FILE_SIZE_UNITS = ["KB", "MB", "GB", "TB", "PB"];

/**
 * Format a byte count into a human-readable string, e.g. `1111` -> `1.08 KB`.
 * Values below 1 KB are kept in bytes to preserve the singular/plural wording.
 */
function formatBytes(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} ${bytes === 1 ? "byte" : "bytes"}`;
  }

  let size = bytes / 1024;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < FILE_SIZE_UNITS.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  // Round to 2 decimals, then drop trailing zeros (1.00 -> 1, 1.50 -> 1.5).
  return `${Number(size.toFixed(2))} ${FILE_SIZE_UNITS[unitIndex]}`;
}

export function getTooLargeRejectionErr(maxSize: number): FileError {
  return {
    code: FILE_TOO_LARGE,
    message: `File is larger than ${formatBytes(maxSize)}`
  };
}

export function getTooSmallRejectionErr(minSize: number): FileError {
  return {
    code: FILE_TOO_SMALL,
    message: `File is smaller than ${formatBytes(minSize)}`
  };
}

export const TOO_MANY_FILES_REJECTION: FileError = {
  code: TOO_MANY_FILES,
  message: "Too many files"
};

/**
 * Check if the given file is a DataTransferItem with an empty type.
 *
 * During drag events, browsers may return DataTransferItem objects instead of File objects.
 * Some browsers (e.g., Chrome) return an empty MIME type for certain file types (like .md files)
 * on DataTransferItem during drag events, even though the type is correctly set during drop.
 */
export function isDataTransferItemWithEmptyType(file: File | DataTransferItem): boolean {
  return file.type === "" && typeof (file as DataTransferItem).getAsFile === "function";
}

/**
 * Check if file is accepted.
 *
 * Firefox versions prior to 53 return a bogus MIME type for every file drag,
 * so dragovers with that MIME type will always be accepted.
 *
 * Chrome/other browsers may return an empty MIME type for files during drag events,
 * so we accept those as well (we'll validate properly on drop).
 */
export function fileAccepted(file: File, accept?: string): [boolean, FileError | null] {
  const isAcceptable =
    file.type === "application/x-moz-file" || accepts(file, accept ?? "") || isDataTransferItemWithEmptyType(file);
  return [isAcceptable, isAcceptable ? null : getInvalidTypeRejectionErr(accept)];
}

export function fileMatchSize(
  file: {size?: number | null},
  minSize?: number,
  maxSize?: number
): [boolean, FileError | null] {
  if (isDefined(file.size)) {
    if (isDefined(minSize) && isDefined(maxSize)) {
      if (file.size > maxSize) return [false, getTooLargeRejectionErr(maxSize)];
      if (file.size < minSize) return [false, getTooSmallRejectionErr(minSize)];
    } else if (isDefined(minSize) && file.size < minSize) {
      return [false, getTooSmallRejectionErr(minSize)];
    } else if (isDefined(maxSize) && file.size > maxSize) {
      return [false, getTooLargeRejectionErr(maxSize)];
    }
  }
  return [true, null];
}

function isDefined<T>(value: T): value is NonNullable<T> {
  return value !== undefined && value !== null;
}

/**
 * Check if a value is thenable (Promise-like), used to tell a synchronous validator result from an
 * asynchronous one.
 */
export function isThenable(value: unknown): value is PromiseLike<unknown> {
  return value != null && typeof (value as {then?: unknown}).then === "function";
}

export function allFilesAccepted({
  files,
  accept,
  minSize,
  maxSize,
  multiple,
  maxFiles = 0,
  validator
}: {
  files: File[];
  accept?: string;
  minSize?: number;
  maxSize?: number;
  multiple?: boolean;
  maxFiles?: number;
  validator?: (file: File) => FileError | readonly FileError[] | null;
}): boolean {
  if ((!multiple && files.length > 1) || (multiple && maxFiles >= 1 && files.length > maxFiles)) {
    return false;
  }

  return files.every(file => {
    const [accepted] = fileAccepted(file, accept);
    const [sizeMatch] = fileMatchSize(file, minSize, maxSize);
    const customErrors = validator ? validator(file) : null;
    return accepted && sizeMatch && !customErrors;
  });
}

/**
 * The outcome of the drag-time acceptance check.
 *
 * - `accept`  - every file passes the checks we can evaluate during a drag.
 * - `reject`  - at least one file confidently fails a check we can fully evaluate during a
 *               drag (the file count, or a non-empty MIME type that doesn't match `accept`).
 * - `unknown` - nothing confidently fails, but the outcome can't be confirmed until drop,
 *               because a custom `validator` is configured and can't be evaluated yet.
 */
export type DragVerdict = "accept" | "reject" | "unknown";

/**
 * Classify a set of dragged files for the `isDragAccept`/`isDragReject`/`isDragUnknown` states.
 *
 * During `dragenter`/`dragover` the browser only exposes `DataTransferItem`s, which carry a MIME
 * `type` but no file name, extension or size (see https://html.spec.whatwg.org/multipage/dnd.html#dndevents).
 * So the drag-time check is deliberately optimistic about anything it can't see:
 *
 * - The custom `validator` is **never** run here. It is typed `(file: File) => ...` and users
 *   routinely read `file.name`/`file.size`, which are `undefined` on a `DataTransferItem` - running
 *   it would throw and abort the whole drag handler (leaving `isDragActive` stuck at `false`).
 *   See https://github.com/react-dropzone/react-dropzone/issues/1408
 * - When a `validator` is configured we therefore can't promise the files are acceptable, so the
 *   verdict is `unknown` rather than a misleading `reject` (or a premature `accept`).
 *   See https://github.com/react-dropzone/react-dropzone/issues/1244
 *
 * The full check (including the `validator`) still runs on drop in {@link fileAccepted}/`setFiles`.
 */
export function getDragVerdict({
  files,
  accept,
  minSize,
  maxSize,
  multiple,
  maxFiles = 0,
  validator
}: {
  files: Array<File | DataTransferItem>;
  accept?: string;
  minSize?: number;
  maxSize?: number;
  multiple?: boolean;
  maxFiles?: number;
  // The validator is never invoked here (see the note above), so its async variant is accepted
  // purely so the same `validator` prop is assignable during a drag.
  validator?: (file: File) => ValidatorResult | Promise<ValidatorResult>;
}): DragVerdict {
  // The file count is knowable during a drag, so an over-the-limit selection is a confident reject.
  if ((!multiple && files.length > 1) || (multiple && maxFiles >= 1 && files.length > maxFiles)) {
    return "reject";
  }

  const confidentlyRejected = files.some(file => {
    const [accepted] = fileAccepted(file as File, accept);
    const [sizeMatch] = fileMatchSize(file as File, minSize, maxSize);
    return !accepted || !sizeMatch;
  });
  if (confidentlyRejected) {
    return "reject";
  }

  // Built-in checks pass. A custom validator can only ever add rejections on drop, never rescue
  // one - so with a validator present the drag outcome is unknown until we have real Files.
  return validator ? "unknown" : "accept";
}

// React's synthetic events has event.isPropagationStopped,
// but to remain compatibility with other libs (Preact) fall back
// to check event.cancelBubble
export function isPropagationStopped(event: any): boolean {
  if (typeof event.isPropagationStopped === "function") {
    return event.isPropagationStopped();
  } else if (typeof event.cancelBubble !== "undefined") {
    return event.cancelBubble;
  }
  return false;
}

export function isEvtWithFiles(event: any): boolean {
  if (!event.dataTransfer) {
    return !!event.target && !!event.target.files;
  }
  // https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/types
  // https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/Recommended_drag_types#file
  // Some Chromium drags omit "Files" from types (e.g. reporting only ["text/plain"])
  // while still exposing a kind: "file" entry in items - the same signal file-selector
  // uses to extract the files. Accept either so detection stays consistent. See #1409.
  return (
    Array.prototype.some.call(
      event.dataTransfer.types,
      (type: string) => type === "Files" || type === "application/x-moz-file"
    ) || Array.prototype.some.call(event.dataTransfer.items ?? [], isKindFile)
  );
}

export function isKindFile(item: any): boolean {
  return typeof item === "object" && item !== null && item.kind === "file";
}

// allow the entire document to be a drag target
export function onDocumentDragOver(event: Event): void {
  event.preventDefault();
}

function isIe(userAgent: string): boolean {
  return userAgent.indexOf("MSIE") !== -1 || userAgent.indexOf("Trident/") !== -1;
}

function isEdge(userAgent: string): boolean {
  return userAgent.indexOf("Edge/") !== -1;
}

export function isIeOrEdge(userAgent: string = window.navigator.userAgent): boolean {
  return isIe(userAgent) || isEdge(userAgent);
}

/**
 * This is intended to be used to compose event handlers.
 * They are executed in order until one of them calls `event.isPropagationStopped()`.
 * Note that the check is done on the first invoke too,
 * meaning that if propagation was stopped before invoking the fns,
 * no handlers will be executed.
 */
export function composeEventHandlers(
  ...fns: Array<((event: any, ...args: any[]) => void) | null | undefined>
): (event: any, ...args: any[]) => boolean {
  return (event: any, ...args: any[]) =>
    fns.some(fn => {
      if (!isPropagationStopped(event) && fn) {
        fn(event, ...args);
      }
      return isPropagationStopped(event);
    });
}

/**
 * canUseFileSystemAccessAPI checks if the File System Access API is supported by the browser.
 */
export function canUseFileSystemAccessAPI(): boolean {
  return "showOpenFilePicker" in window;
}

/**
 * Convert the `{accept}` dropzone prop to the `{types}` option for showOpenFilePicker.
 */
export function pickerOptionsFromAccept(accept?: Accept): Array<{description: string; accept: Accept}> | undefined {
  if (isDefined(accept)) {
    const acceptForPicker = Object.entries(accept)
      .filter(([mimeType, ext]) => {
        let ok = true;

        if (!isMIMEType(mimeType)) {
          console.warn(
            `Skipped "${mimeType}" because it is not a valid MIME type. Check https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types for a list of valid MIME types.`
          );
          ok = false;
        }

        if (!Array.isArray(ext) || !ext.every(isExt)) {
          console.warn(`Skipped "${mimeType}" because an invalid file extension was provided.`);
          ok = false;
        }

        return ok;
      })
      .reduce<Accept>((agg, [mimeType, ext]) => {
        agg[mimeType] = ext;
        return agg;
      }, {});
    return [
      {
        // description is required due to https://crbug.com/1264708
        description: "Files",
        accept: acceptForPicker
      }
    ];
  }
  return undefined;
}

/**
 * Convert the `{accept}` dropzone prop to a comma-separated accept attribute string.
 *
 * When `omitWildcardMimeTypesWithExtensions` is set, a wildcard MIME type (e.g. `image/*`)
 * that is paired with explicit extensions is dropped in favour of those extensions. The
 * accept attribute is an OR list, so leaving `image/*` in would make both the native file
 * picker and the drop-time validator accept ANY file of that type, ignoring the extension
 * restriction. The drag-time `isDragAccept` check keeps the wildcard because file names
 * (and therefore extensions) aren't readable during a drag.
 *
 * See https://github.com/react-dropzone/react-dropzone/issues/1220
 */
export function acceptPropAsAcceptAttr(
  accept?: Accept,
  {omitWildcardMimeTypesWithExtensions = false}: {omitWildcardMimeTypesWithExtensions?: boolean} = {}
): string | undefined {
  if (isDefined(accept)) {
    return (
      Object.entries(accept)
        .reduce<string[]>((a, [mimeType, ext]) => {
          if (omitWildcardMimeTypesWithExtensions && isMIMETypeWildcard(mimeType) && ext.some(isExt)) {
            a.push(...ext);
          } else {
            a.push(mimeType, ...ext);
          }
          return a;
        }, [])
        // Silently discard invalid entries as pickerOptionsFromAccept warns about these
        .filter(v => isMIMEType(v) || isExt(v))
        .join(",")
    );
  }

  return undefined;
}

/**
 * Check if v is an exception caused by aborting a request (e.g window.showOpenFilePicker()).
 */
export function isAbort(v: any): boolean {
  return v instanceof DOMException && (v.name === "AbortError" || v.code === v.ABORT_ERR);
}

/**
 * Check if v is a security error.
 */
export function isSecurityError(v: any): boolean {
  return v instanceof DOMException && (v.name === "SecurityError" || v.code === v.SECURITY_ERR);
}

/**
 * Check if v is a "not allowed" error.
 *
 * Some browsers/configurations block `window.showOpenFilePicker()` outright and reject with a
 * `NotAllowedError` instead of showing the picker (e.g. Microsoft Edge for Business, or other
 * restrictive enterprise/security policies). We treat this like a security error and fall back
 * to the native `<input>`. See https://github.com/react-dropzone/react-dropzone/issues/1429
 */
export function isNotAllowedError(v: any): boolean {
  return v instanceof DOMException && v.name === "NotAllowedError";
}

/**
 * Check if v is a MIME type string.
 */
export function isMIMEType(v: string): boolean {
  return (
    v === "audio/*" ||
    v === "video/*" ||
    v === "image/*" ||
    v === "text/*" ||
    v === "application/*" ||
    /\w+\/[-+.\w]+/g.test(v)
  );
}

/**
 * Check if v is a wildcard MIME type (e.g. `image/*`).
 */
export function isMIMETypeWildcard(v: string): boolean {
  return v.endsWith("/*");
}

/**
 * Check if v is a file extension.
 */
export function isExt(v: string): boolean {
  return /^.*\.[\w]+$/.test(v);
}
