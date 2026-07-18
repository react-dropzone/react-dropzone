import React from "react";
import Dropzone from "../src";

const onDrop: NonNullable<React.ComponentProps<typeof Dropzone>["onDrop"]> = (acceptedFiles, fileRejections, event) => {
  console.log(acceptedFiles, fileRejections);
  event.preventDefault();
  event.stopPropagation();
  console.log(event.type);
};

export const events = (
  <Dropzone
    onDrop={onDrop}
    onDragEnter={event => console.log(event)}
    onDragOver={event => console.log(event)}
    onDragLeave={event => console.log(event)}
    getFilesFromEvent={event => {
      if (Array.isArray(event)) {
        console.log(event[0]);
      } else {
        event.preventDefault();
      }
      return Promise.resolve([]);
    }}
  >
    {({getRootProps, getInputProps}) => (
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        <p>Try dropping some files here, or click to select files to upload.</p>
      </div>
    )}
  </Dropzone>
);
