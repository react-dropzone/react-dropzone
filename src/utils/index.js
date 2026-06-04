import _accepts from "attr-accept";

const accepts = typeof _accepts === "function" ? _accepts : _accepts.default;
const MIME_TYPE_WILDCARDS = [
  "audio/*",
  "video/*",
  "image/*",
  "text/*",
  "application/*",
];

// Error codes
export const FILE_INVALID_TYPE = "file-invalid-type";
export const FILE_TOO_LARGE = "file-too-large";
export const FILE_TOO_SMALL = "file-too-small";
export const TOO_MANY_FILES = "too-many-files";

export const ErrorCode = {
  FileInvalidType: FILE_INVALID_TYPE,
  FileTooLarge: FILE_TOO_LARGE,
  FileTooSmall: FILE_TOO_SMALL,
  TooManyFiles: TOO_MANY_FILES,
};

/**
 *
 * @param {string} accept
 */
export const getInvalidTypeRejectionErr = (accept = "") => {
  const acceptArr = accept.split(",");
  const msg =
    acceptArr.length > 1 ? `one of ${acceptArr.join(", ")}` : acceptArr[0];

  return {
    code: FILE_INVALID_TYPE,
    message: `File type must be ${msg}`,
  };
};

export const getTooLargeRejectionErr = (maxSize) => {
  return {
    code: FILE_TOO_LARGE,
    message: `File is larger than ${maxSize} ${
      maxSize === 1 ? "byte" : "bytes"
    }`,
  };
};

export const getTooSmallRejectionErr = (minSize) => {
  return {
    code: FILE_TOO_SMALL,
    message: `File is smaller than ${minSize} ${
      minSize === 1 ? "byte" : "bytes"
    }`,
  };
};

export const TOO_MANY_FILES_REJECTION = {
  code: TOO_MANY_FILES,
  message: "Too many files",
};

/**
 * Check if the given file is a DataTransferItem with an empty type.
 *
 * During drag events, browsers may return DataTransferItem objects instead of File objects.
 * Some browsers (e.g., Chrome) return an empty MIME type for certain file types (like .md files)
 * on DataTransferItem during drag events, even though the type is correctly set during drop.
 *
 * This function detects such cases by checking for:
 * 1. Empty type string
 * 2. Presence of getAsFile method (indicates it's a DataTransferItem, not a File)
 *
 * We accept these during drag to provide proper UI feedback, while maintaining
 * strict validation during drop when real File objects are available.
 *
 * @param {File | DataTransferItem} file
 * @returns {boolean}
 */
export function isDataTransferItemWithEmptyType(file) {
  return file.type === "" && typeof file.getAsFile === "function";
}

/**
 * Check if file is accepted.
 *
 * Firefox versions prior to 53 return a bogus MIME type for every file drag,
 * so dragovers with that MIME type will always be accepted.
 *
 * Chrome/other browsers may return an empty MIME type for files during drag events,
 * so we accept those as well (we'll validate properly on drop).
 *
 * @param {File} file
 * @param {string} accept
 * @param {AcceptProp} [acceptProp]
 * @returns
 */
export function fileAccepted(file, accept, acceptProp) {
  const isAcceptable =
    file.type === "application/x-moz-file" ||
    (acceptProp
      ? acceptsWithAcceptProp(file, accept, acceptProp)
      : accepts(file, accept)) ||
    isDataTransferItemWithEmptyType(file);
  return [
    isAcceptable,
    isAcceptable ? null : getInvalidTypeRejectionErr(accept),
  ];
}

function acceptsWithAcceptProp(file, accept, acceptProp) {
  const validAcceptEntries = Object.entries(acceptProp).filter(
    ([mimeType, ext]) =>
      isMIMEType(mimeType) && Array.isArray(ext) && ext.every(isExt)
  );

  if (validAcceptEntries.length === 0) {
    return accepts(file, accept);
  }

  return validAcceptEntries.some(([mimeType, ext]) => {
    if (isMIMETypeWildcard(mimeType) && ext.length > 0) {
      return (
        fileMatchesMimeType(file, mimeType) && fileMatchesExtension(file, ext)
      );
    }

    return accepts(file, [mimeType, ...ext].join(","));
  });
}

