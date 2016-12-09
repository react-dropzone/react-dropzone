/* eslint prefer-template: 0 */

global.window.URL = {
  createObjectURL: function createObjectURL(arg) {
    return 'data://' + arg.name;
  }
};
