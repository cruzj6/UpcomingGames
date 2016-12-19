var gulp = require('gulp'),
    webpack = require('webpack-stream'),
    babel = require('gulp-babel'),
    runsequence = require('run-sequence'),
    sass = require('gulp-sass'),
    bower = require('gulp-bower'),
    flatten = require('gulp-flatten'),
    gulpFilter = require('gulp-filter'),
    uglify = require('gulp-uglify'),
    minifycss = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    mainBowerFiles = require('main-bower-files'),
    wiredep = require('gulp-wiredep');

gulp.task('default', ['watch']);

gulp.task('sass', function() {
    return gulp.src('./client/style/scss/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./client/style'));
});

/**
 * 
 */
gulp.task('js', function() {
    return gulp.src('client/views/index.js')
        .pipe(webpack(require('./webpack.config.js')))
        //.pipe(uglify())
        .pipe(gulp.dest('client/builds/'));
});

/**
 * Drops all bower dependencies css and js references into the index html file
 */
gulp.task('bower', function() {

    var jsFilter = gulpFilter('**/*.js', { restore: true }),
        cssFilter = gulpFilter('**/*.css', { restore: true }),
        sassFilter = gulpFilter('**/*.scss', { restore: true }),
        fontFilter = gulpFilter(['**/*.eot', '**/*.woff', '**/*.svg', '**/*.ttf'], { restore: true });
    var dest_path = 'client/builds'

    return gulp.src('./server/webview/temp/index.hbs')
        .pipe(wiredep({
            bowerJson: require('./bower.json'),
            directory: './client/bower_components',
            onError: function(err) {
                console.log(err);
            },
            cwd: './client',
            ignorePath: '../../../client/'
        }))
        .pipe(gulp.dest('./server/webview'));
});

gulp.task('watch', function() {
    try {
        gulp.watch(['client/**/*.js', '!client/builds/**/*.js'], ['js']);
        gulp.watch(['client/style/scss/**/*.scss'], ['sass']);
    } catch (e) {
        console.log(e);
    }
});