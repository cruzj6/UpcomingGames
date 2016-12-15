var gulp = require('gulp');
var webpack = require('webpack-stream');
const babel = require('gulp-babel');
const runsequence = require('run-sequence');
var sass = require('gulp-sass');
var bower = require('gulp-bower');
// define plug-ins
var flatten = require('gulp-flatten'),
  gulpFilter = require('gulp-filter'),
  uglify = require('gulp-uglify'),
  minifycss = require('gulp-minify-css'),
  rename = require('gulp-rename');
var mainBowerFiles = require('main-bower-files');
var wiredep = require('gulp-wiredep');

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

gulp.task('bower', function() {

    var jsFilter = gulpFilter('**/*.js', {restore: true}),
      cssFilter = gulpFilter('**/*.css', {restore: true}),
      sassFilter = gulpFilter('**/*.scss', {restore: true}),
      fontFilter = gulpFilter(['**/*.eot', '**/*.woff', '**/*.svg', '**/*.ttf'], {restore: true});
  var dest_path = 'client/builds'

  return   gulp.src('./server/webview/temp/index.hbs')
    .pipe(wiredep({
        bowerJson: require('./bower.json'),
        directory: './client/bower_components',
        onError: function(err) {
            console.log(err);
        },
        cwd: './client',
        ignorePath: '../../../client/'
    }))
    .pipe(gulp.dest('./server/webview')); /*gulp.src(mainBowerFiles())
  .pipe(jsFilter)
  .pipe(gulp.dest(dest_path + '/js/'))
  .pipe(uglify())
  .pipe(rename({
    suffix: ".min"
  }))
  .pipe(gulp.dest(dest_path + '/js/'))
  .pipe(jsFilter.restore)

  // grab vendor css files from bower_components, minify and push in /public
  .pipe(cssFilter)
  .pipe(gulp.dest(dest_path + '/css'))
  .pipe(minifycss())
  .pipe(rename({
      suffix: ".min"
  }))
  .pipe(gulp.dest(dest_path + '/css'))
  .pipe(cssFilter.restore)

  .pipe(sassFilter)
  .pipe(sass().on('error', sass.logError))
  .pipe(minifycss())
  .pipe(rename({
      suffix: ".min"
  }))
  .pipe(gulp.dest(dest_path + '/css'))
  .pipe(sassFilter.restore)

  // grab vendor font files from bower_components and push in /public
  .pipe(fontFilter)
  .pipe(flatten())
.pipe(gulp.dest(dest_path + '/fonts'));*/
});

gulp.task('watch', function () {
    gulp.watch(['client/**/*.js', '!client/builds/**/*.js'], ['js']);
    gulp.watch(['client/style/scss/**/*.scss'], ['sass']);
});