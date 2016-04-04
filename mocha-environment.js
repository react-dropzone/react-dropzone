// import es6
require('babel-core/register');

// jsdom
var jsdom = require('jsdom'); // eslint-disable-line

global.document = jsdom.jsdom('<!doctype html><html><body></body></html>');
global.window = global.document.defaultView;
global.navigator = global.window.navigator;

global.window.URL = {
  createObjectURL: function (arg) { // eslint-disable-line
    return 'data://' + arg.name;
  }
};
global.window.addEventListener('load', function () {
  console.log('JSDOM Loaded'); // eslint-disable-line
});
