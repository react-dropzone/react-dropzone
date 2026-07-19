import type {FileError, ValidatorResult} from "../src";
import Dropzone, {useDropzone} from "../src";

// A synchronous validator still compiles.
export const syncValidator = (
  <Dropzone validator={f => (f.name.endsWith(".csv") ? null : {code: "nope", message: "not a csv"})}>
    {({getRootProps}) => <div {...getRootProps()} />}
  </Dropzone>
);

// An async validator (returning a Promise) compiles.
export const asyncValidator = (
  <Dropzone
    validator={async f => {
      const errors: FileError[] = [];
      if (f.size === 0) errors.push({code: "empty", message: "empty file"});
      return errors.length > 0 ? errors : null;
    }}
  >
    {({getRootProps}) => <div {...getRootProps()} />}
  </Dropzone>
);

// The ValidatorResult type is exported and usable by consumers wrapping the validator.
const wrapped = (fn: (f: File) => ValidatorResult | Promise<ValidatorResult>) => fn;
export const wrappedValidator = wrapped(async () => null);

// isProcessing is exposed on the hook state as a boolean.
export const ProcessingState = () => {
  const {isProcessing} = useDropzone({validator: async () => null});
  const flag: boolean = isProcessing;
  return <span>{String(flag)}</span>;
};
