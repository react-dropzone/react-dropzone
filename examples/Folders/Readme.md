Dropzone that accepts folders as drag-and-drop. Supports multiple folders and subfolders.

```jsx harmony
const { fromEvent } = require('file-selector')

class FolderDropzone extends React.Component {
  constructor() {
    super()
    this.state = { files: [] }
  }

  onDrop(files) {
    this.setState({
      files
    })
  }

  render() {
    return (
      <section>
        <div className="dropzone">
          <Dropzone
            getDataTransferItems={evt => fromEvent(evt)}
            onDrop={this.onDrop.bind(this)}
          >
            <p>Drop a folder with files here.</p>
          </Dropzone>
        </div>
        <aside>
          <h2>Dropped files and folders</h2>
          <ul>
            {this.state.files.map(f => (
              <li key={f.name}>
                {f.path} - {f.size} bytes
              </li>
            ))}
          </ul>
        </aside>
      </section>
    )
  }
}

<FolderDropzone />
```
