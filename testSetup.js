/* eslint prefer-template: 0 */
/* eslint node/no-unpublished-require: 0 */

require('jest-enzyme')

global.window.URL = {
  createObjectURL: function createObjectURL(arg) {
    return 'data://' + arg.name
  }
}
