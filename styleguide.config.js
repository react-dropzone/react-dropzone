/* eslint import/no-extraneous-dependencies: 0 */
const path = require("path");
const webpack = require("webpack");

// https://github.com/styleguidist/react-styleguidist/issues/2153
// https://github.com/styleguidist/react-styleguidist/blob/master/src/scripts/build.ts
// https://storybook.js.org/

const babelLoader = {
  test: /\.(js|jsx)$/,
  exclude: /node_modules/,
  use: [{ loader: "babel-loader", options: { cacheDirectory: true } }],
};

const cssLoader = {
  test: /\.css$/,
  use: [
    { loader: "style-loader", options: {} },
    { loader: "css-loader", options: ["styleLoader"] },
  ],
};

const devServer = {
  hot: true,
  hotOnly: true,
  historyApiFallback: true,
  inline: true,
  clientLogLevel: "error",
  stats: "errors-only",
  host: "0.0.0.0",
  allowedHosts: "all",
};

const webpackConfig = {
  resolve: {
    extensions: [".js", ".json"],
  },
  // Less noisy than default settings
  stats: {
    children: false,
    chunks: false,
    modules: false,
    reasons: false,
  },
  module: {
    rules: [babelLoader, cssLoader],
  },
  plugins: [
    // TODO: If prod, do not use?
    new webpack.HotModuleReplacementPlugin(),
  ],
  devServer,
};

// https://react-styleguidist.js.org/docs/configuration.html
module.exports = {
  title: "react-dropzone",
  styleguideDir: path.join(__dirname, "styleguide"),
  template: {
    favicon:
      "https://github.com/react-dropzone/react-dropzone/raw/master/logo/logo.png",
  },
  webpackConfig,
  exampleMode: "expand",
  usageMode: "expand",
  showSidebar: true,
  serverPort: 8080,
  moduleAliases: {
    "react-dropzone": path.resolve(__dirname, "./src"),
  },
  require: [path.join(__dirname, "examples/theme.css")],
  sections: [
    {
      name: "",
      content: "README.md",
    },
    // TODO: Figure out how to document the hook
    // See https://github.com/reactjs/react-docgen/issues/332
    {
      name: "Components",
      components: "./src/index.js",
    },
    {
      name: "Examples",
      sections: [
        {
          name: "Basic example",
          content: "examples/basic/README.md",
        },
        {
          name: "Event Propagation",
          content: "examples/events/README.md",
        },
        {
          name: "Forms",
          content: "examples/forms/README.md",
        },
        {
          name: "Styling Dropzone",
          content: "examples/styling/README.md",
        },
        {
          name: "Accepting specific file types",
          content: "examples/accept/README.md",
        },
        {
          name: "Accepting specific number of files",
          content: "examples/maxFiles/README.md",
        },
        {
          name: "Custom validation",
          content: "examples/validator/README.md",
        },
        {
          name: "Opening File Dialog Programmatically",
          content: "examples/file-dialog/README.md",
        },
        {
          name: "Previews",
          content: "examples/previews/README.md",
        },
        {
          name: "Class Components",
          content: "examples/class-component/README.md",
        },
        {
          name: "No JSX",
          content: "examples/no-jsx/README.md",
        },
        {
          name: "Extending Dropzone",
          content: "examples/plugins/README.md",
        },
      ],
    },
    {
      name: "Integrations",
      sections: [
        {
          name: "Pintura",
          content: "examples/pintura/README.md",
        },
      ],
    },
  ],
};
