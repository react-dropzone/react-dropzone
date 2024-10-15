import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { babel } from "@rollup/plugin-babel";
import { terser } from "rollup-plugin-terser";

const umdGlobals = {
  react: "React",
  "prop-types": "PropTypes",
};

module.exports = [
  {
    input: "./src/index.mjs",
    output: {
      file: "dist/index.js",
      format: "umd",
      name: "reactDropzone",
      globals: umdGlobals,
      sourcemap: "inline",
      exports: "named",
    },
    external: Object.keys(umdGlobals),
    plugins: [
      nodeResolve(),
      commonjs({ include: "**/node_modules/**" }),
      babel({
        exclude: "**/node_modules/**",
        babelHelpers: "bundled",
      }),
      terser(),
    ],
  },
];
