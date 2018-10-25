import React from "react";
import Dropzone from "../../";

class Test extends React.Component {
  dz: Dropzone;

  open() {
    this.dz.open();
  }

  handleFileDialog = () => {};

  render() {
    return (
      <div>
        <Dropzone
          ref={node => {
            this.dz = node;
          }}
          onClick={event => console.log(event)}
          onDrop={(acceptedFiles, rejectedFiles, event) =>
            console.log(acceptedFiles, rejectedFiles, event)}
          onDragStart={event => console.log(event)}
          onDragEnter={event => console.log(event)}
          onDragOver={event => console.log(event)}
          onDragLeave={event => console.log(event)}
          onDropAccepted={event => console.log(event)}
          onDropRejected={event => console.log(event)}
          onFileDialogCancel={() => console.log("abc")}
          style={{ borderStyle: "dashed" }}
          activeStyle={{ borderStyle: "dotted" }}
          acceptStyle={{ borderStyle: "dotted" }}
          rejectStyle={{ borderStyle: "dotted" }}
          disabledStyle={{ borderStyle: "dotted" }}
          className="regular"
          activeClassName="active"
          acceptClassName="accept"
          rejectClassName="reject"
          disabledClassName="disabled"
          minSize={2000}
          maxSize={Infinity}
          preventDropOnDocument
          disableClick
          disabled
          multiple={false}
          accept="*.png"
          name="dropzone"
          inputProps={{ id: "dropzone" }}
        >
          Hi
        </Dropzone>
      </div>
    );
  }
}

export default Test;
