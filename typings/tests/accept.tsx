import React from "react";
import Dropzone from "../../";

class Accept extends React.Component {
  state = {
    accepted: [],
    rejected: []
  };

  render() {
    return (
      <section>
        <div className="dropzone">
          <Dropzone
            accept="image/jpeg, image/png"
            onDrop={(accepted, rejected) => {
              this.setState({ accepted, rejected });
            }}
          >
            <p>
              Try dropping some files here, or click to select files to upload.
            </p>
            <p>Only *.jpeg and *.png images will be accepted</p>
          </Dropzone>
        </div>
        <aside>
          <h2>Accepted files</h2>
          <ul>
            {this.state.accepted.map(f => (
              <li key={f.name}>
                {f.name} - {f.size} bytes
              </li>
            ))}
          </ul>
          <h2>Rejected files</h2>
          <ul>
            {this.state.rejected.map(f => (
              <li key={f.name}>
                {f.name} - {f.size} bytes
              </li>
            ))}
          </ul>
        </aside>
      </section>
    );
  }
}

const a = (
  <Dropzone accept=".jpeg,.png">
    {({ isDragActive, isDragReject }) => {
      if (isDragActive) {
        return "All files will be accepted";
      }
      if (isDragReject) {
        return "Some files will be rejected";
      }
      return "Dropping some files here...";
    }}
  </Dropzone>
);

const b = (
  <Dropzone accept="image/jpeg, image/png">
    {({ isDragActive, isDragReject }) => {
      if (isDragActive) {
        return "All files will be accepted";
      }
      if (isDragReject) {
        return "Some files will be rejected";
      }
      return "Dropping some files here...";
    }}
  </Dropzone>
);
