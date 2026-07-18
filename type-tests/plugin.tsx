import Dropzone from "../src";
import type {DropEvent} from "../src";

// A custom file aggregator receives the full input union (a DropEvent or a
// FileSystemFileHandle array) and narrows internally.
const fromDragEvent = async (event: DropEvent | Array<FileSystemFileHandle>): Promise<File[]> => {
  if (Array.isArray(event)) {
    return [];
  }
  const dt = (event as DragEvent).dataTransfer;
  return dt ? Array.from(dt.files) : [];
};

const fromDataTransferItems = async (event: DropEvent | Array<FileSystemFileHandle>): Promise<DataTransferItem[]> => {
  if (Array.isArray(event)) {
    return [];
  }
  const dt = (event as DragEvent).dataTransfer;
  return dt ? Array.from(dt.items) : [];
};

export const filesPlugin = (
  <Dropzone getFilesFromEvent={fromDragEvent}>{({getRootProps}) => <div {...getRootProps()} />}</Dropzone>
);

export const itemsPlugin = (
  <Dropzone getFilesFromEvent={fromDataTransferItems}>{({getRootProps}) => <div {...getRootProps()} />}</Dropzone>
);
