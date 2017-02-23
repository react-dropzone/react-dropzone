import React from 'react';

export default class FilesizeValidation extends React.Component {
  constructor() {
    super();
    this.state = {
      files: []
    };
    this.onDropAccepted = this.onDropAccepted.bind(this);
    this.onDropRejected = this.onDropRejected.bind(this);
  }

  onDropAccepted(files) {
    this.setState({
      files,
      showError: false
    });
  }

  onDropRejected() {
    this.setState({
      showError: true
    });
  }

  render() {
    return (
      <section>
        <div className="dropzone">
          {
            this.state.showError && <p>File is bigger than 10KB</p>
          }
          <Dropzone
            onDropAccepted={this.onDropAccepted}
            onDropRejected={this.onDropRejected}
            maxSize={10 * 1024}
          >
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
