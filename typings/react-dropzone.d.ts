import {
  CSSProperties,
  Component,
  DragEvent,
  InputHTMLAttributes
} from "react";

export interface FileWithPreview extends File {
  preview?: string;
}

export type DropFileEventHandler = (
  acceptedOrRejected: FileWithPreview[],
  event: DragEvent<HTMLDivElement>
) => void;
export type DropFilesEventHandler = (
  accepted: FileWithPreview[],
  rejected: FileWithPreview[],
  event: DragEvent<HTMLDivElement>
) => void;

type DropzoneRenderArgs = {
  draggedFiles: FileWithPreview[];
  acceptedFiles: FileWithPreview[];
  rejectedFiles: FileWithPreview[];
  isDragActive: boolean;
  isDragAccept: boolean;
  isDragReject: boolean;
};

export type DropzoneRenderFunction = (x: DropzoneRenderArgs) => JSX.Element;

type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;

export type DropzoneProps = Omit<React.HTMLProps<HTMLDivElement>, "onDrop"> & {
  disableClick?: boolean;
  disabled?: boolean;
  disablePreview?: boolean;
  preventDropOnDocument?: boolean;
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
  maxSize?: number;
  minSize?: number;
  activeClassName?: string;
  acceptClassName?: string;
  rejectClassName?: string;
  disabledClassName?: string;
  activeStyle?: CSSProperties;
  acceptStyle?: CSSProperties;
  rejectStyle?: CSSProperties;
  disabledStyle?: CSSProperties;
  onDrop?: DropFilesEventHandler;
  onDropAccepted?: DropFileEventHandler;
  onDropRejected?: DropFileEventHandler;
  onFileDialogCancel?: () => void;
  children: React.ReactNode | DropzoneRenderFunction;
};

export default class Dropzone extends Component<DropzoneProps> {
  open: () => void;
}
