/* eslint prefer-template: 0 */
import 'jest-enzyme';

global.window.URL = {
  createObjectURL: function createObjectURL(arg) {
    return 'data://' + arg.name;
  }
};
