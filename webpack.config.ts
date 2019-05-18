// tslint:disable:object-literal-sort-keys
import path = require("path");

module.exports = {
  mode: "production",
  entry: "./src/index.ts",
  output: {
    filename: "arkham-odds.js",
    path: path.resolve(__dirname, "dist"),
    globalObject: "this",
    library: "ArkhamOdds",
    libraryTarget: "umd"
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"]
  },

  module: {
    rules: [{ test: /\.tsx?$/, loader: "awesome-typescript-loader" }]
  }
};
