import type {FileWithPath} from "file-selector";
import React from "react";
import Dropzone, {type FileRejection} from "../src";

interface State {
  accepted: readonly FileWithPath[];
  rejected: readonly FileRejection[];
}

export default class Accept extends React.Component<Record<string, never>, State> {
  state: State = {accepted: [], rejected: []};

  render() {
    return (
      <section>
        <div className="dropzone">
          <Dropzone
            accept={{"image/*": [".jpeg", ".png"]}}
            onDrop={(accepted, rejected) => {
              this.setState({accepted, rejected});
            }}
          >
            {({getRootProps}) => (
              <div {...getRootProps()}>
                <p>Try dropping some files here, or click to select files to upload.</p>
                <p>Only *.jpeg and *.png images will be accepted</p>
              </div>
            )}
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
            {this.state.rejected.map(({file}) => (
              <li key={file.name}>
                {file.name} - {file.size} bytes
              </li>
            ))}
          </ul>
        </aside>
      </section>
    );
  }
}
