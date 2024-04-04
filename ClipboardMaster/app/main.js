const { app, Menu, Tray, nativeTheme } = require('electron');

const path = require('path');

let tray = null;

const getIcon = () => {
  if (process.platform === 'win32') return 'icon-light@2x.ico';
  if (nativeTheme.shouldUseDarkColors) return 'Icon-light.png';
  return 'icon-dark.png';
};

app.on('ready', () => {
  if (app.dock) app.dock.hide();

  tray = new Tray(path.join(__dirname, '../icons/', getIcon()));

  if (process.platform === 'win32') {
    tray.on('click', tray.popUpContextMenu);
  }

  const menu = Menu.buildFromTemplate([
    {
      label: 'Quit',
      click() {
        app.quit();
      },
    },
  ]);

  tray.setToolTip('Clipboard Master');
  tray.setContextMenu(menu);
});
