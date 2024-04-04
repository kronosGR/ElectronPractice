const { app, Menu, Tray } = require('electron');

const path = require('path');

let tray = null;

app.on('ready', () => {
  tray = new Tray(path.join(__dirname, '/icon-dark.png'));

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
