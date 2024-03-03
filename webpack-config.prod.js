const CleanWebpackPlugin = require("clean-webpack-plugin");
const path = require("path");
const common = require("./webpack-config.common");
const {merge} = require("webpack-merge");

module.exports = merge(common, {

    mode: "production",

    output: {
        filename: "[name]-bundle-[hash].js",
        path: path.resolve(__dirname, "dist")
    },

    plugins: [new CleanWebpackPlugin()]
});