const path = require('path');

module.exports = {
  title: 'react-dropzone',
  styleguideDir: path.join(__dirname, 'styleguide'),
  showCode: true,
  showSidebar: false,
  serverPort: 8080,
  sections: [
    {
      content: 'README.md'
    },
    {
      name: 'PropTypes',
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
