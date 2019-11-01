import * as React from "react";

export { FileWithPath } from "file-selector";
export default function Dropzone(props: DropzoneProps & React.RefAttributes<DropzoneRef>): JSX.Element;
export function useDropzone(options?: DropzoneOptions): DropzoneState;

export interface DropzoneProps extends DropzoneOptions {
  children?(state: DropzoneState): JSX.Element;
}

export type DropzoneOptions = Pick<React.HTMLProps<HTMLElement>, PropTypes> & {
  accept?: string | string[];
  minSize?: number;
  maxSize?: number;
  preventDropOnDocument?: boolean;
  noClick?: boolean;
  noKeyboard?: boolean;
  noDrag?: boolean;
  noDragEventsBubbling?: boolean;
  disabled?: boolean;
  onDrop?<T extends File>(acceptedFiles: T[], rejectFilesError: DropzoneFileError<T>[], event: DropEvent): void;
  onDropAccepted?<T extends File>(files: T[], event: DropEvent): void;
  onDropRejected?<T extends File>(rejectFilesError: DropzoneFileError<T>[], event: DropEvent): void;
  getFilesFromEvent?(event: DropEvent): Promise<Array<File | DataTransferItem>>;
  onFileDialogCancel?(): void;
};

export type DropEvent = React.DragEvent<HTMLElement> | React.ChangeEvent<HTMLInputElement> | DragEvent | Event;

export type DropzoneState = DropzoneRef & {
  isFocused: boolean;
  isDragActive: boolean;
  isDragAccept: boolean;
  isDragReject: boolean;
  isFileDialogActive: boolean;
  draggedFiles: File[];
  acceptedFiles: File[];
  rejectedFiles: File[];
  rootRef: React.RefObject<HTMLElement>;
  inputRef: React.RefObject<HTMLInputElement>;
  getRootProps(props?: DropzoneRootProps): DropzoneRootProps;
  getInputProps(props?: DropzoneInputProps): DropzoneInputProps;
};

export interface DropzoneRef {
  open(): void;
}

export interface DropzoneRootProps extends React.HTMLAttributes<HTMLElement> {
  refKey?: string;
  [key: string]: any;
}

export interface DropzoneInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  refKey?: string;
}

interface DropzoneFileError<T extends File> extends Error {
  message: DropzoneRejectReason;
  file: T;
}

type DropzoneRejectReason = "MIME_TYPE_NOT_MATCH" | "FILE_SIZE_EXCEED" | "SINGLE_FILE_ACCEPT";

type PropTypes = "multiple" | "onDragEnter" | "onDragOver" | "onDragLeave";
