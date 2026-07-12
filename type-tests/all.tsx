import Dropzone from "../src";

export const all = (
  <Dropzone
    onDrop={(acceptedFiles, fileRejections, event) => console.log(acceptedFiles, fileRejections, event)}
    onDragEnter={event => console.log(event)}
    onDragOver={event => console.log(event)}
    onDragLeave={event => console.log(event)}
    onDropAccepted={(files, event) => console.log(files, event)}
    onDropRejected={(files, event) => console.log(files, event)}
    onFileDialogCancel={() => console.log("onFileDialogCancel invoked")}
    onFileDialogOpen={() => console.log("onFileDialogOpen invoked")}
    onError={e => console.log(e)}
    validator={f => ({message: f.name, code: ""})}
    minSize={2000}
    maxSize={Number.POSITIVE_INFINITY}
    maxFiles={100}
    preventDropOnDocument
    noClick={false}
    noKeyboard={false}
    noDrag={false}
    noDragEventsBubbling={false}
    disabled
    multiple={false}
    accept={{"image/*": [".png"]}}
    useFsAccessApi={false}
    autoFocus
  >
    {({getRootProps, getInputProps}) => (
      <div {...getRootProps()}>
        <input {...getInputProps()} />
      </div>
    )}
  </Dropzone>
);
