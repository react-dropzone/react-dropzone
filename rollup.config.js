/* eslint import/no-extraneous-dependencies: 0 */

import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import uglify from 'rollup-plugin-uglify'

const umdGlobals = {
  react: 'React',
  'prop-types': 'PropTypes'
}

export default [
  {
    input: './src/index.js',
    output: {
      file: 'dist/index.js',
      format: 'umd',
      name: 'Dropzone',
      globals: umdGlobals,
      sourcemap: 'inline'
    },
    external: Object.keys(umdGlobals),
    plugins: [
      nodeResolve(),
      commonjs({ include: '**/node_modules/**' }),
      babel({ exclude: '**/node_modules/**', plugins: ['external-helpers'] }),
      uglify()
    ]
  }
]