function fileMatchesMimeType(file, mimeType) {
  const fileType = (file.type || "").toLowerCase();
  const normalizedMimeType = mimeType.toLowerCase();

  if (!fileType) {
    return true;
  }

  if (isMIMETypeWildcard(normalizedMimeType)) {
    return fileType.startsWith(normalizedMimeType.replace("*", ""));
  }

  return fileType === normalizedMimeType;
}

function fileMatchesExtension(file, extensions) {
  const fileName = (file.name || "").toLowerCase();

  return extensions.some((ext) => fileName.endsWith(ext.toLowerCase()));
}

export function fileMatchSize(file, minSize, maxSize) {
  if (isDefined(file.size)) {
    if (isDefined(minSize) && isDefined(maxSize)) {
      if (file.size > maxSize) return [false, getTooLargeRejectionErr(maxSize)];
      if (file.size < minSize) return [false, getTooSmallRejectionErr(minSize)];
    } else if (isDefined(minSize) && file.size < minSize)
      return [false, getTooSmallRejectionErr(minSize)];
    else if (isDefined(maxSize) && file.size > maxSize)
      return [false, getTooLargeRejectionErr(maxSize)];
  }
  return [true, null];
}

function isDefined(value) {
  return value !== undefined && value !== null;
}

/**
 *
 * @param {object} options
 * @param {File[]} options.files
 * @param {string} [options.accept]
 * @param {number} [options.minSize]
 * @param {number} [options.maxSize]
 * @param {boolean} [options.multiple]
 * @param {number} [options.maxFiles]
 * @param {(f: File) => FileError|FileError[]|null} [options.validator]
 * @returns
 */
export function allFilesAccepted({
  files,
  accept,
  minSize,
  maxSize,
  multiple,
  maxFiles,
  validator,
}) {
  if (
    (!multiple && files.length > 1) ||
    (multiple && maxFiles >= 1 && files.length > maxFiles)
  ) {
    return false;
  }

  return files.every((file) => {
    const [accepted] = fileAccepted(file, accept);
    const [sizeMatch] = fileMatchSize(file, minSize, maxSize);
    const customErrors = validator ? validator(file) : null;
    return accepted && sizeMatch && !customErrors;
  });
}

// React's synthetic events has event.isPropagationStopped,
// but to remain compatibility with other libs (Preact) fall back
// to check event.cancelBubble
export function isPropagationStopped(event) {
  if (typeof event.isPropagationStopped === "function") {
    return event.isPropagationStopped();
  } else if (typeof event.cancelBubble !== "undefined") {
    return event.cancelBubble;
  }
  return false;
}

export function isEvtWithFiles(event) {
  if (!event.dataTransfer) {
    return !!event.target && !!event.target.files;
  }
  // https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/types
  // https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/Recommended_drag_types#file
  return Array.prototype.some.call(
    event.dataTransfer.types,
    (type) => type === "Files" || type === "application/x-moz-file"
  );
}

export function isKindFile(item) {
  return typeof item === "object" && item !== null && item.kind === "file";
}

// allow the entire document to be a drag target
export function onDocumentDragOver(event) {
  event.preventDefault();
}

function isIe(userAgent) {
  return (
    userAgent.indexOf("MSIE") !== -1 || userAgent.indexOf("Trident/") !== -1
  );
}

function isEdge(userAgent) {
  return userAgent.indexOf("Edge/") !== -1;
}

export function isIeOrEdge(userAgent = window.navigator.userAgent) {
  return isIe(userAgent) || isEdge(userAgent);
}

/**
 * This is intended to be used to compose event handlers
 * They are executed in order until one of them calls `event.isPropagationStopped()`.
 * Note that the check is done on the first invoke too,
 * meaning that if propagation was stopped before invoking the fns,
 * no handlers will be executed.
 *
 * @param {Function} fns the event hanlder functions
 * @return {Function} the event handler to add to an element
 */
