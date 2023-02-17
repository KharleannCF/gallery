const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
	mode: "development",
	entry: {
		index: "./src/index.js",
	},
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
	devtool: "inline-source-map",
	devServer: {
		static: "./public",
	},
	plugins: [
		new HtmlWebpackPlugin({
			title: "Development",
		}),
	],
	output: {
		filename: "[name].bundle.js",
		path: path.resolve(__dirname, "public"),
		clean: true,
		publicPath: "/public/",
	},
	optimization: {
		runtimeChunk: "single",
	},
};
