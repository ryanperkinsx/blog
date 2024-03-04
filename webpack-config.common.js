const HtmlWebpackPlugin = require("html-webpack-plugin");
const nodeExternals = require('webpack-node-externals');

module.exports = {

    entry: {
        main: "./src/index.js",
        tracker: "./src/tracker/tracker.js"
    },

    output: {
        assetModuleFilename: "images/[name]-[hash][ext]",
        clean: true
    },

    externals: {
        sqlite3: "commonjs sqlite3",
    },

    resolve: {
        fallback: {
            "fs": false,
            "path": false,
            "crypto": false,
            "util": false
        }
    },

    plugins: [
        new HtmlWebpackPlugin({
            filename: "index.html",
            template: "./src/index-template.html",
            chunks: ["main"]
        }),
        new HtmlWebpackPlugin({
            filename: "tracker.html",
            template: "./src/tracker-template.html",
            chunks: ["tracker"]
        })
    ],

    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    "style-loader",  // 2. injects the JS into the DOM
                    "css-loader"  // 1. translates CSS to JS
                ]  // array loads in REVERSE order
            },
            {
                test: /\.html$/,
                use: ["html-loader"]
            },
            {
                test: /\.(svg|png|jpe?g|gif)$/i,
                type: "asset/resource"
            }
        ]
    }
};