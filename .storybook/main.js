module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    {
      /**
       * Fix Storybook issue with PostCSS@8
       * @see https://github.com/storybookjs/storybook/issues/12668#issuecomment-773958085
       */
      //postcss를 활용할 수 있도록 이 부분 추가.
      name: '@storybook/addon-postcss',
      options: {
        postcssLoaderOptions: {
          implementation: require('postcss'),
        },
      },
    },
  ],
  core: {
    builder: 'webpack5'
  },
  webpackFinal: (config) => {
    config.module.rules.push({
      test: /\.(mjs|jsx?|tsx?)$/,
      exclude: /node_modules/,
    });
    return config;
  }
};
