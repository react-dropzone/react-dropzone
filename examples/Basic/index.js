import React from 'react';

export default class Basic extends React.Component {

  state = { files: [] }

  render() {
    return (
      <section>
        <div className="dropzone">
          <Dropzone onDrop={(files) => { this.setState({ files }); }}>
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
