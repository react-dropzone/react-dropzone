{
  module.exports = {
    entry: "./lib/index.js",
    output: {
      path: __dirname,
      filename: "./dist/react-dropzone.js",
      libraryTarget: "var",
      library: "Dropzone"
    },
    externals: {
      "react": "React"
    }
  }
};
