Dropzone with default properties and displays list of the dropped files.

```jsx harmony
class Basic extends React.Component {
  constructor() {
    super()
    this.state = { files: [] }
  }

  onDrop(files) {
    this.setState({
      files
    });
  }

  onCancel() {
    this.setState({
      files: []
    });
  }

  render() {
    return (
      <section>
        <div className="dropzone">
          <Dropzone
            onDrop={this.onDrop.bind(this)}
            onFileDialogCancel={this.onCancel.bind(this)}
          >
            <p>Try dropping some files here, or click to select files to upload.</p>
          </Dropzone>
        </div>
        <aside>
          <h2>Dropped files</h2>
          <ul>
            {
              this.state.files.map(f => <li key={f.name}>{f.name} - {f.size} bytes</li>)
            }
          </ul>
        </aside>
      </section>
    );
  }
}

<Basic />
```

Dropzone with `disabled` property:

```jsx harmony
class Basic extends React.Component {
  constructor() {
    super()
    this.state = { disabled: true, files: [] }
  }

  onDrop(files) {
    this.setState({
      files
    });
  }

  render() {
    return (
      <section>
        <aside>
          <button type="button" onClick={() => this.setState({ disabled: !this.state.disabled })}>Toggle disabled</button>
        </aside>
        <div className="dropzone">
          <Dropzone onDrop={this.onDrop.bind(this)} disabled={this.state.disabled}>
            <p>Try dropping some files here, or click to select files to upload.</p>
          </Dropzone>
        </div>
        <aside>
          <h2>Dropped files</h2>
          <ul>
            {
              this.state.files.map(f => <li key={f.name}>{f.name} - {f.size} bytes</li>)
            }
          </ul>
        </aside>
      </section>
    );
  }
}

<Basic />
```
