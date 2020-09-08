const path = require('path');

module.exports = {
  lintOnSave: false,

  outputDir: './demo',
  publicPath: './',

  configureWebpack: {
    entry: {
      app: path.resolve(__dirname, './demo-src/main.js'),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './demo-src'),
      },
    },
  },
  chainWebpack: config => {
    config.module
      .rule('js')
      .include
      .add(path.resolve(__dirname, './demo-src'))

    const svgRule = config.module.rule('svg')

    // clear all existing loaders.
    // if you don't do this, the loader below will be appended to
    // existing loaders of the rule.
    svgRule.uses.clear()

    // add replacement loader(s)
    svgRule
      .use('vue-svg-loader')
      .loader('vue-svg-loader')
  }
}