const chalk = require('chalk')
const electron = require('electron')
const path = require('path')
const { spawn } = require('child_process')
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
//const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')

// 加载配置，一个主进程配置，一个是渲染进程配置
const mainConfig = require('./webpack.main.config')
const rendererConfig = require('./webpack.renderer.config')

let electronProcess = null
let manualRestart = false
let hotMiddleware

// 处理render进程
function startRenderer() {
    return new Promise((resolve, reject) => {

        // webpack compiler
        const compiler = webpack(rendererConfig)
        // 构建中间件，这里改为直接在配置加入插件
        hotMiddleware = webpackHotMiddleware(compiler, {
            log: false,
            heartbeat: 2500
        })

        compiler.plugin('compilation', compilation => {
            compilation.plugin('html-webpack-plugin-after-emit', (data, cb) => {
                hotMiddleware.publish({ action: 'reload' })
                cb()
            })
        })

        compiler.plugin('done', stats => {
            logStats('Renderer', stats)
        })
        // 构建webpack服务器
        const server = new WebpackDevServer(
            compiler,
            {
                contentBase: path.join(__dirname, '../'),
                quiet: true,
                setup(app, ctx) {
                    app.use(hotMiddleware)
                    ctx.middleware.waitUntilValid(() => {
                        resolve()
                    })
                }
            }
        )

        server.listen(9080, () => { 'render process server 已启动，端口：9080' })
    })
}

// 处理主进程代码
function startMain() {
    // 返回一个promise
    return new Promise((resolve, reject) => {
        // index.dev.js就是加了开发者工具
        mainConfig.entry.main = [path.join(__dirname, '../src/main-process/dev.js')].concat(mainConfig.entry.main)
        // 构建webpack编译器
        const compiler = webpack(mainConfig)

        compiler.plugin('watch-run', (compilation, done) => {
            logStats('Main', chalk.white.bold('compiling...'))
            hotMiddleware.publish({ action: 'compiling' })
            done()
        })

        compiler.watch({}, (err, stats) => {
            if (err) {
                console.log(err)
                return
            }

            logStats('Main', stats)
            // 如果主进程的代码有改动，就必须重启electron process
            if (electronProcess && electronProcess.kill) {
                manualRestart = true
                process.kill(electronProcess.pid)
                electronProcess = null
                startElectron()

                setTimeout(() => {
                    manualRestart = false
                }, 5000)
            }
            resolve()
        })
    })
}

function startElectron () {
    electronProcess = spawn(electron, ['--inspect=5858', path.join(__dirname, '../dist/electron/main.js')])
  
    electronProcess.stdout.on('data', data => {
      chalk.blue(data)
    })
    electronProcess.stderr.on('data', data => {
      chalk.red(data)
    })
  
    electronProcess.on('close', () => {
      if (!manualRestart) process.exit()
    })
  }

function init () {
    chalk.bgCyan('开始启动build')
  
    Promise.all([startRenderer(), startMain()])
      .then(() => {
        startElectron()
      })
      .catch(err => {
        console.error(err)
      })
}
  
init()
  