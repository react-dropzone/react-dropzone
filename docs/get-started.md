---
outline: deep
---

# Get Started

## Try it Online

You can try it online on [Codesandbox](https://codesandbox.io/p/devbox/currying-thunder-jq6d5).

## Installation

You can install this package from [npm](https://www.npmjs.com/package/react-dropzone):

```shell
npm install --save react-dropzone
```

## Usage

You can either use the hook:

```jsx static
import React, {useCallback} from 'react'
import {useDropzone} from 'react-dropzone'

function MyDropzone() {
  const onDrop = useCallback(acceptedFiles => {
    // Do something with the files
  }, [])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {
        isDragActive ?
          <p>Drop the files here ...</p> :
          <p>Drag 'n' drop some files here, or click to select files</p>
      }
    </div>
  )
}
```

Or the wrapper component for the hook:
```jsx static
import React from 'react'
import Dropzone from 'react-dropzone'

<Dropzone onDrop={acceptedFiles => console.log(acceptedFiles)}>
  {({getRootProps, getInputProps}) => (
    <section>
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>
    </section>
  )}
</Dropzone>
```
