const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {
    main: path.join(__dirname, 'src/index.jsx'),
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name]-[hash].js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /normalize\.css$/,
        use: ['to-string-loader', { loader: 'css-loader' }],
      },
      {
        test: /\.css$/,
        exclude: /normalize\.css$/,
        use: ['style-loader', { loader: 'css-loader' }],
      },
      {
        test: /\.svg$/,
        use: ['@svgr/webpack', 'url-loader'],
      },
      {
        test: /\.(jpe?g|png|gif|woff2?|eot|ttf|otf)$/,
        use: [
          {
            loader: 'url-loader',
            options: { limit: 15000, name: '[name]-[hash].[ext]' },
          },
        ],
      },
    ],
  },
  resolve: {
    // Allows us to do absolute imports from "src"
    modules: [path.join(__dirname, 'src'), 'node_modules'],
    extensions: ['*', '.js', '.jsx'],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src/index.html'),
      favicon: path.join(__dirname, 'src/favicon.png'),
    }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  ],
};
