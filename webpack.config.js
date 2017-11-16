var path = require('path');
var webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: ['./src/index.js'],
    output: {
        path: __dirname + '/build',
        filename: 'MineSweeper.js'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [ 'style-loader', 'css-loader' ]
            },
            {
                test: /.jsx?$/,
                include: path.resolve(__dirname, "src"),
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ["react", "es2015"]
                }
            },
            {
                test: /\.(png|svg|jpg|gif|ico)$/,
                use: [ 'file-loader']
            },
            {
                test: /\.json$/,
                use: [ 'json-loader']
            }
        ]
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin(),
        new HtmlWebpackPlugin({template: './index.html'})
      ]
};