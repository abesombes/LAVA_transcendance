// const { defineConfig } = require('@vue/cli-service')
// module.exports = defineConfig({
  // transpileDependencies: true,
  module.exports = {
    devServer: {
      proxy: {
        // proxy to bypass CORS
        // rewrite url as http://localhost:8080/... into http://localhost:3000/...
        "^/api": {
          target: "http://nestjs:3000/",
          changeOrigin: true,
          secure: false,
          pathRewrite: {'^/api': '/api'},
          logLevel: 'debug',
        }
      }
    }
  }