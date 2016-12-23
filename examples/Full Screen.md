This example shows how to wrap the whole app into the dropzone.

```
class DropzoneDemo extends React.Component {
  constructor() {
    super()
    this.state = {
      files: [],
      dropzoneActive: false
    }
    this.onDrop = this.onDrop.bind(this)
    this.onDragEnter = this.onDragEnter.bind(this)
    this.onDragLeave = this.onDragLeave.bind(this)
  }
  
  onDragEnter() {
    this.setState({
      dropzoneActive: true
    })
  }
  
  onDragLeave() {
    this.setState({
      dropzoneActive: false
    })
  }
  
  onDrop(files) {
    this.setState({
      files,
      dropzoneActive: false
    })
  }

  render() {
    const { files, dropzoneActive } = this.state
    const style = {
      position: 'relative'
    }
    const overlayStyle = {
      position: 'absolute',
      top: 0,
      left: 0,
      padding: '2.5em 0',
      width: '100%',
      height: '100%',
      background: 'rgba(0,0,0,0.5)',
      textAlign: 'center',
      color: '#fff'
    }
    return (
      <Dropzone
        disableClick
        style={style}
        onDrop={this.onDrop}
        onDragEnter={this.onDragEnter}
        onDragLeave={this.onDragLeave}        
      >
        { dropzoneActive && <p style={overlayStyle}>Drop files...</p> }
        <section>
          <aside>
            <h1>My awesome app</h1>
            <h2>Dropped files</h2>
            <ul>
              {
                files.map(f => <li>{f.name} - {f.size} bytes</li>)
              }
            </ul>
          </aside>
        </section>
      </Dropzone>
    )
  }
}

<DropzoneDemo />
```
