const {
  app,
  BrowserWindow,
  ipcMain,
  desktopCapturer,
  screen,
  Menu,
  Tray,
  globalShortcut,
} = require('electron');
const path = require('path');

let win;
let tray;

function createTray() {
  const iconPath = path.join(__dirname, 'assets/icon.png');
  tray = new Tray(iconPath);
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show',
      type: 'normal',
      accelerator: 'CommandOrControl+Alt+Shift+S',
      click() {
        win.show();
      },
    },
    {
      label: 'Quit',
      type: 'normal',
      click() {
        app.quit();
      },
    },
  ]);
  tray.setToolTip('screenshot');
  tray.setContextMenu(contextMenu);

  globalShortcut.register('CommandOrControl+Alt+Shift+S', () => {
    if (win) win.show();
  });
}

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

  win.hide();
  win.loadURL(`http://localhost:3000`);

  win.on('closed', () => {
    win = null;
  });
}

app.on('ready', () => {
  createTray();
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
