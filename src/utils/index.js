import accepts from 'attr-accept'

export const supportMultiple =
  typeof document !== 'undefined' && document && document.createElement
    ? 'multiple' in document.createElement('input')
    : true

export function getDataTransferItems(event) {
  let dataTransferItemsList = []
  if (event.dataTransfer) {
    const dt = event.dataTransfer

    if (dt.files && dt.files.length) {
      dataTransferItemsList = dt.files
    } else if (dt.items && dt.items.length) {
      // During the drag even the dataTransfer.files is null
      // but Chrome implements some drag store, which is accesible via dataTransfer.items
      // Map the items to File objects,
      // and filter non-File items
      // see https://developer.mozilla.org/en-US/docs/Web/API/DataTransferItem/getAsFile
      const files = Array.prototype.map.call(dt.items, item => item.getAsFile())
      dataTransferItemsList = Array.prototype.filter.call(files, file => file !== null)
    }
  } else if (event.target && event.target.files) {
    dataTransferItemsList = event.target.files
  }

  // Convert from DataTransferItemsList to the native Array
  return Array.prototype.slice.call(dataTransferItemsList)
}

// Firefox versions prior to 53 return a bogus MIME type for every file drag, so dragovers with
// that MIME type will always be accepted
export function fileAccepted(file, accept) {
  return file.type === 'application/x-moz-file' || accepts(file, accept)
}

export function fileMatchSize(file, maxSize, minSize) {
  return file.size <= maxSize && file.size >= minSize
}

export function allFilesAccepted(files, accept) {
  return files.every(file => fileAccepted(file, accept))
}

export function hasFiles(files) {
  // Allow only files and retun the items as a list of File,
  // see https://developer.mozilla.org/en-US/docs/Web/API/DataTransferItem for details
  return (
    Array.isArray(files) &&
    files.length > 0 &&
    Array.prototype.every.call(files, file => file instanceof File)
  )
}

// allow the entire document to be a drag target
export function onDocumentDragOver(evt) {
  evt.preventDefault()
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
