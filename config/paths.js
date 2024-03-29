/* global __dirname, require, module */
const path = require('path');

module.exports = {
  src: path.resolve(__dirname, '../src'),

  // Production build files
  build: path.resolve(__dirname, '../dist'),

  docs: path.resolve(__dirname, '../docs'),

  public: path.resolve(__dirname, '../public'),
};
