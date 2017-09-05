const { app, BrowserWindow, Menu, shell } = require('electron')
const path = require('path')
const createTemplate = require('./main-process/menu.js')
let port = process.argv.PORT || '12345'
let baseDir = path.join(__dirname, '../')

let menu
let mainWindow = null
if (process.env.NODE_ENV === 'production') {
    const sourceMapSupport = require('source-map-support') // eslint-disable-line
    sourceMapSupport.install()
}

if (process.env.NODE_ENV === 'development') {
    require('electron-debug')() // eslint-disable-line global-require
    const path = require('path') // eslint-disable-line
    const p = path.join(__dirname, '..', 'app', 'node_modules') // eslint-disable-line
    require('module').globalPaths.push(p) // eslint-disable-line
}

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

/**
 * 安装Chrome开发插件
 */
const installExtensions = () => {
    if (process.env.NODE_ENV === 'development') {
        const installer = require('electron-devtools-installer') // eslint-disable-line global-require

        const extensions = [
            'REACT_DEVELOPER_TOOLS',
            'REDUX_DEVTOOLS'
        ]
        const forceDownload = !!process.env.UPGRADE_EXTENSIONS
        return Promise.all(extensions.map(name => installer.default(installer[name], forceDownload)))
    }

    return Promise.resolve([])
}

app.on('ready', () =>
    installExtensions()
        .then(() => {
            mainWindow = new BrowserWindow({
                show: false,
                width: 1024,
                height: 728,
                vibrancy: 'popover',
            })

            // 检测是否是开发环境，如果是开发环境就走webpack服务器
            if (process.env.NODE_ENV == "production") {
                mainWindow.loadURL(url.format({
                    pathname: path.join(baseDir, './dist/index.html'),
                    protocol: 'file:',
                    slashes: true
                }))
            } else {
                mainWindow.loadURL(`http://localhost:${port}`)
            }
            // mainWindow.loadURL(`file://${__dirname}/index.html`)

            mainWindow.webContents.on('did-finish-load', () => {
                mainWindow.show()
                mainWindow.focus()
            })

            mainWindow.on('closed', () => {
                mainWindow = null
            })

            if (process.env.NODE_ENV === 'development') {
                mainWindow.openDevTools()
                mainWindow.webContents.on('context-menu', (e, props) => {
                    const { x, y } = props

                    Menu.buildFromTemplate([{
                        label: 'Inspect element',
                        click() {
                            mainWindow.inspectElement(x, y)
                        }
                    }]).popup(mainWindow)
                })
            }

            menu = Menu.buildFromTemplate(createTemplate(mainWindow))
            Menu.setApplicationMenu(menu)
        }))
