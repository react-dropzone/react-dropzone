import getDataTransferFiles from './getDataTransferItems';

const files = [{
  name: 'file1.pdf',
  size: 1111,
  type: 'application/pdf'
}, {
  name: 'cats.gif',
  size: 1234,
  type: 'image/gif'
}, {
  name: 'dogs.jpg',
  size: 2345,
  type: 'image/jpeg'
}];

describe('getDataTransferFiles', () => {

  it('should return an array', () => {
    const res = getDataTransferFiles({});
    expect(res).toBeInstanceOf(Array);
    expect(res).toHaveLength(0);
  });

  it('should get dataTransfer before using target', () => {
    const event = {
      target: {
        files
      },
      dataTransfer: {
        files
      }
    };
    const res = getDataTransferFiles(event);
    expect(res).toBeInstanceOf(Array);
    expect(res).toHaveLength(3);
  });

  it('should use dataTransfer.items if files is not defined', () => {
    const event = {
      target: {
        files: [{}]
      },
      dataTransfer: {
        items: files
      }
    };
    const res = getDataTransferFiles(event);
    expect(res).toBeInstanceOf(Array);
    expect(res).toHaveLength(3);
  });

  it('should use event.target if dataTransfer is not defined', () => {
    const event = {
      target: {
        files
      }
    };
    const res = getDataTransferFiles(event);
    expect(res).toBeInstanceOf(Array);
    expect(res).toHaveLength(3);
  });

  it('should prioritize dataTransfer.files over .files', () => {
    const event = {
      dataTransfer: {
        files: [{}, {}],
        items: [{}, {}, {}]
      }
    };
    const res = getDataTransferFiles(event);
    expect(res).toBeInstanceOf(Array);
    expect(res).toHaveLength(2);
  });

  it('should return first file if isMultipleAllowed is false', () => {
    const event = {
      target: {
        files
      },
      dataTransfer: {
        files
      }
    };
    const res = getDataTransferFiles(event, false);
    expect(res).toHaveLength(1);
    expect(res[0].name).toEqual(files[0].name);
  });

  it('should not mutate data', () => {
    const event = {
      dataTransfer: {
        files
      }
    };
    expect(Object.keys(files[2])).toHaveLength(3);
    getDataTransferFiles(event, true);
    expect(Object.keys(files[2])).toHaveLength(3);

  });

});
