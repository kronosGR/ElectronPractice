const { app, BrowserWindow, dialog, webContents } = require('electron');
const fs = require('fs');

require('@electron/remote/main').initialize();

// let mainWindow = null;
const windows = new Set();

const createWindow = (exports.createWindow = () => {
  let newWindow = new BrowserWindow({
    show: false,
    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  require('@electron/remote/main').enable(newWindow.webContents);
  newWindow.loadFile('./app/index.html');
  newWindow.on('ready-to-show', () => {
    newWindow.show();
    newWindow.webContents.openDevTools();
  });

  newWindow.on('closed', () => {
    windows.delete(newWindow);
    newWindow = null;
  });

  windows.add(newWindow);
  return newWindow;
});

app.on('ready', () => {
  // mainWindow = new BrowserWindow({
  //   show: false,
  //   webPreferences: {
  //     nodeIntegration: true,
  //     contextIsolation: false,
  //     enableRemoteModule: true,
  //   },
  // });
  // require('@electron/remote/main').enable(mainWindow.webContents);
  // mainWindow.loadFile('./app/index.html');
  // mainWindow.once('ready-to-show', () => {
  //   mainWindow.show();
  //   //getFileFromUser();
  //   mainWindow.webContents.openDevTools();
  // });
  // mainWindow.on('closed', () => {
  //   mainWindow = null;
  // });
  createWindow();
});

const getFileFromUser = (exports.getFileFromUser = async (targetWindow) => {
  const files = await dialog.showOpenDialog(targetWindow, {
    properties: ['openFile'],
    filters: [
      { name: 'Markdown files', extensions: ['md', 'markdown'] },
      {
        name: 'Text files',
        extensions: ['txt'],
      },
    ],
  });

  if (files) {
    const file = files.filePaths[0];
    openFile(targetWindow, file);
  }
});

const openFile = (targetWindow, file) => {
  const content = fs.readFileSync(file).toString();
  targetWindow.webContents.send('file-opened', file, content);
};
