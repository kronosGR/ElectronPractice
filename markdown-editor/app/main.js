const { app, BrowserWindow, dialog, webContents } = require('electron');
const fs = require('fs');

require('@electron/remote/main').initialize();

let mainWindow = null;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });
  require('@electron/remote/main').enable(mainWindow.webContents);
  mainWindow.loadFile('./app/index.html');
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    //getFileFromUser();
    mainWindow.webContents.openDevTools();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
});

const getFileFromUser = (exports.getFileFromUser = async () => {
  const files = await dialog.showOpenDialog(mainWindow, {
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
    openFile(file);
  }
});

const openFile = (file) => {
  const content = fs.readFileSync(file).toString();
  mainWindow.webContents.send('file-opened', file, content);
};
