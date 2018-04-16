/**
* Html5 File Selector
* https://github.com/quarklemotion/html5-file-selector
* This source code is licensed under the MIT license found in the
* LICENSE.txt file in the root directory of this source tree.
 */

const DEFAULT_FILES_TO_IGNORE = [
  '.DS_Store', // OSX indexing file
  'Thumbs.db' // Windows indexing file
]

function shouldIgnoreFile(file) {
  return DEFAULT_FILES_TO_IGNORE.indexOf(file.name) >= 0
}

function traverseDirectory(entry) {
  const reader = entry.createReader()
  // Resolved when the entire directory is traversed
  return new Promise(resolveDirectory => {
    const iterationAttempts = []
    const errorHandler = () => {}
    function readEntries() {
      // According to the FileSystem API spec, readEntries() must be called until
      // it calls the callback with an empty array.
      reader.readEntries(batchEntries => {
        if (!batchEntries.length) {
          // Done iterating this particular directory
          resolveDirectory(Promise.all(iterationAttempts))
        } else {
          // Add a list of promises for each directory entry.  If the entry is itself
          // a directory, then that promise won't resolve until it is fully traversed.
          iterationAttempts.push(
            Promise.all(
              batchEntries.map(batchEntry => {
                if (batchEntry.isDirectory) {
                  return traverseDirectory(batchEntry)
                }
                return Promise.resolve(batchEntry)
              })
            )
          )
          // Try calling readEntries() again for the same dir, according to spec
          readEntries()
        }
      }, errorHandler)
    }
    // initial call to recursive entry reader function
    readEntries()
  })
}

// package the file in an object that includes the fullPath from the file entry
// that would otherwise be lost
function packageFile(file, entry) {
  return {
    fileObject: file,
    type: file.type ? file.type : '',
    name: file.name,
    size: file.size,
    fullPath: entry ? entry.fullPath : file.name
  }
}

function getFile(entry) {
  return new Promise(resolve => {
    entry.file(file => {
      resolve(packageFile(file, entry))
    })
  })
}

function handleFilePromises(promises, fileList) {
  return Promise.all(promises).then(files => {
    files.forEach(file => {
      if (!shouldIgnoreFile(file)) {
        fileList.push(file)
      }
    })
    return fileList
  })
}

export function getDataTransferFiles(dataTransfer) {
  const dataTransferFiles = []
  const folderPromises = []
  const filePromises = []
  ;[].slice.call(dataTransfer.items).forEach(listItem => {
    if (typeof listItem.webkitGetAsEntry === 'function') {
      const entry = listItem.webkitGetAsEntry()

      if (entry && entry.isDirectory) {
        folderPromises.push(traverseDirectory(entry))
      } else {
        filePromises.push(getFile(entry))
      }
    } else {
      dataTransferFiles.push(listItem)
    }
  })
  if (folderPromises.length) {
    const flatten = array =>
      array.reduce(
        (aArray, bArray) => aArray.concat(Array.isArray(bArray) ? flatten(bArray) : bArray),
        []
      )
    return Promise.all(folderPromises).then(fileEntries => {
      const flattenedEntries = flatten(fileEntries)
      // collect async promises to convert each fileEntry into a File object
      flattenedEntries.forEach(fileEntry => {
        filePromises.push(getFile(fileEntry))
      })
      return handleFilePromises(filePromises, dataTransferFiles)
    })
  } else if (filePromises.length) {
    return handleFilePromises(filePromises, dataTransferFiles)
  }
  return Promise.resolve(dataTransferFiles)
}

/**
 * This function should be called from both the onDrop event from your drag/drop
 * dropzone as well as from the HTML5 file selector input field onChange event
 * handler.  Pass the event object from the triggered event into this function.
 * Supports mix of files and folders dropped via drag/drop.
 *
 * Returns: an array of File objects, that includes all files within folders
 *   and subfolders of the dropped/selected items.
 */
export function getDroppedOrSelectedFiles(event) {
  const dataTransfer = event.dataTransfer
  if (dataTransfer && dataTransfer.items) {
    return getDataTransferFiles(dataTransfer).then(fileList => Promise.resolve(fileList))
  }
  const files = []
  const dragDropFileList = dataTransfer && dataTransfer.files
  const inputFieldFileList = event.target && event.target.files
  const fileList = dragDropFileList || inputFieldFileList || []
  // convert the FileList to a simple array of File objects
  for (let i = 0; i < fileList.length; i += 1) {
    files.push(packageFile(fileList[i]))
  }
  return Promise.resolve(files)
}
