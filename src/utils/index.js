import accepts from 'attr-accept'

export const supportMultiple =
  typeof document !== 'undefined' && document && document.createElement
    ? 'multiple' in document.createElement('input')
    : true

async function getFileFromEntry(entry) {
  let result
  await new Promise(resolve => {
    entry.file(file => {
      result = file
      resolve()
    })
  })
  return result
}

async function getFilesFromDirectory(directory) {
  let results = []
  const dirReader = directory.createReader()
  await new Promise(resolve => {
    const entriesReader = async entries => {
      for (let i = 0; i < entries.length; i += 1) {
        const entry = entries[i]
        if (entry.isFile) {
          results.push(await getFileFromEntry(entry))
        } else if (entry.isDirectory) {
          results = results.concat(await getFilesFromDirectory(entry))
        }
      }
      resolve()
    }
    dirReader.readEntries(entriesReader)
  })
  return results
}

async function getFilesFromItems(items) {
  let results = []
  for (let i = 0; i < items.length; i += 1) {
    const item = items[i]
    if (item.webkitGetAsEntry != null && item.webkitGetAsEntry()) {
      const entry = item.webkitGetAsEntry()
      if (entry.isFile && item.getAsFile()) {
        results.push(item.getAsFile())
      } else if (entry.isDirectory) {
        results = results.concat(await getFilesFromDirectory(entry, entry.name))
      }
    } else if (item.getAsFile != null) {
      if (item.kind == null || (item.kind === 'file' && item.getAsFile())) {
        results.push(item.getAsFile())
      }
    }
  }
  return results
}

export async function getDataTransferItems(event) {
  let dataTransferItemsList = []
  if (event.dataTransfer) {
    const dt = event.dataTransfer
    if (dt.items && dt.items.length && dt.items[0].webkitGetAsEntry != null) {
      // The browser supports dropping of folders, so handle items instead of files
      dataTransferItemsList = await getFilesFromItems(dt.items)
    } else if (dt.files && dt.files.length) {
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
export function fileAccepted(file, accept) {
  return file.type === 'application/x-moz-file' || accepts(file, accept)
}

export function fileMatchSize(file, maxSize, minSize) {
  return file.size <= maxSize && file.size >= minSize
}

export function allFilesAccepted(files, accept) {
  return files.every(file => fileAccepted(file, accept))
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
