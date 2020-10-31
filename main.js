const { app, BrowserWindow, ipcMain } = require('electron')
const {mainLoadURL, printLoadURL, isOpenDevTools, showPrint, isOpenPrintDevTools} = require('./config');

let mainWindow = null
let printerWindow = null

function createWindow () {
  // 创建浏览器窗口
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true
    }
  })
  mainWindow.focus()

  mainWindow.loadURL(mainLoadURL)

  if (isOpenDevTools) {
    mainWindow.webContents.openDevTools()
  }

  mainWindow.on('closed', function () {
    mainWindow = null;
    app.quit();
  })
}

function createPrinterWindow() {
  printerWindow = new BrowserWindow({
      // 尺寸根据 7cm 5cm 在 chrome 中得到具体 size
      width: 264,
      height: 188,
      frame: false,
      show: showPrint,
      webPreferences: {
        nodeIntegration: true,
        enableRemoteModule: true
      }
  });

  printerWindow.loadURL(printLoadURL);

  if (isOpenPrintDevTools) {
      printerWindow.webContents.openDevTools();
  }

  printerWindow.on("closed", () => {
      printerWindow = null;
  });
}

app.whenReady().then(() => {
  app.allowRendererProcessReuse = false

  createWindow()
  createPrinterWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
    createPrinterWindow()
  }
})

// 接受渲染进程对 print 事件
ipcMain.handle('print', (event, payload) => {
  // 像打印窗口发送 print 事件
  printerWindow.webContents.send('print', payload)
  // return payload
})
