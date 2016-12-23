const path = require('path');

module.exports = {
  title: 'react-dropzone',
  styleguideDir: path.join(__dirname, 'styleguide'),
  showCode: true,
  sections: [
    {
      name: 'Installation',
      content: 'README.md'
    },
    {
      name: 'PropTypes',
      components: './src/index.js'
    },
    {
      name: 'Examples',
      context: {
        Dropzone: './src/index'
      },
      sections: [
        {
          name: 'Basic',
          content: 'examples/Basic.md'
        },
        {
          name: 'Filesize Validation',
          content: 'examples/Filesize Validation.md'
        },
        {
          name: 'Full Screen',
          content: 'examples/Full Screen.md'
        }
      ]
    }
  ],
  webpackConfig: {
    entry: [
      path.join(__dirname, 'examples/theme.css')
    ],
    module: {
      loaders: [
        {
          test: /\.css$/,
          loader: 'style!css'
        }
      ]
    }
  },
  updateWebpackConfig(config) {
    delete config.externals; // eslint-disable-line
    return config;
  }
};
