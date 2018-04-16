/**
* Html5 File Selector
* https://github.com/quarklemotion/html5-file-selector
* This source code is licensed under the MIT license found in the
* LICENSE.txt file in the root directory of this source tree.
 */

import * as Html5FileSelector from './Html5FileSelector'

const MOCK_MEDIA_FILES = [
  { type: 'image/jpg', name: 'monkey_see.jpg' },
  { type: 'video/mp4', name: 'monkey_pod.mp4' },
  { type: 'image/jpg', name: 'cat1.jpg' },
  { type: 'video/mp4', name: 'cat_pile.mp4' },
  { type: 'image/jpg', name: 'dog.jpg' },
  { type: 'video/mp4', name: 'dog_barking.mp4' },
  { type: 'image/jpg', name: 'giraffe.jpg' },
  { type: 'video/mp4', name: 'giraffe_eats.mp4' },
  { type: 'image/jpg', name: 'rabbit.jpg' },
  { type: 'video/mp4', name: 'white_rabbit_song.mp4' }
]
const MOCK_INDEX_FILES = [{ type: '', name: '.DS_Store' }, { type: '', name: 'Thumbs.db' }]

function fileComparator(aFile, bFile) {
  const textA = aFile.name
  const textB = bFile.name
  if (textA < textB) {
    return -1
  } else if (textA > textB) {
    return 1
  }

  return 0
}

function createDataTransferItemFile(file) {
  return {
    isDirectory: false,
    isFile: true,
    file: callback => callback(file)
  }
}

function createDataTransferItemFolder(containedFiles) {
  return {
    isDirectory: true,
    isFile: false,
    createReader: () => ({
      sentEntries: false, // not part of the actual API, just used for real API behavior mimicking
      readEntries(callback) {
        if (!this.sentEntries) {
          this.sentEntries = true
          callback(containedFiles)
        } else {
          callback([])
        }
      }
    })
  }
}

function topLevelEntry(entry) {
  return {
    webkitGetAsEntry: () => entry
  }
}

describe('Html5FileSelector', () => {
  describe('.getDroppedOrSelectedFiles', () => {
    it('handles files manually selected through a HTML file picker', done => {
      const mockSelectedFiles = MOCK_MEDIA_FILES.slice(0, 2)
      const filesSelectedEvent = {
        target: {
          files: mockSelectedFiles
        }
      }

      Html5FileSelector.getDroppedOrSelectedFiles(filesSelectedEvent).then(selectedFiles => {
        expect(selectedFiles.map(file => file.name).join(',')).toEqual(
          mockSelectedFiles.map(file => file.name).join(',')
        )
        done()
      })
    })

    it('handles individual files dropped to a drop zone', done => {
      const mockDataTransferItems = [
        topLevelEntry(createDataTransferItemFile(MOCK_MEDIA_FILES[0])),
        topLevelEntry(createDataTransferItemFile(MOCK_MEDIA_FILES[1])),
        topLevelEntry(createDataTransferItemFile(MOCK_MEDIA_FILES[2])),
        topLevelEntry(createDataTransferItemFile(MOCK_MEDIA_FILES[3])),
        topLevelEntry(createDataTransferItemFile(MOCK_MEDIA_FILES[4]))
      ]
      const mockFilesDroppedEvent = {
        dataTransfer: {
          items: mockDataTransferItems
        }
      }
      Html5FileSelector.getDroppedOrSelectedFiles(mockFilesDroppedEvent)
        .then(selectedFiles => {
          const sortedFiles = selectedFiles.sort(fileComparator)
          expect(sortedFiles.map(file => file.name).join(',')).toEqual(
            MOCK_MEDIA_FILES.slice(0, 5)
              .sort(fileComparator)
              .map(file => file.name)
              .join(',')
          )
          done()
        })
        .catch(error => {
          done(error)
        })
    })

    it('returns flattened files dropped from a mix of files and multi-nested folders dropped to a drop zone', done => {
      const mockDataTransferItems = [
        topLevelEntry(createDataTransferItemFile(MOCK_MEDIA_FILES[0])),
        topLevelEntry(createDataTransferItemFile(MOCK_MEDIA_FILES[1])),
        topLevelEntry(
          createDataTransferItemFolder([
            createDataTransferItemFolder([
              createDataTransferItemFile(MOCK_MEDIA_FILES[2]),
              createDataTransferItemFile(MOCK_MEDIA_FILES[3]),
              createDataTransferItemFile(MOCK_MEDIA_FILES[4])
            ]),
            createDataTransferItemFile(MOCK_MEDIA_FILES[5]),
            createDataTransferItemFile(MOCK_MEDIA_FILES[6])
          ])
        ),
        topLevelEntry(createDataTransferItemFile(MOCK_MEDIA_FILES[7])),
        topLevelEntry(
          createDataTransferItemFolder([
            createDataTransferItemFile(MOCK_MEDIA_FILES[8]),
            createDataTransferItemFile(MOCK_MEDIA_FILES[9])
          ])
        )
      ]
      const mockFilesDroppedEvent = {
        dataTransfer: {
          items: mockDataTransferItems
        }
      }
      Html5FileSelector.getDroppedOrSelectedFiles(mockFilesDroppedEvent)
        .then(selectedFiles => {
          const sortedFiles = selectedFiles.sort(fileComparator)
          expect(sortedFiles.map(file => file.name).join(',')).toEqual(
            MOCK_MEDIA_FILES.sort(fileComparator)
              .map(file => file.name)
              .join(',')
          )
          done()
        })
        .catch(error => {
          done(error)
        })
    })

    it('ignores OS-specific indexing files', done => {
      const mockDataTransferItems = [
        topLevelEntry(createDataTransferItemFile(MOCK_MEDIA_FILES[0])),
        topLevelEntry(createDataTransferItemFile(MOCK_MEDIA_FILES[1])),
        topLevelEntry(
          createDataTransferItemFolder([
            createDataTransferItemFolder([
              createDataTransferItemFile(MOCK_INDEX_FILES[0]),
              createDataTransferItemFile(MOCK_INDEX_FILES[1]),
              createDataTransferItemFile(MOCK_MEDIA_FILES[2])
            ]),
            createDataTransferItemFile(MOCK_INDEX_FILES[0]),
            createDataTransferItemFile(MOCK_MEDIA_FILES[3])
          ])
        ),
        topLevelEntry(createDataTransferItemFile(MOCK_MEDIA_FILES[4])),
        topLevelEntry(
          createDataTransferItemFolder([
            createDataTransferItemFile(MOCK_INDEX_FILES[1]),
            createDataTransferItemFile(MOCK_MEDIA_FILES[5])
          ])
        )
      ]
      const mockFilesDroppedEvent = {
        dataTransfer: {
          items: mockDataTransferItems
        }
      }
      Html5FileSelector.getDroppedOrSelectedFiles(mockFilesDroppedEvent)
        .then(selectedFiles => {
          const sortedFiles = selectedFiles.sort(fileComparator)
          expect(sortedFiles.map(file => file.name).join(',')).toEqual(
            MOCK_MEDIA_FILES.slice(0, 6)
              .sort(fileComparator)
              .map(file => file.name)
              .join(',')
          )
          done()
        })
        .catch(error => {
          done(error)
        })
    })
  })
})
