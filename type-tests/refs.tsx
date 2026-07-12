import {createRef} from "react";
import Dropzone from "../src";
import type {DropzoneRef} from "../src";

const ref = createRef<DropzoneRef>();

export const refExample = (
  <Dropzone ref={ref}>
    {({getRootProps, getInputProps}) => (
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        <p>Drop some files here.</p>
        <button type="button" onClick={() => ref.current?.open()}>
          Open file dialog
        </button>
      </div>
    )}
  </Dropzone>
);
