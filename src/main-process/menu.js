// 针对macOS和Windows的差异提供不同的菜单
const { shell } = require('electron')

let template

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
}

module.exports = template;