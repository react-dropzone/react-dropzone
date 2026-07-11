import {defineConfig} from "tsdown";

export default defineConfig({
  entry: {
    index: "./src/index.jsx"
  },
  format: ["esm", "cjs"],
  // Step 1 keeps JavaScript source, so ship the hand-written typings/react-dropzone.d.ts
  // instead of generating declarations. Step 2 (JS -> TS) turns on oxc-based `dts`.
  dts: false,
  target: "es2020",
  sourcemap: true,
  // With `"type": "module"`, emit ESM as `.js` and CJS as `.cjs` (matching package.json `exports`).
  fixedExtension: false,
  hash: false,
  // Entry has a default (Dropzone) plus named exports; make the CJS interop explicit
  // (require('react-dropzone').default for the component).
  outputOptions: {
    exports: "named"
  }
});
