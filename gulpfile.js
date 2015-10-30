'use strict';

var gulp             = require('gulp'),
    eslint           = require('gulp-eslint'),
    webpack          = require('webpack'),
    WebpackDevServer = require('webpack-dev-server'),
    gutil            = require('gulp-util'),
    webpackConfig    = require('./webpack.config.js');

gulp.task('lint', function() {
  return gulp.src(['app/**/*.js'])
      .pipe(eslint())
      .pipe(eslint.format());
});

gulp.task('copy-assets', function() {
  return gulp.src('app/assets/**/*')
      .pipe(gulp.dest(webpackConfig.output.path));
});

// Production build
gulp.task('build', ['lint', 'copy-assets', 'webpack:build']);

gulp.task('webpack:build', function(callback) {
  // modify some webpack config options
  var myConfig = Object.create(webpackConfig);
  myConfig.plugins = myConfig.plugins.concat(
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin()
  );

  // run webpack
  webpack(myConfig, function(err, stats) {
    if (err) throw new gutil.PluginError('webpack:build', err);
    gutil.log('[webpack:build]', stats.toString({
      colors: true
    }));
    callback();
  });
});

// modify some webpack config options
var myDevConfig = Object.create(webpackConfig);
myDevConfig.devtool = 'sourcemap';
myDevConfig.debug = true;

// create a single instance of the compiler to allow caching
var devCompiler = webpack(myDevConfig);

gulp.task('webpack:build-dev', function(callback) {
  // run webpack
  devCompiler.run(function(err, stats) {
    if (err) throw new gutil.PluginError('webpack:build-dev', err);
    gutil.log('[webpack:build-dev]', stats.toString({
      colors: true
    }));
    callback();
  });
});

gulp.task('webpack-dev-server', ['copy-assets'], function(callback) {
  // modify some webpack config options
  var myConfig = Object.create(webpackConfig);
  myConfig.devtool = 'eval';
  myConfig.debug = true;

  // Start a webpack-dev-server
  new WebpackDevServer(webpack(myConfig), {
    contentBase: myConfig.output.path,
    publicPath: '/' + myConfig.output.publicPath,
    stats: {
      colors: true
    }
  }).listen(8080, function(err) {
        if (err) throw new gutil.PluginError('webpack-dev-server', err);
        gutil.log('[webpack-dev-server]', 'http://localhost:8080/webpack-dev-server/index.html');
      });
});

gulp.task('default', ['lint', 'build']);
