const { menubar } = require('menubar');

const menuBar = menubar({
  index: `file://${__dirname}/index.html`,
  browserWindow: {
    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration: true,
      contextIsolation: false,
    },
  },
});

menuBar.on('ready', () => {});

menuBar.on('after-create-window', () => {});
