const { app, BrowserWindow, ipcMain, desktopCapturer, screen } = require('electron');
let win;

function createWindow() {
  win = new BrowserWindow({
    transparent: true,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
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

ipcMain.handle('DESKTOP_CAPTURER_GET_SOURCES', (event, opts) =>
  desktopCapturer.getSources(opts)
);

ipcMain.handle('SCREEN_GET_PRIMARY_DISPLAY', (event) => {
  return screen.getPrimaryDisplay();
});
