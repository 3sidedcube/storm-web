var path = require('path');
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var stormConfig = require('./storm-config.json');

var context = __dirname + '/app';

module.exports = {
  cache: true,
  context: context,
  entry: './init.js',
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '',
    filename: '[name].js',
    chunkFilename: '[chunkhash].js'
  },
  module: {
    loaders: [
      {test: /\.css$/, loader: 'style!css'},
      {test: /\.less$/, loader: 'style!css!postcss!less'},
      {test: /\.hbs$/, loader: 'handlebars?helperDirs[]=' + context + '/helpers'},
      {test: /\.ttf$/, loader: 'url'},
      {test: /\.json$/, loader: 'json'}
    ]
  },
  resolve: {
    alias: {
      'current-platform': context + '/platforms/' + stormConfig.platform
    },
    extensions: ['', '.webpack.js', '.web.js', '.js', '.hbs']
  },
  plugins: [
    new webpack.ProvidePlugin({
      // Automtically detect jQuery and $ as free var in modules
      // and inject the jquery library
      // This is required by many jquery plugins
      jQuery: 'jquery',
      $: 'jquery',
      Backbone: 'backbone',
      _: 'underscore'
    })
  ],
  postcss: function() {
    return [autoprefixer];
  }
};
