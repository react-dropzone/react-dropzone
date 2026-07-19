"use client";

import type {FileWithPath} from "file-selector";
import {Component, createElement, useCallback, useEffect, useMemo, useRef, useState} from "react";
import styled from "styled-components";
import Dropzone, {type DropzoneRef, useDropzone} from "../../src";
import "./dropzone.css";

/* ----------------------------- Basic ----------------------------- */

export function Basic() {
  const {acceptedFiles, getRootProps, getInputProps} = useDropzone();
  const files = acceptedFiles.map(file => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));
  return (
    <section className="container">
      <div {...getRootProps({className: "dropzone"})}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>
      <aside>
        <h4>Files</h4>
        <ul>{files}</ul>
      </aside>
    </section>
  );
}

export function DisabledDropzone() {
  const {acceptedFiles, getRootProps, getInputProps} = useDropzone({disabled: true});
  const files = acceptedFiles.map(file => (
    <li key={file.name}>
      {file.name} - {file.size} bytes
    </li>
  ));
  return (
    <section className="container">
      <div {...getRootProps({className: "dropzone disabled"})}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>
      <aside>
        <h4>Files</h4>
        <ul>{files}</ul>
      </aside>
    </section>
  );
}

/* ----------------------------- Directory ----------------------------- */

export function Directory() {
  const {acceptedFiles, getRootProps, getInputProps} = useDropzone();
  const files = acceptedFiles.map(file => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));
  return (
    <section className="container">
      <div {...getRootProps({className: "dropzone"})}>
        <input {...getInputProps({webkitdirectory: "true"})} />
        <p>Drag 'n' drop a folder here, or click to select a folder</p>
      </div>
      <aside>
        <h4>Files</h4>
        <ul>{files}</ul>
      </aside>
    </section>
  );
}

/* ----------------------------- Events ----------------------------- */

function InnerDropzone() {
  const {getRootProps} = useDropzone({noDragEventsBubbling: true});
  return (
    <div {...getRootProps({className: "dropzone"})}>
      <p>Inner dropzone</p>
    </div>
  );
}

export function OuterDropzone() {
  const {getRootProps} = useDropzone({onDrop: files => console.log(files)});
  return (
    <div className="container">
      <div {...getRootProps({className: "dropzone"})}>
        <InnerDropzone />
        <p>Outer dropzone</p>
      </div>
    </div>
  );
}

export function DropzoneWithoutClick() {
  const {getRootProps, getInputProps, acceptedFiles} = useDropzone({noClick: true});
  const files = acceptedFiles.map(file => <li key={file.path}>{file.path}</li>);
  return (
    <section className="container">
      <div {...getRootProps({className: "dropzone"})}>
        <input {...getInputProps()} />
        <p>Dropzone without click events</p>
      </div>
      <aside>
        <h4>Files</h4>
        <ul>{files}</ul>
      </aside>
    </section>
  );
}

export function DropzoneWithoutKeyboard() {
  const {getRootProps, getInputProps, acceptedFiles} = useDropzone({noKeyboard: true});
  const files = acceptedFiles.map(file => <li key={file.path}>{file.path}</li>);
  return (
    <section className="container">
      <div {...getRootProps({className: "dropzone"})}>
        <input {...getInputProps()} />
        <p>Dropzone without keyboard events</p>
        <em>(SPACE/ENTER and focus events are disabled)</em>
      </div>
      <aside>
        <h4>Files</h4>
        <ul>{files}</ul>
      </aside>
    </section>
  );
}

export function DropzoneWithoutDrag() {
  const {getRootProps, getInputProps, acceptedFiles} = useDropzone({noDrag: true});
  const files = acceptedFiles.map(file => <li key={file.path}>{file.path}</li>);
  return (
    <section className="container">
      <div {...getRootProps({className: "dropzone"})}>
        <input {...getInputProps()} />
        <p>Dropzone with no drag events</p>
        <em>(Drag 'n' drop is disabled)</em>
      </div>
      <aside>
        <h4>Files</h4>
        <ul>{files}</ul>
      </aside>
    </section>
  );
}

