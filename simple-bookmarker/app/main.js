const { app, BrowserWindow } = require('electron');

let mainWindow = null;

app.on('ready', () => {
  console.log('Simple Bookmarker');
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  mainWindow.webContents.loadFile('app/index.html');
});
