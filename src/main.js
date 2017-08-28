const { app, BrowserWindow, Menu, shell } = require('electron')
const path = require('path')
let port = process.argv.PORT || '12345'
let baseDir = path.join(__dirname, '../')

let menu
let template
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

            if (process.platform === 'darwin') {
                template = [{
                    label: 'Steamer',
                    submenu: [{
                        label: '关于',
                        selector: 'orderFrontStandardAboutPanel:'
                    }, {
                        type: 'separator'
                    }, {
                        label: '服务',
                        submenu: []
                    }, {
                        type: 'separator'
                    }, {
                        label: '隐藏Steamer',
                        accelerator: 'Command+H',
                        selector: 'hide:'
                    }, {
                        label: '隐藏其它应用程序',
                        accelerator: 'Command+Shift+H',
                        selector: 'hideOtherApplications:'
                    }, {
                        label: '全屏/取消全屏',
                        role: 'togglefullscreen',
                        selector: 'unhideAllApplications:'
                    }, {
                        type: 'separator'
                    }, {
                        label: '退出',
                        accelerator: 'Command+Q',
                        click() {
                            app.quit()
                        }
                    }]
                }, {
                    label: '项目',
                    submenu: [{
                        label: '开始新项目',
                        accelerator: 'Command + N'
                    }, {
                        label: '安装新插件',
                        click() {
                            console.log('安装新插件click，此功能还未实现')
                        }
                    }]
                },{
                    label: '编辑',
                    submenu: [{
                        label: '撤销',
                        accelerator: 'Command+Z',
                        selector: 'undo:'
                    }, {
                        label: '恢复',
                        accelerator: 'Shift+Command+Z',
                        selector: 'redo:'
                    }, {
                        type: 'separator'
                    }, {
                        label: '剪切',
                        accelerator: 'Command+X',
                        selector: 'cut:'
                    }, {
                        label: '复制',
                        accelerator: 'Command+C',
                        selector: 'copy:'
                    }, {
                        label: '粘贴',
                        accelerator: 'Command+V',
                        selector: 'paste:'
                    }, {
                        label: '全选',
                        accelerator: 'Command+A',
                        selector: 'selectAll:'
                    }]
                }, {
                    label: '视图',
                    submenu: (process.env.NODE_ENV === 'development') ? [{
                        label: '重载',
                        accelerator: 'Command+R',
                        click() {
                            mainWindow.webContents.reload()
                        }
                    }, {
                        label: '切换全屏',
                        accelerator: 'Ctrl+Command+F',
                        click() {
                            mainWindow.setFullScreen(!mainWindow.isFullScreen())
                        }
                    }, {
                        label: '切换开发者模式',
                        accelerator: 'Alt+Command+I',
                        click() {
                            mainWindow.toggleDevTools()
                        }
                    }] : [{
                        label: '切换全屏',
                        accelerator: 'Ctrl+Command+F',
                        click() {
                            mainWindow.setFullScreen(!mainWindow.isFullScreen())
                        }
                    }]
                },{
                    label: '帮助',
                    submenu: [{
                        label: '了解Steamer',
                        click() {
                            shell.openExternal('https://steamerjs.github.io/')
                        }
                    }, {
                        label: '查看文档',
                        click() {
                            shell.openExternal('https://steamerjs.github.io/')
                        }
                    }, {
                        label: '提交issue',
                        click() {
                            shell.openExternal('https://github.com/steamerjs/steamerjs/issues')
                        }
                    }]
                }]

                menu = Menu.buildFromTemplate(template)
                Menu.setApplicationMenu(menu)
            } else {
                template = [{
                    label: '&File',
                    submenu: [{
                        label: '&Open',
                        accelerator: 'Ctrl+O'
                    }, {
                        label: '&Close',
                        accelerator: 'Ctrl+W',
                        click() {
                            mainWindow.close()
                        }
                    }]
                }, {
                    label: '&View',
                    submenu: (process.env.NODE_ENV === 'development') ? [{
                        label: '&Reload',
                        accelerator: 'Ctrl+R',
                        click() {
                            mainWindow.webContents.reload()
                        }
                    }, {
                        label: 'Toggle &Full Screen',
                        accelerator: 'F11',
                        click() {
                            mainWindow.setFullScreen(!mainWindow.isFullScreen())
                        }
                    }, {
                        label: 'Toggle &Developer Tools',
                        accelerator: 'Alt+Ctrl+I',
                        click() {
                            mainWindow.toggleDevTools()
                        }
                    }] : [{
                        label: 'Toggle &Full Screen',
                        accelerator: 'F11',
                        click() {
                            mainWindow.setFullScreen(!mainWindow.isFullScreen())
                        }
                    }]
                }, {
                    label: 'Help',
                    submenu: [{
                        label: 'Learn More',
                        click() {
                            shell.openExternal('http://electron.atom.io')
                        }
                    }, {
                        label: 'Documentation',
                        click() {
                            shell.openExternal('https://github.com/atom/electron/tree/master/docs#readme')
                        }
                    }, {
                        label: 'Community Discussions',
                        click() {
                            shell.openExternal('https://discuss.atom.io/c/electron')
                        }
                    }, {
                        label: 'Search Issues',
                        click() {
                            shell.openExternal('https://github.com/atom/electron/issues')
                        }
                    }]
                }]
                menu = Menu.buildFromTemplate(template)
                mainWindow.setMenu(menu)
            }
        }))