export function StopPropagation() {
  return (
    <Dropzone onDrop={files => console.log(files)}>
      {({getRootProps, getInputProps}) => (
        <div className="container">
          <div {...getRootProps({className: "dropzone", onDrop: event => event.stopPropagation()})}>
            <input {...getInputProps()} />
            <p>Drag 'n' drop some files here, or click to select files</p>
          </div>
        </div>
      )}
    </Dropzone>
  );
}

/* ----------------------------- Accept ----------------------------- */

export function Accept() {
  const {acceptedFiles, fileRejections, getRootProps, getInputProps} = useDropzone({
    accept: {"image/jpeg": [], "image/png": []}
  });
  const acceptedFileItems = acceptedFiles.map(file => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));
  const fileRejectionItems = fileRejections.map(({file, errors}) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
      <ul>
        {errors.map(e => (
          <li key={e.code}>{e.message}</li>
        ))}
      </ul>
    </li>
  ));
  return (
    <section className="container">
      <div {...getRootProps({className: "dropzone"})}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
        <em>(Only *.jpeg and *.png images will be accepted)</em>
      </div>
      <aside>
        <h4>Accepted files</h4>
        <ul>{acceptedFileItems}</ul>
        <h4>Rejected files</h4>
        <ul>{fileRejectionItems}</ul>
      </aside>
    </section>
  );
}

export function AcceptDuringDrag() {
  const {getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject} = useDropzone({
    accept: {"image/*": [".jpeg", ".png"]}
  });
  return (
    <div className="container">
      <div {...getRootProps({className: "dropzone"})}>
        <input {...getInputProps()} />
        {isDragAccept && <p>All files will be accepted</p>}
        {isDragReject && <p>Some files will be rejected</p>}
        {!isDragActive && <p>Drop some files here ...</p>}
      </div>
    </div>
  );
}

/* ----------------------------- Max files ----------------------------- */

export function AcceptMaxFiles() {
  const {acceptedFiles, fileRejections, getRootProps, getInputProps} = useDropzone({maxFiles: 2});
  const acceptedFileItems = acceptedFiles.map(file => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));
  const fileRejectionItems = fileRejections.map(({file, errors}) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
      <ul>
        {errors.map(e => (
          <li key={e.code}>{e.message}</li>
        ))}
      </ul>
    </li>
  ));
  return (
    <section className="container">
      <div {...getRootProps({className: "dropzone"})}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
        <em>(2 files are the maximum number of files you can drop here)</em>
      </div>
      <aside>
        <h4>Accepted files</h4>
        <ul>{acceptedFileItems}</ul>
        <h4>Rejected files</h4>
        <ul>{fileRejectionItems}</ul>
      </aside>
    </section>
  );
}

/* ----------------------------- Validator ----------------------------- */

const maxLength = 20;
function nameLengthValidator(file: File) {
  if (file.name.length > maxLength) {
    return {code: "name-too-large", message: `Name is larger than ${maxLength} characters`};
  }
  return null;
}

export function CustomValidation() {
  const {acceptedFiles, fileRejections, getRootProps, getInputProps} = useDropzone({
    validator: nameLengthValidator
  });
  const acceptedFileItems = acceptedFiles.map(file => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));
  const fileRejectionItems = fileRejections.map(({file, errors}) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
      <ul>
        {errors.map(e => (
          <li key={e.code}>{e.message}</li>
        ))}
      </ul>
    </li>
  ));
  return (
    <section className="container">
      <div {...getRootProps({className: "dropzone"})}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
        <em>(Only files with name less than 20 characters will be accepted)</em>
      </div>
      <aside>
        <h4>Accepted files</h4>
        <ul>{acceptedFileItems}</ul>
        <h4>Rejected files</h4>
        <ul>{fileRejectionItems}</ul>
      </aside>
    </section>
  );
}

