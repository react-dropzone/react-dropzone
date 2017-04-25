By providing `accept`  prop you can make Dropzone to accept specifi file types and reject the others.

The value must be a comma-separated list of unique content type specifiers:
* A file extension starting with the STOP character (U+002E). (e.g. .jpg, .png, .doc).
* A valid MIME type with no extensions.
* audio/* representing sound files.
* video/* representing video files.
* image/* representing image files.

For more information see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Input

```
class Accept extends React.Component {
  constructor() {
    super()
    this.state = {
      accepted: [],
      rejected: []
    }
  }

  render() {
    return (
      <section>
        <div className="dropzone">
          <Dropzone
            accept="image/jpeg, image/png"
            onDrop={(accepted, rejected) => { this.setState({ accepted, rejected }); }}
          >
            <p>Try dropping some files here, or click to select files to upload.</p>
            <p>Only *.jpeg and *.png images will be accepted</p>
          </Dropzone>
        </div>
        <aside>
          <h2>Accepted files</h2>
          <ul>
            {
              this.state.accepted.map(f => <li key={f.name}>{f.name} - {f.size} bytes</li>)
            }
          </ul>
          <h2>Rejected files</h2>
          <ul>
            {
              this.state.rejected.map(f => <li key={f.name}>{f.name} - {f.size} bytes</li>)
            }
          </ul>
        </aside>
      </section>
    );
  }
}

<Accept />
```

### Warning
Keep in mind that mime type determination is not reliable accross platforms. CSV files, for example, are reported as text/plain under macOS but as application/vnd.ms-excel under Windows. In some cases there might not be a mime type set at all.

