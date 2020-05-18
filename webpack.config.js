const { resolve } = require("path")
const HTMLWebpackPlugin = require("html-webpack-plugin")

module.exports = {
	entry: "./src/index.ts",
	devtool: "inline-source-map",
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: "ts-loader",
				exclude: "/node_modules/"
			},
			{
				test: /\.(png|svg|jpg|gif)$/,
				use: [ "file-loader" ],
			}
		]
	},
	resolve: {
		extensions: [ ".tsx", ".ts", ".js" ]
	},
	output: {
		filename: "main.js",
		path: resolve(__dirname, "dist")
	},
	plugins: [
		new HTMLWebpackPlugin({ title: "Train Game" })
	],
	mode: "development"
}
