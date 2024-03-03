const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {

    entry: "./src/index.js",

    output: {
        assetModuleFilename: "images/[name]-[hash][ext]"
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/template.html"
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