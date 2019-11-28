const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");
const webpack = require("webpack");
const withOffline = require("next-offline");
const withTM = require("next-transpile-modules");
const withWorkers = require("@zeit/next-workers");
const { parsed: localEnv } = require("dotenv").config();

const scriptsPath = path.join(__dirname, "src", "scripts", "uploadImage.js");
const serviceWorkerPath = path.join(__dirname, "src", "service-worker.js");

module.exports = withOffline(
  withTM(
    withWorkers({
      transpileModules: [
        "@bitbloq/3d",
        "@bitbloq/ui",
        "@bitbloq/lib3d",
        "@bitbloq/bloqs",
        "@bitbloq/junior",
        "react-dnd",
        "dnd-core"
      ],

      devSwSrc: serviceWorkerPath,
      generateSw: false,
      swSrc: serviceWorkerPath,

      workboxOpts: {
        devSwSrc: serviceWorkerPath,
        importScripts: [scriptsPath],
        importWorkboxFrom: "disabled", // don't include workbox again as you already have it
        swSrc: serviceWorkerPath
      },

      webpack(config, options) {
        const { isServer } = options;

        config.output = {
          ...config.output,
          globalObject: "this"
        };

        config.module.rules.push({
          test: /\.(stl|svg|mp3|png)$/,
          loader: "file-loader",
          options: {
            publicPath: `/_next/static/images/`,
            outputPath: `${isServer ? "../" : ""}static/images/`,
            name: "[name]-[hash].[ext]"
          }
        });

        config.plugins.push(
          new webpack.EnvironmentPlugin({
            ...localEnv
          })
        );

        config.plugins.push(new CopyWebpackPlugin([scriptsPath]));

        return config;
      }
    })
  )
);
