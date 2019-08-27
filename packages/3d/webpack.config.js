const webpack = require('webpack');
const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');

const htmlPlugin = new HtmlWebPackPlugin({
  template: './src/index.html',
  filename: './index.html',
});

const providePlugin = new webpack.ProvidePlugin({
  THREE: 'three',
});

const plugins = [htmlPlugin, providePlugin];

module.exports = {
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.worker\.ts$/,
        use: { loader: 'worker-loader' },
      },
      {
        test: /\.(js|jsx|ts|tsx)?$/,
        use: ['source-map-loader'],
        enforce: 'pre',
      },
      {
        test: /\.(js|jsx|ts|tsx)?$/,
        include: [/src/, /node_modules\/\@bitbloq\/*/],
        use: {
          loader: 'babel-loader',
          options: {
            rootMode: 'upward',
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(glb|svg)$/,
        use: ['file-loader'],
      },
      {
        type: 'javascript/auto',
        test: /\.(json)$/,
        include: [/src\/assets\/messages/],
        use: ['file-loader'],
      },
    ],
  },
  plugins,
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias: {
      'three/GLTFLoader': path.join(
        __dirname,
        'node_modules/three/examples/js/loaders/GLTFLoader.js'
      ),
    },
  },
  devServer: {
    historyApiFallback: true,
  },
  node: { fs: 'empty' },
};
