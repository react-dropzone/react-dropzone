```
class DropzoneDemo extends React.Component {
  constructor() {
    super()
    this.state = {
      files: []
    }
    this.onDrop = this.onDrop.bind(this)
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
          <Dropzone onDrop={this.onDrop}>
            <p>Try dropping some files here, or click to select files to upload.</p>
          </Dropzone>
        </div>
        <aside>
          <h2>Dropped files</h2>
          <ul>
            {
              this.state.files.map(f => <li>{f.name} - {f.size} bytes</li>)
            }
          </ul>
        </aside>
      </section>
    );
  }
};

<DropzoneDemo />
```
