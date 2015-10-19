var path = require('path');
var webpack = require('webpack');

var context =  __dirname + '/app';

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
      {test: /\.less$/, loader: 'style!css!less'},
      {test: /\.hbs$/, loader: 'handlebars?helperDirs[]=' + context + '/helpers'}
    ]
  },
  resolve: {
    alias: {
      // Bind version of jquery
      //jquery: 'jquery-2.0.3',
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
  ]
};
