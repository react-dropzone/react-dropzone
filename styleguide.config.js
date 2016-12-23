module.exports = {
  title: 'react-dropzone',
  showCode: true,
  highlightTheme: 'elegant',
  sections: [
    {
      name: 'Installation',
      content: 'README.md'
    },
    {
      name: 'PropTypes',
      components: './src/index.js'
    }
  ],
  updateWebpackConfig(config) {
    delete config.externals; // eslint-disable-line
    return config;
  }
};
