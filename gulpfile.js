var gulp = require('gulp');
var webpack = require('webpack-stream');

gulp.task('default', function(){
    return gulp.src('WebVC/index.js')
        .pipe(webpack(require('./webpack.config.js')))
        .pipe(gulp.dest('builds/'));
});