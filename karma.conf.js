// Karma configuration
// Generated on Fri Oct 30 2015 21:24:16 GMT+0000 (GMT)

var webpackConfig = require('./webpack.config.js'),
    RewirePlugin  = require('rewire-webpack'),
    path          = require('path'),
    extend        = require('util')._extend;

webpackConfig = extend({}, webpackConfig);

delete webpackConfig.entry;
delete webpackConfig.output;

webpackConfig.plugins.push(new RewirePlugin());
webpackConfig.module.preLoaders = [
  // instrument only testing sources with Istanbul
  {
    test: /\.js$/,
    include: path.resolve('app/'),
    loader: 'istanbul-instrumenter'
  }
];

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'chai'],

    // list of files / patterns to load in the browser
    files: [
      './node_modules/phantomjs-polyfill/bind-polyfill.js',
      'tests/promise-polyfiller.js',
      'tests/**/*.spec.js'
    ],

    // list of files to exclude
    exclude: [],

    // preprocess matching files before serving them to the browser
    // available preprocessors:
    // https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'tests/**/*.js': ['webpack']
    },

    webpack: webpackConfig,

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'coverage'],

    coverageReporter: {
      type: 'lcovonly',
      reporters: [
        {type: 'lcov', subdir: 'lcov'}
      ]
    },

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR ||
    // config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file
    // changes
    autoWatch: false,

    // start these browsers
    // available browser launchers:
    // https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};
