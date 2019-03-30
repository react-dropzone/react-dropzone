/* eslint import/no-extraneous-dependencies: 0 */
const path = require('path')
const { createConfig, babel, css } = require('webpack-blocks')

// https://react-styleguidist.js.org/docs/configuration.html
module.exports = {
  title: 'react-dropzone',
  styleguideDir: path.join(__dirname, 'styleguide'),
  webpackConfig: createConfig([babel(), css()]),
  exampleMode: 'expand',
  usageMode: 'expand',
  showSidebar: false,
  serverPort: 8080,
  moduleAliases: {
    'react-dropzone': path.resolve(__dirname, './src')
  },
  require: [path.join(__dirname, 'examples/theme.css')],
  sections: [
    {
      name: '',
      content: 'README.md'
    },
    // TODO: Figure out how to document the hook
    // See https://github.com/reactjs/react-docgen/issues/332
    {
      name: 'Components',
      components: './src/index.js'
    },
    {
      name: 'Examples',
      sections: [
        {
          name: 'Basic example',
          content: 'examples/basic/README.md'
        },
        {
          name: 'Event Propagation',
          content: 'examples/events/README.md'
        },
        {
          name: 'Styling Dropzone',
          content: 'examples/styling/README.md'
        },
        {
          name: 'Accepting specific file types',
          content: 'examples/accept/README.md'
        },
        {
          name: 'Opening File Dialog Programmatically',
          content: 'examples/file-dialog/README.md'
        },
        {
          name: 'Previews',
          content: 'examples/previews/README.md'
        },
        {
          name: 'Class Components',
          content: 'examples/class-component/README.md'
        },
        {
          name: 'Extending Dropzone',
          content: 'examples/plugins/README.md'
        }
      ]
    }
  ]
}
