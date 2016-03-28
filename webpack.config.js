module.exports = {
    entry: "./webvc/index.js",
    output: {
        path: __dirname + "./builds",
        filename: "bundle.js"
    },
    module: {
        loaders: [
        ]
    }
};