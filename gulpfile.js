var gulp = require('gulp');
var webpack = require('webpack-stream');
const babel = require('gulp-babel');
const runsequence = require('run-sequence');
var sass = require('gulp-sass');

gulp.task('default', ['watch']);

gulp.task('sass', function () {
    return gulp.src('./client/style/scss/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./client/style'));
});

gulp.task('js', function () {
    return gulp.src('client/views/index.js')
        .pipe(webpack(require('./webpack.config.js')))
        .pipe(gulp.dest('client/builds/'));
});

gulp.task('watch', function () {
    gulp.watch(['client/**/*.js', '!client/builds/**/*.js'], ['js']);
    gulp.watch('client/style/scss/**/*.scss', ['sass']);
});