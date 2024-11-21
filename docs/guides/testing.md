# Testing

This library makes some of its drag 'n' drop callbacks asynchronous to enable promise based `getFilesFromEvent()` functions.

In order to test components that use this library, you need to use the [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/):

```js
import React from 'react'
import Dropzone from 'react-dropzone'
import {act, fireEvent, render} from '@testing-library/react'

test('invoke onDragEnter when dragenter event occurs', async () => {
  const file = new File([
    JSON.stringify({ping: true})
  ], 'ping.json', { type: 'application/json' })
  const data = mockData([file])
  const onDragEnter = jest.fn()

  const ui = (
    <Dropzone onDragEnter={onDragEnter}>
      {({ getRootProps, getInputProps }) => (
        <div {...getRootProps()}>
          <input {...getInputProps()} />
        </div>
      )}
    </Dropzone>
  )
  const { container } = render(ui)

  await act(
    () => fireEvent.dragEnter(
      container.querySelector('div'),
      data,
    )
  );
  expect(onDragEnter).toHaveBeenCalled()
})

function mockData(files) {
  return {
    dataTransfer: {
      files,
      items: files.map(file => ({
        kind: 'file',
        type: file.type,
        getAsFile: () => file
      })),
      types: ['Files']
    }
  }
}
```

> [!NOTE]
> Using [Enzyme](https://enzymejs.github.io/enzyme/) for testing is not supported at the moment, see [#2011](https://github.com/airbnb/enzyme/issues/2011).

More examples for this can be found in this library's own [test suites](https://github.com/react-dropzone/react-dropzone/blob/master/src/index.spec.js).
