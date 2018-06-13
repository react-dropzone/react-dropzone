By default, Dropzone just renders provided children without applying any styles.  

This example renders a list of the dropped files.

```
class Basic extends React.Component {
  constructor(props) {
    super(props)
    this.state = { files: [] }
    this.onDrop = this.onDrop.bind(this)
  }
  
  onDrop(files) {
    this.setState({
      files
    });
  }

  render() {
    return (
      <section>
        <Dropzone onDrop={this.onDrop}>
          {({ getRootProps, getInputProps }) => (
            <div
              {...getRootProps()}
              className="dropzone"
            >
              <input {...getInputProps()} />
              <p>Try dropping some files here, or click to select files to upload.</p>
            </div>
          )}
        </Dropzone>
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
}

<Basic />
```
