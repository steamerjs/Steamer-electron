const path = require('path')
const glob = require('glob')
const electron = require('electron')
//const autoUpdator = require('./auto-updator')

const BrowserWindow = electron.BrowserWindow

const app = electron.app

const debug = /--debug/.test(process.argv[2])

if (process.mas) {
    app.setName('Steamer')
}

var mainWindow = null

function initialize() {
    // 创建一个app的单例，如果这个app已经在运行，就直接退出
    var shouldQuit = makeSingleInstance()
    if (shouldQuit) {
        return app.quit()
    }
    // 载入main process的代码
    loadSteamer()
    // 创建一个窗口
    function createWindow() {
        var windowOptions = {
            width:1080,
            minWidth: 680,
            height: 840,
            title: 'Steamer Electron'
        }

        // 如果系统是Linux，使用512大小的icon
        if (process.platform === 'linux') {
            windowOptions.icon = path.join(__dirname, '/assets/app-icon/png/512png')
        }

        // 创建主窗口
        mainWindow = new BrowserWindow(windowOptions)
        // 载入主界面
        //mainWindow.loadURL(path.join('file://', __dirname, './index.html'))
        mainWindow.loadURL('localhost:12345/index.html')
        // 如果使用npm run debug，将会全屏并且打开开发者工具
        if (debug) {
            mainWindow.webContents.openDevTools()
            mainWindow.maximize()
            require('devtron').install()
        }

        // 关闭时，记得让js垃圾回收
        mainWindow.on('close', function() {
            mainWindow = null
        })
    }

    // Electron核心代码加载好后就可以创建主窗口，顺便初始化自动更新
    app.on('ready', function(){
        createWindow()
        //autoUpdator.initialize()
    })

    // 除了Mac系统，关闭全部窗口就关闭整个app
    app.on('window-all-closed', function(){
        if (process.platform !== 'darwin'){
            app.quit()
        }
    })

    // 如果点击图标主窗口没有创建，就创建一个
    // 这种情况常发生在mac OS
    app.on('activate', function(){
        if (mainWindow === null){
            createWindow()
        }
    })

    // 让这个app以单例模式运行
    // 主窗口会被存储起来避免用户尝试打开第二个app实例
    // process.mas Boolean - 在Mac App Store 创建, 它的值为 true, 在其它的地方值为 undefined
    function makeSingleInstance(){
        if (process.mas){
            return false
        }
        return app.makeSingleInstance(function(){
            if (mainWindow){
                // 如果被缩小化，展开窗口
                if (mainWindow,isMinimized()){
                    mainWindow.restore()
                }
                // 否则就聚焦
                mainWindow.focus()
            }
        })
    }

    // 加载main-process的每个文件
    function loadSteamer(){
        var files = glob.sync(path.join(__dirname, 'main-process/**/*.js'))
        files.forEach(function(file){
            require(file)
        })
        //autoUpdator.updateMenu()
    }
}
// 这里是处理关于squirrel的windows自动更新
switch (process.argv[1]) {
    case '--squirrel-install':
        //autoUpdater.createShortcut(function () { app.quit() })
        break
    case '--squirrel-uninstall':
        //autoUpdater.removeShortcut(function () { app.quit() })
        break
    case '--squirrel-obsolete':
    case '--squirrel-updated':
        app.quit()
        break
    default:
        initialize()
}