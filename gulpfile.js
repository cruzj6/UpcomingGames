var gulp = require('gulp');
var webpack = require('webpack-stream');
const babel = require('gulp-babel');

gulp.task('default', function(){
    return gulp.src('client/views/index.js')
        .pipe(webpack(require('./webpack.config.js')))
        .pipe(gulp.dest('client/builds/'));
});