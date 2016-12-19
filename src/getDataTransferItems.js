export default function getDataTransferFiles(event, isMultipleAllowed = true) {
  let dataTransferItemsList = [];
  if (event.hasOwnProperty('dataTransfer')) {
    const dt = event.dataTransfer;
    if (dt.hasOwnProperty('files')) {
      dataTransferItemsList = dt.files;
    } else if (dt.hasOwnProperty('items')) {
      // During the drag even the dataTransfer.files is null
      // but Chrome implements some drag store, which is accesible via dataTransfer.items
      dataTransferItemsList = dt.items;
    }
  } else if (event.hasOwnProperty('target')) {
    dataTransferItemsList = event.target.files;
  }

  if (dataTransferItemsList.length > 0) {
    dataTransferItemsList = isMultipleAllowed ? dataTransferItemsList : [dataTransferItemsList[0]];
  }

  // Convert from DataTransferItemsList to the native Array
  return Array.prototype.slice.call(dataTransferItemsList);
}
