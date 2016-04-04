var webpack = require('webpack');  // eslint-disable-line
var path = require('path');  // eslint-disable-line

module.exports = {
  entry: './src/index.js',
  devtool: 'source-map',
  output: {
    path: __dirname + '/dist/',
    filename: 'index.js',
    libraryTarget: 'umd',
    library: 'Dropzone'
  },
  module: {
    loaders: [
      {
        include: [
          path.resolve(__dirname, 'src')
        ],
        test: /\.js$/,
        loader: 'babel-loader'
      }
    ]
  },
  resolve: {
    // Can require('file') instead of require('file.js') etc.
    extensions: ['', '.js', '.json']
  },
  externals: {
    react: 'react'
  },
  plugins: []
};
