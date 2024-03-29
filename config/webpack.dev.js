/* global require, module */
const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const common = require('./webpack.common');
const paths = require('./paths');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map', // 'eval-cheap-source-map',
  output: {
    filename: '[name].min.js',
    library: {
      name: 'TextHighlight',
      type: 'umd',
      umdNamedDefine: true,
      export: 'default',
    },
    globalObject: 'this',
    clean: true,
  },

  // dev server
  devServer: {
    historyApiFallback: true,
    open: true,
    compress: true,
    hot: true,
    port: 8888,
    watchFiles: [paths.src],
  },


  plugins: [
    new HtmlWebpackPlugin({
      title: 'Demo',
      template: paths.src + '/template.html', // template file
      minify: true,
    }),
  ],


});