/* ----------------------------- Styling ----------------------------- */

const baseStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column" as const,
  alignItems: "center",
  padding: "20px",
  borderWidth: 2,
  borderRadius: 2,
  borderColor: "var(--vocs-color-gray6)",
  borderStyle: "dashed",
  backgroundColor: "var(--vocs-color-background2)",
  color: "var(--vocs-color-gray10)",
  outline: "none",
  transition: "border .24s ease-in-out"
};
const focusedStyle = {borderColor: "var(--vocs-color-accent)"};
const acceptStyle = {borderColor: "var(--vocs-color-green)"};
const rejectStyle = {borderColor: "var(--vocs-color-red)"};

export function InlineStyledDropzone() {
  const {getRootProps, getInputProps, isFocused, isDragAccept, isDragReject} = useDropzone({
    accept: {"image/*": []}
  });
  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {})
    }),
    [isFocused, isDragAccept, isDragReject]
  );
  return (
    <div className="container">
      <div {...getRootProps({style})}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>
    </div>
  );
}

const getColor = (props: {isDragAccept?: boolean; isDragReject?: boolean; isFocused?: boolean}) => {
  if (props.isDragAccept) return "var(--vocs-color-green)";
  if (props.isDragReject) return "var(--vocs-color-red)";
  if (props.isFocused) return "var(--vocs-color-accent)";
  return "var(--vocs-color-gray6)";
};

const StyledContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-width: 2px;
  border-radius: 2px;
  border-color: ${props => getColor(props)};
  border-style: dashed;
  background-color: var(--vocs-color-background2);
  color: var(--vocs-color-gray10);
  outline: none;
  transition: border 0.24s ease-in-out;
