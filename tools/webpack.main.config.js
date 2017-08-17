'use strict'

process.env.BABEL_ENV = 'main'

const path = require('path')
const { dependencies } = require('../package.json')
const webpack = require('webpack')

const BabiliWebpackPlugin = require('babili-webpack-plugin')

let mainConfig = {
  // 入口时index.js
  entry: {
    main: path.join(__dirname, '../src/main.js')
  },
  // 排除package.json中指定的依赖
  externals: [
    ...Object.keys(dependencies || {})
  ],
  // 模块设定
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.node$/,
        use: 'node-loader'
      }
    ]
  },
  // 给node的全局变量提供一个polyfill
  node: {
    __dirname: process.env.NODE_ENV !== 'production',
    __filename: process.env.NODE_ENV !== 'production'
  },
  output: {
    filename: 'bundle.js',
    // 输出的library形式，除此之外还可以是var, window, global, amd等等
    libraryTarget: 'commonjs2',
    path: path.join(__dirname, '../dist/electron')
  },
  plugins: [
    // 当编译出现错误时，通过此插件跳过输出阶段
    new webpack.NoEmitOnErrorsPlugin()
  ],
  resolve: {
    extensions: ['.js', '.json', '.node']
  },
  // 指定构建的目标，其实就是通过一个叫做WebpackOptionsApply.js这个lib
  // 在这个lib中，定义了不同target所需要的所有插件
  target: 'electron-main'
}

/**
 * Adjust mainConfig for development settings
 */
if (process.env.NODE_ENV !== 'production') {
  mainConfig.plugins.push(
    new webpack.DefinePlugin({
      // 将__static定义到全局变量
      '__static': `"${path.join(__dirname, '../static').replace(/\\/g, '\\\\')}"`
    })
  )
}

/**
 * Adjust mainConfig for production settings
 */
if (process.env.NODE_ENV === 'production') {
  mainConfig.plugins.push(
    new BabiliWebpackPlugin({
      removeConsole: true,
      removeDebugger: true
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"'
    })
  )
}

module.exports = mainConfig
