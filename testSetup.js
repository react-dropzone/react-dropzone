/* eslint prefer-template: 0 */

global.window.URL = {
  createObjectURL: function createObjectURL(arg) {
    return 'data://' + arg.name;
  }
};

global.window.DataTransferItem = function DataTransferItem(arg) {
  this.kind = arg.kind;
  this.type = arg.type;
};
