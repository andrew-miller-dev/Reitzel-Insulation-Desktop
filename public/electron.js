const electron = require('electron');
const { app, BrowserWindow, ipcMain } = electron;
const path = require('path');
const isDev = require('electron-is-dev');
const {autoUpdater} = require('electron-updater');

let mainWindow = null;
app.on('ready', createWindow);
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
});
app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
});
/*
autoUpdater.on('update-available', () => {
  mainWindow.webContents.send('update_available');
});
autoUpdater.on('update-downloaded', () => {
  mainWindow.webContents.send('update_downloaded');
});
ipcMain.on('restart_app', () => {
  autoUpdater.quitAndInstall();
});
*/
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 1024,
    title: "Reitzel Work Portal",
    icon: "",
    autoHideMenuBar:true,
    webPreferences:{
      nodeIntegration:true
    }
  });
  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
  mainWindow.on('closed', function () {
    mainWindow = null
  })
  mainWindow.on('page-title-updated', function (e) {
    e.preventDefault()
  });
  mainWindow.on('did-fail-load', () => {
    mainWindow.loadURL(url.format({
      pathname: path.join(__dirname, 'dist/index.html'),
      protocol: 'file:',
      slashes: true
    }))
  })
  mainWindow.once('ready-to-show', () => {
    autoUpdater.checkForUpdatesAndNotify();
  });
}