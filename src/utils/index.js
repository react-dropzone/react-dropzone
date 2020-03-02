import accepts from 'attr-accept'

// Firefox versions prior to 53 return a bogus MIME type for every file drag, so dragovers with
// that MIME type will always be accepted
export function fileAccepted(file, accept) {
  return file.type === 'application/x-moz-file' || accepts(file, accept)
}

export function fileMatchSize(file, minSize, maxSize) {
  if (isDefined(file.size)) {
    if (isDefined(minSize) && isDefined(maxSize))
      return file.size >= minSize && file.size <= maxSize
    else if (isDefined(minSize))
      return file.size >= minSize
    else if (isDefined(maxSize))
      return file.size <= maxSize
  }
  return true
}

function isDefined(value) {
  return value !== undefined && value !== null
}

export function allFilesAccepted({ files, accept, minSize, maxSize, multiple }) {
  if (!multiple && files.length > 1) {
    return false;
  }

  return files.every(file => {
    return fileAccepted(file, accept) && fileMatchSize(file, minSize, maxSize)
  })
}

// React's synthetic events has event.isPropagationStopped,
// but to remain compatibility with other libs (Preact) fall back
// to check event.cancelBubble
export function isPropagationStopped(event) {
  if (typeof event.isPropagationStopped === 'function') {
    return event.isPropagationStopped()
  } else if (typeof event.cancelBubble !== 'undefined') {
    return event.cancelBubble
  }
  return false
}

export function isEvtWithFiles(event) {
  if (!event.dataTransfer) {
    return !!event.target && !!event.target.files
  }
  // https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/types
  // https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/Recommended_drag_types#file
  return Array.prototype.some.call(
    event.dataTransfer.types,
    type => type === 'Files' || type === 'application/x-moz-file'
  )
}

export function isKindFile(item) {
  return typeof item === 'object' && item !== null && item.kind === 'file'
}

// allow the entire document to be a drag target
export function onDocumentDragOver(event) {
  event.preventDefault()
}

function isIe(userAgent) {
  return userAgent.indexOf('MSIE') !== -1 || userAgent.indexOf('Trident/') !== -1
}

function isEdge(userAgent) {
  return userAgent.indexOf('Edge/') !== -1
}

export function isIeOrEdge(userAgent = window.navigator.userAgent) {
  return isIe(userAgent) || isEdge(userAgent)
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
    fns.some(fn => {
      if (!isPropagationStopped(event) && fn) {
        fn(event, ...args)
      }
      return isPropagationStopped(event)
    })
}
