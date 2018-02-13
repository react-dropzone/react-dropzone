const path = require('path')

module.exports = env => {
  const isProduction = env === 'production'
  return {
    entry: './src/index.js',
    devtool: isProduction ? 'source-map' : 'inline-source-map',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'index.js',
      libraryTarget: 'umd',
      library: 'Dropzone'
    },
    module: {
      rules: [
        {
          include: [path.resolve(__dirname, 'src'), path.resolve(__dirname, 'examples')],
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: /node_modules/
        }
      ]
    },
    resolve: {
      // Can require('file') instead of require('file.js') etc.
      extensions: ['.js', '.json']
    },
    externals: {
      react: {
        root: 'React',
        commonjs2: 'react',
        commonjs: 'react',
        amd: 'react'
      },
      'prop-types': {
        root: 'PropTypes',
        commonjs2: 'prop-types',
        commonjs: 'prop-types',
        amd: 'prop-types'
      }
    }
  }
}
