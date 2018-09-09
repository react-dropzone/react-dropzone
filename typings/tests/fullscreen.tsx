import * as React from "react";

import Dropzone from "../../";

class FullScreen extends React.Component {
  state = {
    accept: "",
    files: [],
    dropzoneActive: false
  };

  onDragEnter() {
    this.setState({
      dropzoneActive: true
    });
  }

  onDragLeave() {
    this.setState({
      dropzoneActive: false
    });
  }

  onDrop(files) {
    this.setState({
      files,
      dropzoneActive: false
    });
  }

  applyMimeTypes(event) {
    this.setState({
      accept: event.target.value
    });
  }

  render() {
    const { accept, files, dropzoneActive } = this.state;

    return (
      <Dropzone
        disableClick
        style={{ position: "relative" }}
        accept={accept}
        onDrop={this.onDrop.bind(this)}
        onDragEnter={this.onDragEnter.bind(this)}
        onDragLeave={this.onDragLeave.bind(this)}
      >
        {dropzoneActive && (
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              padding: "2.5em 0",
              background: "rgba(0,0,0,0.5)",
              textAlign: "center",
              color: "#fff"
            }}
          >
            Drop files...
          </div>
        )}
        <div>
          <h1>My awesome app</h1>
          <label htmlFor="mimetypes">
            Enter mime types you want to accept:{" "}
          </label>
          <input
            type="text"
            id="mimetypes"
            onChange={this.applyMimeTypes.bind(this)}
          />

          <h2>Dropped files</h2>
          <ul>
            {files.map(f => (
              <li>
                {f.name} - {f.size} bytes
              </li>
            ))}
          </ul>
        </div>
      </Dropzone>
    );
  }
}
