import {defineConfig} from "tsdown";

export default defineConfig({
  entry: {
    index: "./src/index.tsx"
  },
  format: ["esm", "cjs"],
  // Emit type declarations from the TS source (oxc isolatedDeclarations). Use a build-only
  // tsconfig that excludes the spec files so no declarations are emitted for tests.
  dts: {tsconfig: "./tsconfig.build.json"},
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
