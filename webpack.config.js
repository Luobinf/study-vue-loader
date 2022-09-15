// const { VueLoaderPlugin } = require("vue-loader");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const path = require("path");
const { VueLoaderPlugin } = require("./lib/index.js");

// console.log(path.resolve(__dirname, 'lib/index.js'))


module.exports = {
  mode: "development",
  entry: "./src/index.js",
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: path.resolve(__dirname, 'lib/index.js'),
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({
        __VUE_OPTIONS_API__: true,
        __VUE_PROD_DEVTOOLS__: true
    })
  ],
};
