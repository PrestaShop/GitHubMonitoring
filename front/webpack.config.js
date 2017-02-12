const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  entry: {
    app: path.resolve(__dirname, './src/main.js'),
  },
  output: {
    path: path.resolve(__dirname, '../public'),
    filename: '[hash]-[name].js',
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      vue$: 'vue/dist/vue.common.js',
    },
  },
  module: {
    loaders: [{
      test: /\.scss$/,
      use: ['style-loader', 'css-loader?sourceMap', 'sass-loader?sourceMap'],
    }, {
      test: /\.vue$/,
      use: 'vue-loader',
    }, {
      test: /\.json$/,
      use: 'json',
    }, {
      test: /.(jpg|png|woff(2)?|eot|otf|ttf|svg)(\?[a-z0-9=\.]+)?$/,
      use: 'file-loader?name=[hash].[ext]'
    }],
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: path.resolve(__dirname, './index.html'),
    }),
  ],
}
