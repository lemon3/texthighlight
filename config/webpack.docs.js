/* global require, module */
const { merge } = require('webpack-merge');
const common = require('./webpack.common');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const paths = require('./paths');

module.exports = merge(common, {
  mode: 'production',

  output: {
    path: paths.docs,
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

  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: paths.public + '/css',
          to: paths.docs + '/css', // paths.build same as ''
          globOptions: {
            ignore: ['*.DS_Store'],
          },
          noErrorOnMissing: true,
        },
      ],
    }),

    new HtmlWebpackPlugin(),
  ],
});