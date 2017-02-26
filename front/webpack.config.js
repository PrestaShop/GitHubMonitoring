const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

const entry = {
  app: path.resolve(__dirname, './src/main.js'),
};

const output = {
  path: path.resolve(__dirname, '../public'),
  filename: '[hash]-[name].js',
};

const resolve = {
  extensions: ['.js', '.vue', '.json'],
  alias: {
    vue$: 'vue/dist/vue.common.js',
  },
};

const loaders = [{
  test: /\.vue$/,
  use: 'vue-loader',
}, {
  test: /\.json$/,
  use: 'json-loader',
}, {
  test: /.(jpg|png|woff(2)?|eot|otf|ttf|svg)(\?[a-z0-9=\.]+)?$/,
  use: 'file-loader?name=[hash].[ext]'
}];

const plugins = [
  new HtmlWebpackPlugin({
    inject: true,
    template: path.resolve(__dirname, './index.html'),
  }),
  new webpack.EnvironmentPlugin({
    NODE_ENV: 'development',
  }),
];

if (process.env.NODE_ENV === 'production') {
  loaders.push({
    test: /\.scss$/,
    use: ['style-loader', 'css-loader', 'sass-loader'],
  });
  loaders.push({
    test: /\.css$/,
    use: ['style-loader', 'css-loader'],
  });
} else {
  loaders.push({
    test: /\.scss$/,
    use: ['style-loader', 'css-loader?sourceMap', 'sass-loader?sourceMap'],
  });
  loaders.push({
    test: /\.css$/,
    use: ['style-loader', 'css-loader?sourceMap'],
  });
}

module.exports = {
  entry,
  output,
  resolve,
  module: {
    loaders,
  },
  plugins,
}
