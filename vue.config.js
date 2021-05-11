const path = require('path')
function resolve(dir) {
  return path.join(__dirname, dir)
}
const name = "Djitd"
const port = process.env.port || process.env.npm_config_port || 4000
module.exports = {
  publicPath: "/",
  outputDir: 'dist',
  assetsDir: 'static',
  productionSourceMap: false,
  devServer: {
    port: port,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    // before: require('./mock/mock-server.js'),
    // proxy: {
    //   '/api': {
    //     target: 'http://192.168.1.106:8050', // 后端接口
    //     changeOrigin: true,
    //     pathRewrite: {
    //       '^/api': '/'
    //     }
    //   }
    // },
  },
  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    name: name,
    devtool: 'source-map',
    resolve: {
      alias: {
        '@': resolve('src')
      }
    }
  }
};
