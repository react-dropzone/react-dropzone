function traverseDirectory(entry, path, entriesList) {
  const reader = entry.createReader()
  // Resolved when the entire directory is traversed
  return new Promise(resolveDirectory => {
    const iterationAttempts = []
    ;(function readEntries() {
      // According to the FileSystem API spec, readEntries() must be called until
      // it calls the callback with an empty array.  Seriously??
      reader.readEntries(entries => {
        if (!entries.length) {
          // Done iterating this particular directory
          resolveDirectory(Promise.all(iterationAttempts))
        } else {
          // Add a list of promises for each directory entry.  If the entry is itself
          // a directory, then that promise won't resolve until it is fully traversed.
          iterationAttempts.push(
            Promise.all(
              entries.map(entryObj => {
                if (entryObj.isFile) {
                  return new Promise(resolve => {
                    entryObj.file(file => {
                      file.fullPath = `${path}/${file.name}` // eslint-disable-line no-param-reassign
                      entriesList.push(file)
                      resolve(file)
                    })
                  })
                }
                // DO SOMETHING WITH DIRECTORIES
                return traverseDirectory(entryObj, `${path}/${entryObj.name}`, entriesList)
              })
            )
          )
          // Try calling readEntries() again for the same dir, according to spec
          readEntries()
        }
      })
    })()
  })
}

const addFilesFromItems = items => {
  let entry
  let item
  let i
  let len
  const results = []
  const promises = []

  for ((i = 0), (len = items.length); i < len; i += 1) {
    item = items[i]
    entry = item.webkitGetAsEntry()
    if (item.webkitGetAsEntry != null && entry) {
      if (entry.isFile) {
        results.push(item.getAsFile())
      } else if (entry.isDirectory) {
        promises.push(traverseDirectory(entry, entry.name, results))
      }
    } else if (item.getAsFile != null) {
      if (item.kind == null || item.kind === 'file') {
        results.push(item.getAsFile())
      }
    }
  }

  return Promise.all(promises).then(() => results)
}

export default function getDataTransferItems(evt) {
  let files
  let items
  let dataTransferItemsList = []

  if (evt.dataTransfer) {
    files = evt.dataTransfer.files
    if (files.length) {
      items = evt.dataTransfer.items
      if (items && items.length && items[0].webkitGetAsEntry != null) {
        dataTransferItemsList = addFilesFromItems(items)
      } else {
        dataTransferItemsList = Array.prototype.slice.call(files)
      }
    }
  } else if (evt.target && evt.target.files) {
    dataTransferItemsList = Array.prototype.slice.call(evt.target.files)
  }
  return Promise.resolve(dataTransferItemsList)
}
