const webpack = require("webpack");
const withWorkers = require("@zeit/next-workers");
const { parsed: localEnv } = require("dotenv").config();
const CopyPlugin = require("copy-webpack-plugin");
const BorndatePackage = require("@bitbloq/borndate/package.json");

const withTM = require("next-transpile-modules")([
  "@bitbloq/api",
  "@bitbloq/3d",
  "@bitbloq/ui",
  "@bitbloq/lib3d",
  "@bitbloq/bloqs",
  "@bitbloq/junior",
  "@bitbloq/robotics",
  "@bitbloq/code",
  "react-dnd",
  "react-dnd-html5-backend",
  "dnd-core",
  "monaco-editor"
]);

module.exports = withTM(
  withWorkers({
    webpack(config, options) {
      const { isServer } = options;

      config.output = {
        ...config.output,
        globalObject: "this"
      };

      config.module.rules.push(
        {
          test: /\.(svg|mp3|png|zip)$/,
          loader: "file-loader",
          options: {
            publicPath: `/_next/static/images/`,
            outputPath: `${isServer ? "../" : ""}static/images/`,
            name: "[name]-[hash].[ext]"
          }
        },
        {
          test: /\.(stl)$/,
          loader: "file-loader",
          options: {
            publicPath: `/_next/static/images/`,
            outputPath: `${isServer ? "../" : ""}static/images/`,
            name: "[hash].[ext]"
          }
        },
        {
          test: /\.html$/,
          loader: "raw-loader"
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"]
        }
      );

      config.plugins.push(
        new webpack.EnvironmentPlugin({
          ...localEnv,
          BORNDATE_VERSION: BorndatePackage.version
        }),
        new CopyPlugin([
          {
            from: "../../node_modules/@bitbloq/borndate/dist",
            to: "static/borndate"
          }
        ])
      );

      return config;
    }
  })
);
