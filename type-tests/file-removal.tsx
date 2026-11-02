import Dropzone, {useDropzone} from "../src";

export function FileRemoval() {
  const {acceptedFiles, removeFile, clearFiles} = useDropzone();
  function handleRemove() {
    acceptedFiles.forEach(removeFile);
    clearFiles();
    // @ts-expect-error Removal takes a File object, not a file name.
    removeFile("match.mp4");
    // @ts-expect-error Removal requires a file.
    removeFile();
  }
  return (
    <button type="button" onClick={handleRemove}>
      Remove files
    </button>
  );
}

export const renderPropRemoval = (
  <Dropzone>
    {({acceptedFiles, removeFile, clearFiles}) => (
      <div>
        {acceptedFiles.map((file, index) => (
          <button type="button" key={index} onClick={() => removeFile(file)}>
            Remove {file.name}
          </button>
        ))}
        <button type="button" onClick={clearFiles}>
          Clear files
        </button>
      </div>
    )}
  </Dropzone>
);
