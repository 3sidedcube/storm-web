'use strict';

var gulp   = require('gulp'),
    eslint = require('gulp-eslint');

gulp.task('lint', function() {
  return gulp.src(['app/**/*.js'])
      .pipe(eslint())
      .pipe(eslint.format());
});

gulp.task('default', ['lint']);
