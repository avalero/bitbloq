module.exports = function (api) {
  const presets = [
    "@babel/preset-react",
    "@babel/preset-typescript",
    [
      "@babel/env",
      {
        "targets": {
          "chrome": "58",
        }
      }
    ]
  ];

  const plugins = [
    [
      "emotion",
      {
        "sourceMap": true,
        "autoLabel": true
      }
    ],
    ["@babel/plugin-proposal-class-properties", { "loose": true }],
    ["@babel/plugin-syntax-decorators", {"legacy":false, "decoratorsBeforeExport": true}]
  ];

  const babelrcRoots = [
    ".",
    "packages/*",
  ];

  api.cache(true);

  return {
    presets,
    plugins,
    babelrcRoots
  };
}
