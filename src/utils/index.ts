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

export function getTooLargeRejectionErr(maxSize: number): FileError {
  return {
    code: FILE_TOO_LARGE,
    message: `File is larger than ${maxSize} ${maxSize === 1 ? "byte" : "bytes"}`
  };
}

export function getTooSmallRejectionErr(minSize: number): FileError {
  return {
    code: FILE_TOO_SMALL,
    message: `File is smaller than ${minSize} ${minSize === 1 ? "byte" : "bytes"}`
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
  return Array.prototype.some.call(
    event.dataTransfer.types,
    (type: string) => type === "Files" || type === "application/x-moz-file"
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
 * Convert the `{accept}` dropzone prop to an array of MIME types/extensions.
 */
export function acceptPropAsAcceptAttr(accept?: Accept): string | undefined {
  if (isDefined(accept)) {
    return (
      Object.entries(accept)
        .reduce<string[]>((a, [mimeType, ext]) => {
          a.push(mimeType, ...ext);
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
 * Check if v is a file extension.
 */
export function isExt(v: string): boolean {
  return /^.*\.[\w]+$/.test(v);
}
