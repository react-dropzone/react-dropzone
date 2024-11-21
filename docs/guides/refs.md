# Refs

Using refs is sometimes needed for interacting with other libraries, e.g. [styled-components](https://styled-components.com/) and both the dropzone hook and component provide support for it.

## Hook

Both `getRootProps` and `getInputProps` accept a custom `refKey` (defaults to `ref`) as one of the properties provided with the parameter.

This can be useful when the element you're trying to apply the props from either one of those fns does not expose a reference to the element, e.g.:

```jsx
import React from 'react'
import {useDropzone} from 'react-dropzone'
// NOTE: After v4.0.0, styled components exposes a ref using forwardRef,
// therefore, there's no need for using `innerRef` as `refKey`.
import styled from 'styled-components'

const StyledDiv = styled.div`
  // Some styling here
`
function Refs() {
  const {getRootProps, getInputProps} = useDropzone()
  <StyledDiv {...getRootProps({ refKey: 'innerRef' })}>
    <input {...getInputProps()} />
    <p>Drag 'n' drop some files here, or click to select files</p>
  </StyledDiv>
}
```

The ref for the elements you set either `getRootProps` or `getInputProps` on are returned by the hook:

```jsx
import React from 'react'
import {useDropzone} from 'react-dropzone'

function Refs() {
  const {
    getRootProps,
    getInputProps,
    rootRef, // Ref to the `<div>` where `getRootProps` is applied
    inputRef // Ref to the `<input>` where `getRootProps` is applied
  } = useDropzone()
  <div {...getRootProps()}>
    <input {...getInputProps()} />
    <p>Drag 'n' drop some files here, or click to select files</p>
  </div>
}
```

## Component

If you're using the `<Dropzone>` component, though, you can set the `ref` prop on the component itself which will expose the `{open}` prop that can be used to open the file dialog programmatically:

```jsx
import React, {createRef} from 'react'
import Dropzone from 'react-dropzone'

const dropzoneRef = createRef()

<Dropzone ref={dropzoneRef}>
  {({getRootProps, getInputProps}) => (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <p>Drag 'n' drop some files here, or click to select files</p>
    </div>
  )}
</Dropzone>

dropzoneRef.open()
```

## MUI

If you're working with [Material UI v4](https://v4.mui.com/) and would like to apply the root props on some component that does not expose a ref, use [RootRef](https://v4.mui.com/api/root-ref/):

```jsx
import React from 'react'
import {useDropzone} from 'react-dropzone'
import RootRef from '@material-ui/core/RootRef'

function PaperDropzone() {
  const {getRootProps, getInputProps} = useDropzone()
  const {ref, ...rootProps} = getRootProps()

  <RootRef rootRef={ref}>
    <Paper {...rootProps}>
      <input {...getInputProps()} />
      <p>Drag 'n' drop some files here, or click to select files</p>
    </Paper>
  </RootRef>
}
```
