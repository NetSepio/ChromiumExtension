const dotenv = require('dotenv');
const webpack = require('webpack');
dotenv.config();
const { resolve } = require('path');
const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const tsRule = {
  test: /\.js(x?)$/,
  exclude: /node_modules/,
  use: ['babel-loader'],
};

const plugins = [
  new HTMLWebpackPlugin({
    template: 'src/popup-page/popup.html',
    filename: 'popup.html',
    chunks: ['popup'],
  }),
  new CopyWebpackPlugin({
    patterns: [{ from: 'public', to: '.' }],
  }),
  new CleanWebpackPlugin(),
  new webpack.DefinePlugin({
    'process.env': JSON.stringify(process.env),
  }),
];

module.exports = {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  entry: {
    popup: './src/popup-page/popup.jsx',
    contentscript: './src/contentscript.js',
  },
  output: {
    filename: '[name].js',
    path: resolve(__dirname, 'dist'),
  },
  module: {
    rules: [tsRule],
  },
  plugins,
  devServer: {
    static: {
      directory: path.join(__dirname, 'src'),
    },

    port: 3000,
    devMiddleware: {
      publicPath: 'https://localhost:3000/dist/',
    },
    hot: 'only',
  },
};
