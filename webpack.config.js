module.exports = {
    entry: "./webvc/index.js",
    output: {
        path: __dirname + "/webvc/builds",
        filename: "bundle.js"
    },
    module: {
        loaders: [
        ]
    }
};