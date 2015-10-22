'use strict';

var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');
var mocha = require('gulp-mocha');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var eslint = require('gulp-eslint');
var cache  = require('gulp-memory-cache');
var rollup = require('gulp-rollup');
require('babel/register')({ stage: 0 });

gulp.task('lint', function () {
  return gulp.src(['src/**/*.js','test/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('lint-tdd', function () {
  return gulp.src(['src/**/*.js','test/**/*.js'], {since: cache.lastMtime('js')})
    .pipe(eslint())
    .pipe(cache('js'))
    .pipe(eslint.format());
});

gulp.task('test', function (done) {
  return gulp.src(['test/**/*.js'], { read: false })
    .pipe(mocha({reporter: 'spec'}))
    .on('error', gutil.log);
});

gulp.task('tdd', function () {
  gulp.watch(['./src/**', './test/**'], ['lint-tdd','test'])
    .on('change', cache.update('js'));;
});

gulp.task('build', function () {
  return gulp.src('src/parser-factory.js', { read: false })
    .pipe(rollup({ external: ['request', 'cheerio'] }))
    .on('error', gutil.log)
    //.pipe(sourcemaps.init())
    .pipe(babel({ stage: 0 }))
    .pipe(concat('realty-parser.js'))
    //.pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('lib'));
});

gulp.task('default', ['build']);
