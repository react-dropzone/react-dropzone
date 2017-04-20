const path = require('path');

module.exports = {
  title: 'react-dropzone',
  styleguideDir: path.join(__dirname, 'styleguide'),
  showCode: false,
  showSidebar: false,
  serverPort: 8080,
  sections: [
    {
      content: 'README.md'
    },
    {
      components: './src/index.js'
    },
    {
      name: 'Examples',
      components: './examples/**/*.js',
      context: {
        Dropzone: './src/index'
      }
    }
  ]
};
