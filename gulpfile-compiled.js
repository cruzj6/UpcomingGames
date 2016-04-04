'use strict';

var gulp = require('gulp');
var webpack = require('webpack-stream');
var babel = require('gulp-babel');

gulp.task('default', function () {
    return gulp.src('client/views/index.js').pipe(webpack(require('./webpack.config.js'))).pipe(gulp.dest('client/builds/'));
});

//# sourceMappingURL=gulpfile-compiled.js.map