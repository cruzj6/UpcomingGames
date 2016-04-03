var webpack = require('webpack');

module.exports = {
    entry: "./webvc/index.js",
    output: {
        path: __dirname + "/builds",
        filename: "bundle.js"
    },

    module: {
        loaders: [
            {
                test: /.*\/app\/.*\.js$/,
                exclude: /.spec.js/,
                loader: "uglify"
            }
        ]
    },

    'uglify-loader': {
        options: {
            mangle: false
        }
    },

    plugins: [
       new webpack.optimize.UglifyJsPlugin({
           mangle: false,
           sourceMap: false
       })
    ]

};