export function composeEventHandlers(...fns) {
  return (event, ...args) =>
    fns.some((fn) => {
      if (!isPropagationStopped(event) && fn) {
        fn(event, ...args);
      }
      return isPropagationStopped(event);
    });
}

/**
 * canUseFileSystemAccessAPI checks if the [File System Access API](https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API)
 * is supported by the browser.
 * @returns {boolean}
 */
export function canUseFileSystemAccessAPI() {
  return "showOpenFilePicker" in window;
}

/**
 * Convert the `{accept}` dropzone prop to the
 * `{types}` option for https://developer.mozilla.org/en-US/docs/Web/API/window/showOpenFilePicker
 *
 * @param {AcceptProp} accept
 * @returns {{accept: string[]}[]}
 */
export function pickerOptionsFromAccept(accept) {
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
          console.warn(
            `Skipped "${mimeType}" because an invalid file extension was provided.`
          );
          ok = false;
        }

        return ok;
      })
      .reduce(
        (agg, [mimeType, ext]) => ({
          ...agg,
          [mimeType]: ext,
        }),
        {}
      );
    return [
      {
        // description is required due to https://crbug.com/1264708
        description: "Files",
        accept: acceptForPicker,
      },
    ];
  }
  return accept;
}

/**
 * Convert the `{accept}` dropzone prop to an array of MIME types/extensions.
 * @param {AcceptProp} accept
 * @param {{omitWildcardMimeTypesWithExtensions?: boolean}} [options]
 * @returns {string}
 */
export function acceptPropAsAcceptAttr(accept, options = {}) {
  const { omitWildcardMimeTypesWithExtensions = false } = options;

  if (isDefined(accept)) {
    return (
      Object.entries(accept)
        .reduce(
          (a, [mimeType, ext]) => [
            ...a,
            ...(!omitWildcardMimeTypesWithExtensions ||
            !isMIMETypeWildcard(mimeType) ||
            ext.length === 0
              ? [mimeType]
              : []),
            ...ext,
          ],
          []
        )
        // Silently discard invalid entries as pickerOptionsFromAccept warns about these
        .filter((v) => isMIMEType(v) || isExt(v))
        .join(",")
    );
  }

  return undefined;
}

/**
 * Check if v is an exception caused by aborting a request (e.g window.showOpenFilePicker()).
 *
 * See https://developer.mozilla.org/en-US/docs/Web/API/DOMException.
 * @param {any} v
 * @returns {boolean} True if v is an abort exception.
 */
export function isAbort(v) {
  return (
    v instanceof DOMException &&
    (v.name === "AbortError" || v.code === v.ABORT_ERR)
  );
}

/**
 * Check if v is a security error.
 *
 * See https://developer.mozilla.org/en-US/docs/Web/API/DOMException.
 * @param {any} v
 * @returns {boolean} True if v is a security error.
 */
export function isSecurityError(v) {
  return (
    v instanceof DOMException &&
    (v.name === "SecurityError" || v.code === v.SECURITY_ERR)
  );
}

/**
 * Check if v is a MIME type string.
 *
 * See accepted format: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#unique_file_type_specifiers.
 *
 * @param {string} v
 */
export function isMIMEType(v) {
  return isMIMETypeWildcard(v) || /\w+\/[-+.\w]+/g.test(v);
}

function isMIMETypeWildcard(v) {
  return MIME_TYPE_WILDCARDS.includes(v);
}

/**
 * Check if v is a file extension.
 * @param {string} v
 */
export function isExt(v) {
  return /^.*\.[\w]+$/.test(v);
}

/**
 * @typedef {Object.<string, string[]>} AcceptProp
 */

/**
 * @typedef {object} FileError
 * @property {string} message
 * @property {ErrorCode|string} code
 */

/**
 * @typedef {"file-invalid-type"|"file-too-large"|"file-too-small"|"too-many-files"} ErrorCode
 */
