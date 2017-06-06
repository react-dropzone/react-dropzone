import getDataTransferFiles from './getDataTransferItems'

const files = [
  {
    name: 'file1.pdf',
    size: 1111,
    type: 'application/pdf'
  },
  {
    name: 'cats.gif',
    size: 1234,
    type: 'image/gif'
  },
  {
    name: 'dogs.jpg',
    size: 2345,
    type: 'image/jpeg'
  }
]

describe('getDataTransferFiles', () => {
  it('should return an promise with an array', done => {
    const res = getDataTransferFiles({})
    expect(res).toBeInstanceOf(Promise)
    res.then(data => {
      expect(data).toBeInstanceOf(Array)
      done()
    })
  })

  it('should get dataTransfer before using target', done => {
    const event = {
      target: {
        files
      },
      dataTransfer: {
        files
      }
    }
    const res = getDataTransferFiles(event)
    res.then(data => {
      expect(data).toHaveLength(3)
      done()
    })
  })

  it('should use dataTransfer.items if files is not defined', done => {
    const event = {
      target: {
        files: [{}]
      },
      dataTransfer: {
        items: files
      }
    }
    const res = getDataTransferFiles(event)
    res.then(data => {
      expect(data).toHaveLength(3)
      done()
    })
  })

  it('should use event.target if dataTransfer is not defined', done => {
    const event = {
      target: {
        files
      }
    }
    const res = getDataTransferFiles(event)
    res.then(data => {
      expect(data).toHaveLength(3)
      done()
    })
  })

  it('should prioritize dataTransfer.files over .files', done => {
    const event = {
      dataTransfer: {
        files: [{}, {}],
        items: [{}, {}, {}]
      }
    }
    const res = getDataTransferFiles(event)
    res.then(data => {
      expect(data).toHaveLength(2)
      done()
    })
  })

  it('should not mutate data', done => {
    const event = {
      dataTransfer: {
        files
      }
    }
    expect(Object.keys(files[2])).toHaveLength(3)
    getDataTransferFiles(event).then(() => {
      expect(Object.keys(files[2])).toHaveLength(3)
      done()
    })
  })
})
