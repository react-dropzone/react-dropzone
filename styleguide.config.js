const path = require('path');

module.exports = {
  title: 'react-dropzone',
  styleguideDir: path.join(__dirname, 'styleguide'),
  showCode: false,
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
      components: './examples/**/*.js',
      context: {
        Dropzone: './src/index'
      }
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
