import React from "react";
import Dropzone, {type FileRejection} from "../src";

interface State {
  accepted: readonly File[];
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
        <div className="dropzone">
          {/* The grouped form: an array of {description, accept} entries for the FS Access
              picker. `description` is optional, and an extension value may be a bare string. */}
          <Dropzone
            useFsAccessApi
            accept={[
              {description: "Images", accept: {"image/jpeg": [".jpg", ".jpeg"], "image/png": []}},
              {accept: {"application/pdf": ".pdf"}}
            ]}
            onDrop={(accepted, rejected) => {
              this.setState({accepted, rejected});
            }}
          >
            {({getRootProps}) => (
              <div {...getRootProps()}>
                <p>Try dropping some files here, or click to select files to upload.</p>
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
