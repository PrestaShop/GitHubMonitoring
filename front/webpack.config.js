var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: [
    'jquery/dist/jquery.js',
    './index.js',
    './style/theme.scss'
  ],
  output: {
    path: '../public',
    filename: 'bundle.js'
  },
  devtool: 'source-map',
  module: {
    loaders: [{
      test: /jquery\/dist\/jquery\.js/,
      loader: 'expose?jquery!expose?jQuery!expose?$'
    }, {
      test: /\.js$/,
      loader: 'babel',
      query: {
        plugins: ['transform-object-assign'],
        presets: ['es2015', 'react'],
      }
    }, {
      test: /\.json$/,
      loader: 'json'
    }, {
      test: /\.scss$/,
      loader: ExtractTextPlugin.extract('style', 'css!sass')
    }, {
      test: /\.css$/,
      loader: ExtractTextPlugin.extract('style', 'css?sourceMap!postcss!sass?sourceMap')
    }, {
      test: /.(jpg|png|woff(2)?|eot|otf|ttf|svg)(\?[a-z0-9=\.]+)?$/,
      loader: 'file-loader?name=[hash].[ext]'
    }]
  },
  plugins: [
    new ExtractTextPlugin('theme.css'),
    new CopyWebpackPlugin([
      { from: './index.html', to: '../public/index.html' },
    ]),
    /*new webpack.optimize.UglifyJsPlugin({
      sourceMap: false,
      compress: {
        sequences: true,
        conditionals: true,
        booleans: true,
        if_return: true,
        join_vars: true,
        drop_console: true
      },
      output: {
        comments: false
      }
    })*/
  ]
};
