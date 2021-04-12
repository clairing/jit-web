const path = require('path')
function resolve(dir) {
  return path.join(__dirname, dir)
}
const name = "Djitd"
const port = process.env.port || process.env.npm_config_port || 3001
module.exports = {
  publicPath: "/",
  outputDir: 'dist',
  assetsDir: 'static',
  // lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false,
  devServer: {
    port: port,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    before: require('./mock/mock-server.js')
    //    proxy: {
    //     '/api': {
    //         target: 'http://localhost:62125', // 后端接口
    //         changeOrigin: true,
    //         pathRewrite: {
    //             '^/api': '/'
    //         }
    //     }
    // },
  },
  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    name: name,
    resolve: {
      alias: {
        '@': resolve('src')
      }
    }
  }
};
