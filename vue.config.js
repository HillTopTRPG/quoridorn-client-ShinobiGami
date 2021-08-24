process.env.VUE_APP_VERSION = require('./package.json').version

module.exports = {
  productionSourceMap: true,
  publicPath: `/${process.env.VUE_APP_BASE_URL}`,
  pages: {
    main: {
      entry: 'src/main.ts', // エントリーポイントとなるjs
      template: 'public/index.html', // テンプレートのHTML
      filename: 'index.html' // build時に出力されるファイル名
    }
  },
  devServer: {
    historyApiFallback: {
      rewrites: [
        {
          from: new RegExp(`${process.env.VUE_APP_BASE_URL}`),
          to: 'index.html'
        } // index.html に飛ばす
      ]
    },

    watchOptions: {
      poll: true
    },
    disableHostCheck: true,
    hotOnly: true,
    clientLogLevel: 'warning',
    inline: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers':
        'X-Requested-With, content-type, Authorization'
    }
  },
  chainWebpack: config => {
    config.plugin('define').tap((definitions) => {
      process.env.NODE_ENV = 'production';
      definitions.__VUE_I18N_FULL_INSTALL__ = true;
      definitions.__VUE_I18N_LEGACY_API__ = false;
      definitions.__VUE_I18N_PROD_DEVTOOLS__ = false;
      definitions[0].__VUE_I18N_FULL_INSTALL__ = true;
      definitions[0].__VUE_I18N_LEGACY_API__ = false;
      definitions[0].__VUE_I18N_PROD_DEVTOOLS__ = false;
      definitions[0]['process.env'].__VUE_I18N_FULL_INSTALL__ = true;
      definitions[0]['process.env'].__VUE_I18N_LEGACY_API__ = false;
      definitions[0]['process.env'].__VUE_I18N_PROD_DEVTOOLS__ = false;
      return definitions;
    })
    config.module
      .rule('yaml')
      .test(/\.ya?ml$/)
      .use('json-loader')
      .loader('json-loader')
      .end()
      .use('yaml-loader')
      .loader('yaml-loader')
      .end()
    config.module
      .rule('layout')
      .test(/\.layout$/)
      .use('json-loader')
      .loader('json-loader')
      .end()
      .use('yaml-loader')
      .loader('yaml-loader')
      .end()
    config.module
      .rule('text')
      .test(/\.te?xt$/)
      .use('raw-loader')
      .loader('raw-loader')
      .end()
    config.module
      .rule('jison')
      .test(/\.jison$/)
      .use('raw-loader')
      .loader('raw-loader')
      .end()
  }
}
