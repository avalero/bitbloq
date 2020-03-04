var path = require("path");

module.exports = {
  stories: ["../src/**/*.stories.[tj]sx"],
  webpackFinal: config => {
    config.module.rules.shift();
    config.module.rules.push({
      test: /\.(js|jsx|ts|tsx)?$/,
      include: [path.join(__dirname, "../..")],
      exclude: [/node_modules\/!(\@bitbloq\/)*/],
      loader: "babel-loader",
      options: {
        presets: [
          "@babel/preset-react",
          "@babel/preset-typescript",
          [
            "@babel/env",
            {
              targets: {
                chrome: "58"
              }
            }
          ]
        ],
        plugins: [
          ["emotion", { sourceMap: true, autoLabel: true }],
          ["@babel/plugin-proposal-class-properties", { loose: true }],
          [
            "@babel/plugin-syntax-decorators",
            { legacy: false, decoratorsBeforeExport: true }
          ]
        ]
      }
    });

    config.resolve.extensions.push(".ts", ".tsx");

    return config;
  }
};
