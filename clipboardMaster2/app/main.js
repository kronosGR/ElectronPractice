const { menubar } = require('menubar');
const { globalShortcut, Menu } = require('electron');

const menuBar = menubar({
  preloadWindow: true,
  index: `file://${__dirname}/index.html`,
  browserWindow: {
    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration: true,
      contextIsolation: false,
    },
  },
});

menuBar.on('ready', () => {
  const secondaryMenu = Menu.buildFromTemplate([
    {
      label: 'Quit',
      click() {
        menuBar.app.quit();
      },
      accelerator: 'CommandOrControl+Q',
    },
  ]);
  menuBar.tray.on('right-click', () => {
    console.log('aaa');
    menuBar.tray.popUpContextMenu(secondaryMenu);
  });

  const createClipping = globalShortcut.register('Alt+1', () => {
    menuBar.window.webContents.send('create-new-clipping');
  });

  const writeClipping = globalShortcut.register('CmdOrCtrl+Alt+1', () => {
    menuBar.window.webContents.send('write-to-clipboard');
  });

  const publishClipping = globalShortcut.register('Alt+2', () => {
    menuBar.window.webContents.send('publish-clipping');
  });

  if (!createClipping) {
    console.log('Registration failed', 'createClipping');
  }

  if (!writeClipping) {
    console.error('Registration failed', 'writeClipping');
  }
  if (!publishClipping) {
    console.error('Registration failed', 'publishClipping');
  }
});

menuBar.on('after-create-window', () => {});
