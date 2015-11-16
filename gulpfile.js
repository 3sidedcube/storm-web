'use strict';

var gulp             = require('gulp'),
    eslint           = require('gulp-eslint'),
    webpack          = require('webpack'),
    WebpackDevServer = require('webpack-dev-server'),
    gutil            = require('gulp-util'),
    BomPlugin        = require('webpack-utf8-bom'),
    KarmaServer      = require('karma').Server,
    webpackConfig    = require('./webpack.config.js'),
    extend           = require('util')._extend;

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
  var webpackBuildConfig = extend({}, webpackConfig);

  webpackBuildConfig.plugins = webpackBuildConfig.plugins.concat(
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin(),
      new BomPlugin(true)
  );

  // run webpack
  webpack(webpackBuildConfig, function(err, stats) {
    if (err) {
      throw new gutil.PluginError('webpack:build', err);
    }

    gutil.log('[webpack:build]', stats.toString({
      colors: true
    }));
    callback();
  });
});

gulp.task('webpack:build-dev', function(callback) {
  // modify some webpack config options
  var webpackDevConfig = extend({}, webpackConfig);

  webpackDevConfig.devtool = 'sourcemap';
  webpackDevConfig.debug = true;

  // run webpack
  webpack(webpackDevConfig, function(err, stats) {
    if (err) {
      throw new gutil.PluginError('webpack:build-dev', err);
    }

    gutil.log('[webpack:build-dev]', stats.toString({
      colors: true
    }));
    callback();
  });
});

gulp.task('webpack-dev-server', ['copy-assets'], function(callback) {
  // modify some webpack config options
  var webpackDevServerConfig = extend({}, webpackConfig);

  webpackDevServerConfig.devtool = 'eval';
  webpackDevServerConfig.debug = true;

  // Start a webpack-dev-server
  new WebpackDevServer(webpack(webpackDevServerConfig), {
    contentBase: webpackDevServerConfig.output.path,
    publicPath: '/' + webpackDevServerConfig.output.publicPath,
    stats: {
      colors: true
    }
  }).listen(8080, function(err) {
    if (err) {
      throw new gutil.PluginError('webpack-dev-server', err);
    }

    gutil.log('[webpack-dev-server]', 'http://localhost:8080/webpack-dev-server/index.html');
  });
});

/**
 * Run all tests and exit.
 */
gulp.task('test', function(done) {
  new KarmaServer({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
});

gulp.task('default', ['lint', 'test', 'build']);
