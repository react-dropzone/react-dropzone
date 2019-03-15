const path = require('path')

module.exports = {
  webpack: config => {
    // Resolve react-dropzone from ../../dist
    config.resolve.alias['react-dropzone'] = path.join(__dirname, '../../dist')
    // Fixes npm packages that depend on `fs` module
    config.node = {
      fs: 'empty'
    }
    return config
  }
}
