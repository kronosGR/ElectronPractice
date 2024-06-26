const { app, BrowserWindow, Menu } = require('electron');

const menu = require('./menu');

let window;

app.on('ready', () => {
  window = new BrowserWindow({
    width: 1000,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  window.loadFile('index.html');
});

Menu.setApplicationMenu(menu);
