Dropzone that accepts folders as drag-and-drop. Supports multiple folders and subfolders.

```jsx harmony
const {fromEvent} = require('file-selector')

class Folders extends React.Component {
  constructor() {
    super()
    this.state = {
      files: []
    }
  }

  onDrop(files) {
    this.setState({files})
  }

  render() {
    const files = this.state.files.map(f => (
      <li key={f.name}>
        {f.path} - {f.size} bytes
      </li>
    ))
    return (
      <section>
        <div>
          <Dropzone
            getDataTransferItems={evt => fromEvent(evt)}
            onDrop={this.onDrop.bind(this)}
          >
            {({getRootProps, getInputProps}) => (
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                  <p>Drop a folder with files here</p>
              </div>
            )}
          </Dropzone>
        </div>
        <aside>
          <h4>Files</h4>
          <ul>{files}</ul>
        </aside>
      </section>
    )
  }
}

<Folders />
```
