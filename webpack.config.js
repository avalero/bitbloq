const webpack = require('webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

const htmlPlugin = new HtmlWebPackPlugin({
  template: './src/index.html',
  filename: './index.html'
});

const definePlugin = new webpack.DefinePlugin({
  WITHOUT_MONACO: JSON.stringify(process.env.WITHOUT_MONACO || false)
});

const plugins = [
  htmlPlugin,
  definePlugin
];

if (process.env.WITHOUT_MONACO === 'true') {
  plugins.push(
    new webpack.NormalModuleReplacementPlugin(
      /src\/components\/CodeEditor\.js/,
      './SimpleCodeEditor.js'
    )
  );
} else {
  plugins.push(
    new MonacoWebpackPlugin()
  );
}

module.exports = {
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.svg$/,
        use: ['file-loader']
      }
    ]
  },
  plugins
};
