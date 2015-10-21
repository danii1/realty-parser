'use strict';

var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');
var mocha = require('gulp-mocha');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var eslint = require('gulp-eslint');
require('babel/register')({ stage: 0 });

gulp.task('lint', function () {
    return gulp.src(['src/**/*.js','test/**/*.js'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('test', function (done) {
  return gulp.src(['test/**/*.js'], { read: false })
    .pipe(mocha({reporter: 'spec'}))
    .on('error', gutil.log);
});

gulp.task('tdd', ['test'], function () {
  gulp.watch(['./src/**', './test/**'], ['lint','test']);
});

gulp.task('build', function () {
  return gulp.src('src/**/*.js')
      .pipe(sourcemaps.init())
      .pipe(babel({ stage: 0 }))
      .pipe(concat('realty-parser.js'))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest('lib'));
});

gulp.task('default', ['build']);
