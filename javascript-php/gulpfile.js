'use strict';

var gulp = require('gulp');
var guppy = require('git-guppy')(gulp);
var gulpFilter = require('gulp-filter');
var eslint = require('gulp-eslint');
var jscs = require('gulp-jscs');
var phpcs = require('gulp-phpcs');

gulp.task('pre-commit', guppy.src('pre-commit', function(filesBeingCommitted) {
  var jsFilter = gulpFilter(['*.js']);
  var phpFilter = gulpFilter(['*.php']);

  return gulp.src(filesBeingCommitted)
    .pipe(jsFilter)
    .pipe(jscs({
      configPath: '.jscsrc'
    }))
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError())
    .pipe(jsFilter.restore())

  .pipe(phpFilter)
    .pipe(phpcs({
      bin: './vendor/bin/phpcs',
      standard: 'PSR2'
    }))
    .pipe(phpcs.reporter('log'))
    .pipe(phpcs.reporter('fail'));

}));

gulp.task('lint', function() {
  var jsFilter = gulpFilter(['*.js']);
  var phpFilter = gulpFilter(['*.php']);

  return gulp.src([
      '*.js',
      '*.php',
      '!node_modules/**',
      'vendor/**'
    ])
    .pipe(jsFilter)
    .pipe(jscs({
      configPath: '.jscsrc'
    }))
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(jsFilter.restore())

  .pipe(phpFilter)
    .pipe(phpcs({
      bin: './vendor/bin/phpcs',
      standard: 'PSR2'
    }))
    .pipe(phpcs.reporter('log'));

});
