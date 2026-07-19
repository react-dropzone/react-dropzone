import type {DropzoneProps} from "../src";
import {useDropzone} from "../src";

export const HookDropzone = ({children, ...opts}: DropzoneProps) => {
  const state = useDropzone(opts);
  return children?.(state) ?? null;
};

export const hookExample = (
  <HookDropzone>
    {({getRootProps, getInputProps}) => (
      <div {...getRootProps()}>
        <input {...getInputProps()} />
      </div>
    )}
  </HookDropzone>
);

// getInputProps accepts the webkitdirectory attribute for directory selection (#1344).
export const directoryExample = (
  <HookDropzone>
    {({getRootProps, getInputProps}) => (
      <div {...getRootProps()}>
        <input {...getInputProps({webkitdirectory: "true"})} />
      </div>
    )}
  </HookDropzone>
);
