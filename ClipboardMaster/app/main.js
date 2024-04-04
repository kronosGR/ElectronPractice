const {
  app,
  Menu,
  Tray,
  nativeTheme,
  clipboard,
  globalShortcut,
  BrowserWindow,
} = require('electron');

const path = require('path');

let tray = null;
const clippings = [];

let browserWindow;

const getIcon = () => {
  if (process.platform === 'win32') return 'icon-light@2x.ico';
  if (nativeTheme.shouldUseDarkColors) return 'Icon-light.png';
  return 'icon-dark.png';
};

app.on('ready', () => {
  browserWindow = new BrowserWindow({ show: false });
  browserWindow.loadURL(`file://${__dirname}/index.html`);
  if (app.dock) app.dock.hide();

  tray = new Tray(path.join(__dirname, '../icons/', getIcon()));
  tray.setPressedImage(path.join(__dirname, '../icons/icon-dark.png'));

  if (process.platform === 'win32') {
    tray.on('click', tray.popUpContextMenu);
  }

  const activationShortcut = globalShortcut.register('CommandOrControl+Option+C', () => {
    tray.popUpContextMenu;
  });

  if (!activationShortcut) {
    console.error('Global activation shortcut failed to register');
  }

  const newClippingShortcut = globalShortcut.register('Alt+C', () => {
    const clipping = addClipping();
    if (clipping) {
      browserWindow.webContents.send('show-notification', 'Clipping Added', clipping);
    }
  });

  if (!newClippingShortcut) {
    console.error('Global new shortcut failed to register');
  }
  console.log(globalShortcut.isRegistered('CommandOrControl+Shift+Option+C'));
  updateMenu();

  tray.setToolTip('Clipboard Master');
});

const updateMenu = () => {
  const menu = Menu.buildFromTemplate([
    {
      label: 'Create New Clipping',
      click() {
        addClipping();
      },
      accelerator: 'Alt+C',
    },
    ...clippings.slice(0, 10).map(createClippingMenuItem),
    {
      type: 'separator',
    },
    {
      label: 'Quit',
      click() {
        app.quit();
      },
      accelerator: 'CommandOrControl+Q',
    },
  ]);

  tray.setContextMenu(menu);
};

const addClipping = () => {
  const clipping = clipboard.readText();
  console.log(clipping);
  if (clippings.includes(clipping)) return;
  clippings.unshift(clipping);
  updateMenu();
  return clipping;
};

const createClippingMenuItem = (clipping, index) => {
  return {
    label: clipping.length > 20 ? clipping.slice(0, 20) + '...' : clipping,
    click() {
      clipboard.writeText(clipping);
    },
    accelerator: `CommandOrControl+${index}`,
  };
};
