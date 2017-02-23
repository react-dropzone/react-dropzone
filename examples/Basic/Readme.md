This example shows Dropzone with default properties and displays list of the dropped files.

```
 <Basic />
```

```jsx
import React from 'react';

export default class Basic extends React.Component {

  state = { files: [] }

  onDrop = (files) => {
    this.setState({
      files
    });
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
}

```
