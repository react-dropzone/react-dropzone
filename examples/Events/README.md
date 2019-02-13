If you'd like to prevent the default behaviour for `onClick`, `onFocus`, `onBlur` and `onKeyDown`, use the `preventDefault()` fn on the event:

```jsx harmony
class Events extends React.Component {
  onClick(evt) {
    evt.preventDefault();
  }

  render() {
    return (
      <Dropzone
        onClick={this.onClick.bind(this)}
      >
        {({getRootProps, getInputProps}) => (
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            <p>Click to select files should not work!</p>
          </div>
        )}
      </Dropzone>
    );
  }
}

<Events />
```

**NOTE**: You can still use the `{disableClick}` prop to achieve the same behaviour,
but it has been deprecated and will be removed with the next major version.
