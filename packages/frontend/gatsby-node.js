const path = require('path');

exports.onCreatePage = async ({page, actions}) => {
  const {createPage} = actions;

  if (page.path.match(/^\/app/)) {
    page.matchPath = '/app/*';
    createPage(page);
  }
};

exports.onCreateWebpackConfig = ({ actions, loaders, getConfig, stage }) => {
  const config = getConfig();

  config.output = {
    ...config.output,
    globalObject: 'this'
  };

  config.module.rules = [
    {
      test: /\.worker\.ts$/,
      use: { loader: 'worker-loader' }
    },

    ...config.module.rules.filter(
      rule => String(rule.test) !== String(/\.jsx?$/)
    ),

    {
      ...loaders.js(),
      test: /\.jsx?$/,
      exclude: modulePath =>
        /node_modules/.test(modulePath) &&
        !/node_modules\/\@bitbloq\/*/.test(modulePath),
    },

    {
      type: 'javascript/auto',
      test: /\.(json)$/,
      include: [/src\/messages/],
      use: ['file-loader'],
    },

    {
      test: /\.(stl)$/,
      use: ['file-loader'],
    }
  ];

  config.resolve = {
    ...config.resolve,
    alias: {
      ...config.resolve.alias,
      react: path.resolve('./node_modules/react')
    }
  };

  if (stage === "build-html") {
    config.module.rules.push({
      test: /3d\/src\//,
      use: ['null-loader']
    });
    config.module.rules.push({
      test: /worker.ts$/,
      use: ['null-loader']
    });
  }

  actions.replaceWebpackConfig(config);
};

