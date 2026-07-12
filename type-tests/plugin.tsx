import Dropzone from "../src";
import type {DropEvent} from "../src";

// A custom file aggregator receives the full DropEvent union and narrows internally.
const fromDragEvent = async (event: DropEvent): Promise<File[]> => {
  const dt = (event as DragEvent).dataTransfer;
  return dt ? Array.from(dt.files) : [];
};

const fromDataTransferItems = async (event: DropEvent): Promise<DataTransferItem[]> => {
  const dt = (event as DragEvent).dataTransfer;
  return dt ? Array.from(dt.items) : [];
};

export const filesPlugin = (
  <Dropzone getFilesFromEvent={fromDragEvent}>{({getRootProps}) => <div {...getRootProps()} />}</Dropzone>
);

export const itemsPlugin = (
  <Dropzone getFilesFromEvent={fromDataTransferItems}>{({getRootProps}) => <div {...getRootProps()} />}</Dropzone>
);
