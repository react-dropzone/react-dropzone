import accepts from 'attr-accept'

export const supportMultiple =
  typeof document !== 'undefined' && document && document.createElement
    ? 'multiple' in document.createElement('input')
    : true

export const getDataTransferItems = event => {
  let dataTransferItemsList = []
  if (event.dataTransfer) {
    const dt = event.dataTransfer
    if (dt.files && dt.files.length) {
      dataTransferItemsList = dt.files
    } else if (dt.items && dt.items.length) {
      // During the drag even the dataTransfer.files is null
      // but Chrome implements some drag store, which is accesible via dataTransfer.items
      dataTransferItemsList = dt.items
    }
  } else if (event.target && event.target.files) {
    dataTransferItemsList = event.target.files
  }
  // Convert from DataTransferItemsList to the native Array
  return Array.prototype.slice.call(dataTransferItemsList)
}

// Firefox versions prior to 53 return a bogus MIME type for every file drag, so dragovers with
// that MIME type will always be accepted
export const fileAccepted = (file, accept) =>
  file.type === 'application/x-moz-file' || accepts(file, accept)

export const fileMatchSize = (file, maxSize, minSize) =>
  file.size <= maxSize && file.size >= minSize

export const allFilesAccepted = (files, accept) => files.every(file => fileAccepted(file, accept))

// allow the entire document to be a drag target
export const onDocumentDragOver = evt => {
  evt.preventDefault()
}
