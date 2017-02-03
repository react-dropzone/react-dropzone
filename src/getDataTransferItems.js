/* @flow */
export default function getDataTransferFiles(event: SyntheticDragEvent, isMultipleAllowed: boolean = true): Array<File> { // eslint-disable-line max-len
  let dataTransferItemsList: Array<File> = [];
  if (event.dataTransfer) {
    const dt: DataTransfer = event.dataTransfer;
    if (dt.files && dt.files.length) {
      dataTransferItemsList = Array.prototype.slice.call(dt.files);
    } else if (dt.items && dt.items.length) {
      // During the drag even the dataTransfer.files is null
      // but Chrome implements some drag store, which is accesible via dataTransfer.items
      // Convert from DataTransferItemsList to the native Array
      dataTransferItemsList = Array.prototype.slice.call(dt.items);
    }
  } else if (event.target && event.target.files) {
    dataTransferItemsList = Array.prototype.slice.call(event.target.files);
  }

  if (dataTransferItemsList.length > 0) {
    dataTransferItemsList = isMultipleAllowed ? dataTransferItemsList : [dataTransferItemsList[0]];
  }

  return dataTransferItemsList;
}
