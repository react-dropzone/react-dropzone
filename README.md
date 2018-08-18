![react-dropzone logo](https://raw.githubusercontent.com/okonet/react-dropzone/master/logo/logo.png)

# react-dropzone

[![Build Status](https://travis-ci.org/okonet/react-dropzone.svg?branch=master)](https://travis-ci.org/okonet/react-dropzone) [![npm version](https://badge.fury.io/js/react-dropzone.svg)](https://badge.fury.io/js/react-dropzone) [![codecov](https://codecov.io/gh/okonet/react-dropzone/branch/master/graph/badge.svg)](https://codecov.io/gh/okonet/react-dropzone) [![OpenCollective](https://opencollective.com/react-dropzone/backers/badge.svg)](#backers) 
[![OpenCollective](https://opencollective.com/react-dropzone/sponsors/badge.svg)](#sponsors)

Simple HTML5-compliant drag'n'drop zone for files built with React.js.

Documentation and examples: https://react-dropzone.js.org
Source code: https://github.com/okonet/react-dropzone/

---

## Installation

Install it from npm and include it in your React build process (using [Webpack](http://webpack.github.io/), [Browserify](http://browserify.org/), etc).

```bash
npm install --save react-dropzone
```

## Usage with ES2015 classes

```javascript
import React from 'react'
import cx from 'classnames'
import Dropzone from 'react-dropzone'

class MyDropzone extends React.Component {

  onDrop = (acceptedFiles, rejectedFiles) => {
    // Do something with files
    // i.e. pre-process, upload etc.
  }

  render() {
    return (
      <Dropzone onDrop={this.onDrop}>
        {({ getRootProps, getInputProps, isDragActive }) => {
          return (
            <div
              {...getRootProps()}
              className={cx('dropzone', {
                'dropzone--isActive': isDragActive
              })}
            >
              <input {...getInputProps()} />
              {
                isDragActive ?
                  <p>Drop files here...</p> :
                  <p>Try dropping some files here, or click to select files to upload.</p>
              }
            </div>
          )
        }}
      </Dropzone>
    );
  }
}

``` 

## Render Prop Function

This is where you render whatever you want to based on the state of `Dropzone`.
You can also pass it as the children prop if you prefer to do things that way
> `<Dropzone>{/* right here*/}</Dropzone>`

The properties of this object can be split into two categories as indicated
below:

### Prop Getters

These functions are used to apply props to the elements that you render. This
gives you maximum flexibility to render what, when, and wherever you like. You
call these on the element in question (for example: `<div {...getRootProps()}`)). It's advisable to pass all your props to that function
rather than applying them on the element yourself to avoid your props being
overridden (or overriding the props returned). For example:
`getRootProps({onClick(event) {console.log(event)}})`.

| property          | type           | description                                                                    |
| ----------------- | -------------- | ------------------------------------------------------------------------------ |
| `getRootProps`    | `function({})` | Returns the props you should apply to the root drop container you render       |
| `getInputProps`   | `function({})` | Returns the props you should apply to hidden file input you render             |

### state

These are values that represent the current state of Dropzone component.

| property                               | type      | description                                             |
| -------------------------------------- | --------- | --------------------------------------------------------|
| `isDragActive`                         | `boolean` | Flag indicating whether an active drag is in progress   |
| `isDragAccept`                         | `boolean` | Flag indicating whether the files dragged are accepted  |
| `isDragReject`                         | `boolean` | Flag indicating whether the files dragged are rejected  |
| `draggedFiles`                         | `array`   | List of files in active drag                            |
| `acceptedFiles`                        | `array`   | List of accepted files in active drag                   |
| `rejectedFiles`                        | `array`   | List of rejected files in active drag                   |

### Custom refKey

Both `getRootProps` and `getInputProps` accept custom `refKey` (defaulted to `ref`) as one of the attributes passed down in the parameter.

This is especially useful when incorporating custom components, e.g. styled-components, in which case you will use `innerRef` as the `refKey`.

```javascript
const StyledDropArea = styled.div`
  // Some styling here
`

const Example = () => (
  <Dropzone>
    {({ getRootProps, getInputProps }) => (
      <StyledDropArea {...getRootProps({ refKey: 'innerRef' })}>
        <input {...getInputProps()} />
        <p>Drop some files here</p>
      </StyledDropArea>
    )}
  </Dropzone>
);
```

## PropTypes

See https://react-dropzone.netlify.com/#proptypes

### Word of caution when working with previews

*Important*: `react-dropzone` doesn't manage dropped files. You need to destroy the object URL yourself whenever you don't need the `preview` by calling `window.URL.revokeObjectURL(file.preview);` to avoid memory leaks.

## Support

### Backers
Support us with a monthly donation and help us continue our activities. [[Become a backer](https://opencollective.com/react-dropzone#backer)]

<a href="https://opencollective.com/react-dropzone/backer/0/website" target="_blank"><img src="https://opencollective.com/react-dropzone/backer/0/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/backer/1/website" target="_blank"><img src="https://opencollective.com/react-dropzone/backer/1/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/backer/2/website" target="_blank"><img src="https://opencollective.com/react-dropzone/backer/2/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/backer/3/website" target="_blank"><img src="https://opencollective.com/react-dropzone/backer/3/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/backer/4/website" target="_blank"><img src="https://opencollective.com/react-dropzone/backer/4/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/backer/5/website" target="_blank"><img src="https://opencollective.com/react-dropzone/backer/5/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/backer/6/website" target="_blank"><img src="https://opencollective.com/react-dropzone/backer/6/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/backer/7/website" target="_blank"><img src="https://opencollective.com/react-dropzone/backer/7/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/backer/8/website" target="_blank"><img src="https://opencollective.com/react-dropzone/backer/8/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/backer/9/website" target="_blank"><img src="https://opencollective.com/react-dropzone/backer/9/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/backer/10/website" target="_blank"><img src="https://opencollective.com/react-dropzone/backer/10/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/backer/11/website" target="_blank"><img src="https://opencollective.com/react-dropzone/backer/11/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/backer/12/website" target="_blank"><img src="https://opencollective.com/react-dropzone/backer/12/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/backer/13/website" target="_blank"><img src="https://opencollective.com/react-dropzone/backer/13/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/backer/14/website" target="_blank"><img src="https://opencollective.com/react-dropzone/backer/14/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/backer/15/website" target="_blank"><img src="https://opencollective.com/react-dropzone/backer/15/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/backer/16/website" target="_blank"><img src="https://opencollective.com/react-dropzone/backer/16/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/backer/17/website" target="_blank"><img src="https://opencollective.com/react-dropzone/backer/17/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/backer/18/website" target="_blank"><img src="https://opencollective.com/react-dropzone/backer/18/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/backer/19/website" target="_blank"><img src="https://opencollective.com/react-dropzone/backer/19/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/backer/20/website" target="_blank"><img src="https://opencollective.com/react-dropzone/backer/20/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/backer/21/website" target="_blank"><img src="https://opencollective.com/react-dropzone/backer/21/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/backer/22/website" target="_blank"><img src="https://opencollective.com/react-dropzone/backer/22/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/backer/23/website" target="_blank"><img src="https://opencollective.com/react-dropzone/backer/23/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/backer/24/website" target="_blank"><img src="https://opencollective.com/react-dropzone/backer/24/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/backer/25/website" target="_blank"><img src="https://opencollective.com/react-dropzone/backer/25/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/backer/26/website" target="_blank"><img src="https://opencollective.com/react-dropzone/backer/26/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/backer/27/website" target="_blank"><img src="https://opencollective.com/react-dropzone/backer/27/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/backer/28/website" target="_blank"><img src="https://opencollective.com/react-dropzone/backer/28/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/backer/29/website" target="_blank"><img src="https://opencollective.com/react-dropzone/backer/29/avatar.svg"></a>


### Sponsors
Become a sponsor and get your logo on our README on Github with a link to your site. [[Become a sponsor](https://opencollective.com/react-dropzone#sponsor)]

<a href="https://opencollective.com/react-dropzone/sponsor/0/website" target="_blank"><img src="https://opencollective.com/react-dropzone/sponsor/0/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/sponsor/1/website" target="_blank"><img src="https://opencollective.com/react-dropzone/sponsor/1/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/sponsor/2/website" target="_blank"><img src="https://opencollective.com/react-dropzone/sponsor/2/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/sponsor/3/website" target="_blank"><img src="https://opencollective.com/react-dropzone/sponsor/3/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/sponsor/4/website" target="_blank"><img src="https://opencollective.com/react-dropzone/sponsor/4/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/sponsor/5/website" target="_blank"><img src="https://opencollective.com/react-dropzone/sponsor/5/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/sponsor/6/website" target="_blank"><img src="https://opencollective.com/react-dropzone/sponsor/6/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/sponsor/7/website" target="_blank"><img src="https://opencollective.com/react-dropzone/sponsor/7/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/sponsor/8/website" target="_blank"><img src="https://opencollective.com/react-dropzone/sponsor/8/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/sponsor/9/website" target="_blank"><img src="https://opencollective.com/react-dropzone/sponsor/9/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/sponsor/10/website" target="_blank"><img src="https://opencollective.com/react-dropzone/sponsor/10/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/sponsor/11/website" target="_blank"><img src="https://opencollective.com/react-dropzone/sponsor/11/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/sponsor/12/website" target="_blank"><img src="https://opencollective.com/react-dropzone/sponsor/12/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/sponsor/13/website" target="_blank"><img src="https://opencollective.com/react-dropzone/sponsor/13/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/sponsor/14/website" target="_blank"><img src="https://opencollective.com/react-dropzone/sponsor/14/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/sponsor/15/website" target="_blank"><img src="https://opencollective.com/react-dropzone/sponsor/15/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/sponsor/16/website" target="_blank"><img src="https://opencollective.com/react-dropzone/sponsor/16/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/sponsor/17/website" target="_blank"><img src="https://opencollective.com/react-dropzone/sponsor/17/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/sponsor/18/website" target="_blank"><img src="https://opencollective.com/react-dropzone/sponsor/18/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/sponsor/19/website" target="_blank"><img src="https://opencollective.com/react-dropzone/sponsor/19/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/sponsor/20/website" target="_blank"><img src="https://opencollective.com/react-dropzone/sponsor/20/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/sponsor/21/website" target="_blank"><img src="https://opencollective.com/react-dropzone/sponsor/21/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/sponsor/22/website" target="_blank"><img src="https://opencollective.com/react-dropzone/sponsor/22/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/sponsor/23/website" target="_blank"><img src="https://opencollective.com/react-dropzone/sponsor/23/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/sponsor/24/website" target="_blank"><img src="https://opencollective.com/react-dropzone/sponsor/24/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/sponsor/25/website" target="_blank"><img src="https://opencollective.com/react-dropzone/sponsor/25/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/sponsor/26/website" target="_blank"><img src="https://opencollective.com/react-dropzone/sponsor/26/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/sponsor/27/website" target="_blank"><img src="https://opencollective.com/react-dropzone/sponsor/27/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/sponsor/28/website" target="_blank"><img src="https://opencollective.com/react-dropzone/sponsor/28/avatar.svg"></a>
<a href="https://opencollective.com/react-dropzone/sponsor/29/website" target="_blank"><img src="https://opencollective.com/react-dropzone/sponsor/29/avatar.svg"></a>

## License

MIT
