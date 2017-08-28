const path = require('path')
const { spawn } = require('child_process')
const chalk = require('chalk')
const express = require('express')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')

const webpackDevConf = require('./webpack.config.js')
const app = express()

const PORT = process.env.PORT || 12345
const baseDir = path.join(__dirname, '../')
const compiler = webpack(webpackDevConf)

//app.use(express.static('dist'));


app.use(webpackDevMiddleware(compiler, {
    hot: true,
    historyApiFallback: true,
    noInfo: true,
    stats: {
        colors: true
    }
}))

app.use(webpackHotMiddleware(compiler))

app.listen(PORT, function(err) {
    if (err) {
        console.error(err)
    }
    else {
        //console.info('Listening on port %s. Open up http://localhost:%s/ in your browser.', PORT, PORT)
        console.log(chalk.blue(`webpack 服务器已在端口${PORT}上启动，请打开http://localhost:${PORT}/`))
        console.log(chalk.blue('接下来运行 electron 主进程...'))
        spawn('electron', [path.join(baseDir, './src/main.js'), '--debug'], { shell: true, env: process.env, stdio: 'inherit' })
        .on('close', (code)=>{console.log(chalk.red('electron 进程被关闭'))})
        .on('error', (err)=>{console.log(chalk.red('进程发生错误：', err))})
    }
})


