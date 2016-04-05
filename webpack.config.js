var webpack = require('webpack');

module.exports = {
    entry: {
        maintracker: "./client/views/index.js",
        welcomepage: "./client/views/welcomepage.js"
    },
    output: {
        path: __dirname + "/client/builds",
        filename: "[name].bundle.js"
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