import { getDataTransferItems, isIeOrEdge } from './'

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

describe('getDataTransferItems', () => {
  it('should return an array', () => {
    const res = getDataTransferItems({})
    expect(res).toBeInstanceOf(Array)
    expect(res).toHaveLength(0)
  })

  it('should get dataTransfer before using target', () => {
    const event = {
      target: {
        files
      },
      dataTransfer: {
        files
      }
    }
    const res = getDataTransferItems(event)
    expect(res).toBeInstanceOf(Array)
    expect(res).toHaveLength(3)
  })

  it('should use dataTransfer.items if files is not defined', () => {
    const event = {
      target: {
        files: [{}]
      },
      dataTransfer: {
        items: files
      }
    }
    const res = getDataTransferItems(event)
    expect(res).toBeInstanceOf(Array)
    expect(res).toHaveLength(3)
  })

  it('should use event.target if dataTransfer is not defined', () => {
    const event = {
      target: {
        files
      }
    }
    const res = getDataTransferItems(event)
    expect(res).toBeInstanceOf(Array)
    expect(res).toHaveLength(3)
  })

  it('should prioritize dataTransfer.files over .files', () => {
    const event = {
      dataTransfer: {
        files: [{}, {}],
        items: [{}, {}, {}]
      }
    }
    const res = getDataTransferItems(event)
    expect(res).toBeInstanceOf(Array)
    expect(res).toHaveLength(2)
  })

  it('should not mutate data', () => {
    const event = {
      dataTransfer: {
        files
      }
    }
    expect(Object.keys(files[2])).toHaveLength(3)
    getDataTransferItems(event, true)
    expect(Object.keys(files[2])).toHaveLength(3)
  })
})

describe('isIeOrEdge', () => {
  it('should return true for IE10', () => {
    const userAgent =
      'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; WOW64; Trident/6.0; .NET4.0E; .NET4.0C; .NET CLR 3.5.30729; .NET CLR 2.0.50727; .NET CLR 3.0.30729)'

    expect(isIeOrEdge(userAgent)).toBe(true)
  })

  it('should return true for IE11', () => {
    const userAgent =
      'Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; .NET CLR 2.0.50727; .NET CLR 3.0.30729; .NET CLR 3.5.30729; rv:11.0) like Gecko'
    expect(isIeOrEdge(userAgent)).toBe(true)
  })

  it('should return true for Edge', () => {
    const userAgent =
      'Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 Edge/16.16258'

    expect(isIeOrEdge(userAgent)).toBe(true)
  })

  it('should return false for Chrome', () => {
    const userAgent =
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.186 Safari/537.36'

    expect(isIeOrEdge(userAgent)).toBe(false)
  })
})
