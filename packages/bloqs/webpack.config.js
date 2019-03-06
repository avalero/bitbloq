const webpack = require('webpack');
const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');

const htmlPlugin = new HtmlWebPackPlugin({
  template: './src/index.html',
  filename: './index.html',
});

module.exports = {
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)?$/,
        use: ["source-map-loader"],
        enforce: "pre"
      },
      {
        test: /\.(js|jsx|ts|tsx)?$/,
        include: [/src/, /node_modules\/\@bitbloq\/*/],
        use: {
          loader: 'babel-loader',
          options: {
            rootMode: 'upward',
          }
        },
      },
    ],
  },
  plugins: [
    htmlPlugin
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  devServer: {
    historyApiFallback: true
  }
};
