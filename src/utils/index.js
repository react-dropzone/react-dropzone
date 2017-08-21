import accepts from 'attr-accept'

export const supportMultiple =
  typeof document !== 'undefined' && document && document.createElement
    ? 'multiple' in document.createElement('input')
    : true

// Firefox versions prior to 53 return a bogus MIME type for every file drag, so dragovers with
// that MIME type will always be accepted
export const fileAccepted = (file, accept) =>
  file.type === 'application/x-moz-file' || accepts(file, accept)

export const fileMatchSize = (file, maxSize, minSize) =>
  file.size <= maxSize && file.size >= minSize

export const allFilesAccepted = (files, accept) => files.every(file => fileAccepted(file, accept))

// allow the entire document to be a drag target
export const onDocumentDragOver = evt => evt.preventDefault()
