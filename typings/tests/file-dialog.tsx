import React from "react";
import Dropzone from "../../";

let dropzoneRef;

const x = (
  <div>
    <Dropzone
      ref={node => {
        dropzoneRef = node;
      }}
      onDrop={(accepted, rejected) => {
        alert(accepted);
      }}
    >
      <p>Drop files here.</p>
    </Dropzone>
    <button
      type="button"
      onClick={() => {
        dropzoneRef.open();
      }}
    >
      Open File Dialog
    </button>
  </div>
);
