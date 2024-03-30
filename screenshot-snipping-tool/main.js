const { app, BrowserWindow } = require('electron');
let win;

function createWindow() {
  win = new BrowserWindow({
    transparent: true,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  win.loadURL(`http://localhost:3000`);

  win.on('closed', () => {
    win = null;
  });
}

app.on('ready', () => {
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});