`;

export function StyledComponentsDropzone() {
  const {getRootProps, getInputProps, isFocused, isDragAccept, isDragReject} = useDropzone({
    accept: {"image/*": []}
  });
  return (
    <div className="container">
      <StyledContainer {...getRootProps({isFocused, isDragAccept, isDragReject})}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </StyledContainer>
    </div>
  );
}

/* ----------------------------- Drag overlay ----------------------------- */

export function DragOverlay() {
  const {getRootProps, getInputProps, isDragGlobal, isDragActive, isDragAccept, isDragReject, acceptedFiles} =
    useDropzone({accept: {"image/*": [".png", ".jpg", ".jpeg", ".gif"]}});
  const files = acceptedFiles.map(file => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));
  return (
    // Scope the "global drag" overlay to the demo box (position: absolute in a relative
    // container) so it doesn't cover the whole docs page. In a real app you'd typically
    // use position: fixed to cover the viewport.
    <div style={{position: "relative", minHeight: 220}}>
      {isDragGlobal && !isDragActive && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "color-mix(in srgb, var(--vocs-color-accent) 12%, transparent)",
            border: "2px dashed var(--vocs-color-accent)",
            borderRadius: 8,
            pointerEvents: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1
          }}
        >
          <strong style={{color: "var(--vocs-color-accent)"}}>Drop files anywhere on the page…</strong>
        </div>
      )}
      <section className="container">
        <div
          {...getRootProps({
            className: "dropzone",
            style: {
              border: "2px dashed var(--vocs-color-gray6)",
              borderRadius: "8px",
              padding: "40px",
              textAlign: "center",
              backgroundColor: isDragAccept
                ? "color-mix(in srgb, var(--vocs-color-green) 12%, transparent)"
                : isDragReject
                  ? "color-mix(in srgb, var(--vocs-color-red) 12%, transparent)"
                  : "var(--vocs-color-background2)",
              transition: "all 0.2s"
            }
          })}
        >
          <input {...getInputProps()} />
          {isDragGlobal && !isDragActive && (
            <p style={{color: "var(--vocs-color-accent)", fontWeight: "bold"}}>🌐 Drag detected on page!</p>
          )}
          {isDragActive && !isDragAccept && !isDragReject && (
            <p style={{color: "var(--vocs-color-gray10)"}}>Drop files here...</p>
          )}
          {isDragAccept && (
            <p style={{color: "var(--vocs-color-green)", fontWeight: "bold"}}>✅ Drop to upload these files</p>
          )}
          {isDragReject && (
            <p style={{color: "var(--vocs-color-red)", fontWeight: "bold"}}>❌ Some files will be rejected</p>
          )}
          {!isDragGlobal && !isDragActive && <p>Drag 'n' drop images here, or click to select files</p>}
        </div>
        <aside>
          <h4>Accepted files</h4>
          <ul>{files}</ul>
        </aside>
      </section>
    </div>
  );
}

/* ----------------------------- File dialog ----------------------------- */

export function DropzoneWithButton() {
  const {getRootProps, getInputProps, open, acceptedFiles} = useDropzone({noClick: true, noKeyboard: true});
  const files = acceptedFiles.map(file => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));
  return (
    <div className="container">
      <div {...getRootProps({className: "dropzone"})}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here</p>
        <button type="button" onClick={open}>
          Open File Dialog
        </button>
      </div>
      <aside>
        <h4>Files</h4>
        <ul>{files}</ul>
      </aside>
    </div>
  );
}

export function RefDropzone() {
  const dropzoneRef = useRef<DropzoneRef>(null);
  const openDialog = () => {
    if (dropzoneRef.current) dropzoneRef.current.open();
  };
  return (
    <Dropzone ref={dropzoneRef} noClick noKeyboard>
      {({getRootProps, getInputProps, acceptedFiles}) => (
        <div className="container">
          <div {...getRootProps({className: "dropzone"})}>
            <input {...getInputProps()} />
            <p>Drag 'n' drop some files here</p>
            <button type="button" onClick={openDialog}>
              Open File Dialog
            </button>
          </div>
          <aside>
            <h4>Files</h4>
            <ul>
              {acceptedFiles.map(file => (
                <li key={file.path}>
                  {file.path} - {file.size} bytes
                </li>
              ))}
            </ul>
          </aside>
        </div>
      )}
    </Dropzone>
  );
}

/* ----------------------------- Forms ----------------------------- */

function DropzoneField({required, name}: {required?: boolean; name?: string}) {
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const {getRootProps, getInputProps, open, acceptedFiles} = useDropzone({
    onDrop: incomingFiles => {
      if (hiddenInputRef.current) {
        const dataTransfer = new DataTransfer();
        incomingFiles.forEach(v => dataTransfer.items.add(v));
        hiddenInputRef.current.files = dataTransfer.files;
      }
    }
  });
  const files = acceptedFiles.map(file => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));
  return (
    <div className="container">
      <div {...getRootProps({className: "dropzone"})}>
        <input type="file" name={name} required={required} style={{opacity: 0}} ref={hiddenInputRef} />
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here</p>
        <button type="button" onClick={open}>
          Open File Dialog
        </button>
      </div>
      <aside>
        <h4>Files</h4>
        <ul>{files}</ul>
      </aside>
    </div>
  );
}

export function FormExample() {
  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const file = formData.get("my-file") as File;
        alert(file.name);
      }}
    >
      <DropzoneField name="my-file" required />
      <button type="submit">Submit</button>
    </form>
  );
}

/* ----------------------------- Previews ----------------------------- */

const thumbsContainer = {display: "flex", flexDirection: "row" as const, flexWrap: "wrap" as const, marginTop: 16};
const thumb = {
  display: "inline-flex",
  borderRadius: 2,
  border: "1px solid #eaeaea",
  marginBottom: 8,
  marginRight: 8,
  width: 100,
  height: 100,
  padding: 4,
  boxSizing: "border-box" as const
};
const thumbInner = {display: "flex", minWidth: 0, overflow: "hidden"};
const imgStyle = {display: "block", width: "auto", height: "100%"};

export function Previews() {
  const [files, setFiles] = useState<Array<File & {preview: string}>>([]);
  const {getRootProps, getInputProps} = useDropzone({
    accept: {"image/*": []},
    onDrop: acceptedFiles => {
      setFiles(acceptedFiles.map(file => Object.assign(file, {preview: URL.createObjectURL(file)})));
    }
  });
  const thumbs = files.map(file => (
    <div style={thumb} key={file.name}>
      <div style={thumbInner}>
        <img src={file.preview} style={imgStyle} alt={file.name} onLoad={() => URL.revokeObjectURL(file.preview)} />
      </div>
    </div>
  ));
  useEffect(() => {
    return () => files.forEach(file => URL.revokeObjectURL(file.preview));
  }, [files]);
  return (
    <section className="container">
      <div {...getRootProps({className: "dropzone"})}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>
      <aside style={thumbsContainer}>{thumbs}</aside>
    </section>
  );
}

/* ----------------------------- Class component ----------------------------- */

interface ClassState {
  files: readonly FileWithPath[];
}

export class ClassComponentBasic extends Component<Record<string, never>, ClassState> {
  state: ClassState = {files: []};
  onDrop = (files: FileWithPath[]) => this.setState({files});

  render() {
    const files = this.state.files.map(file => (
      <li key={file.name}>
        {file.name} - {file.size} bytes
      </li>
    ));
    return (
      <Dropzone onDrop={this.onDrop}>
        {({getRootProps, getInputProps}) => (
          <section className="container">
            <div {...getRootProps({className: "dropzone"})}>
              <input {...getInputProps()} />
              <p>Drag 'n' drop some files here, or click to select files</p>
            </div>
            <aside>
              <h4>Files</h4>
              <ul>{files}</ul>
            </aside>
          </section>
        )}
      </Dropzone>
    );
  }
}

/* ----------------------------- No JSX ----------------------------- */

export function NoJsxBasic() {
  const [files, setFiles] = useState<File[]>([]);
  const onDrop = useCallback((files: File[]) => setFiles(files), [setFiles]);
  const {getRootProps, getInputProps} = useDropzone({onDrop});
  const e = createElement;
  const fileList = files.map(file => e("li", {key: file.name}, `${file.name} - ${file.size} bytes`));
  return e("section", {className: "container"}, [
    e("div", getRootProps({className: "dropzone", key: "dropzone"}), [
      e("input", getInputProps({key: "input"})),
      e("p", {key: "desc"}, "Drag 'n' drop some files here, or click to select files")
    ]),
    e("aside", {key: "filesContainer"}, [e("h4", {key: "title"}, "Files"), e("ul", {key: "fileList"}, fileList)])
  ]);
}

/* ----------------------------- Plugins ----------------------------- */

async function myCustomFileGetter(event: any) {
  const files = [];
  const fileList = event.dataTransfer ? event.dataTransfer.files : event.target.files;
  for (let i = 0; i < fileList.length; i++) {
    const file = fileList.item(i);
    Object.defineProperty(file, "myProp", {value: true});
    files.push(file);
  }
  return files;
}

export function Plugin() {
  const {acceptedFiles, getRootProps, getInputProps} = useDropzone({
    getFilesFromEvent: event => myCustomFileGetter(event)
  });
  const files = acceptedFiles.map((f: any) => (
    <li key={f.name}>
      {f.name} has <strong>myProp</strong>: {f.myProp === true ? "YES" : ""}
    </li>
  ));
  return (
    <section className="container">
      <div {...getRootProps({className: "dropzone"})}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>
      <aside>
        <h4>Files</h4>
        <ul>{files}</ul>
      </aside>
    </section>
  );
}
