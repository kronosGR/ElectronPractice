const { app, BrowserWindow, dialog, webContents } = require('electron');
const fs = require('fs');

require('@electron/remote/main').initialize();

// let mainWindow = null;
const windows = new Set();

const createWindow = (exports.createWindow = () => {
  let x, y;
  const currentWindow = BrowserWindow.getFocusedWindow();

  if (currentWindow) {
    const [currentWindowX, currentWindowY] = currentWindow.getPosition();
    x = currentWindowX + 10;
    y = currentWindowY + 10;
  }

  let newWindow = new BrowserWindow({
    x,
    y,
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

app.on('window-all-closed', () => {
  // for macOS
  if (process.platform === 'darwin') {
    return false;
  }
  app.quit();
});

app.on('activate', (event, hasVisibleWindows) => {
  // for macOS
  if (!hasVisibleWindows) {
    createWindow();
  }
});

app.on('will-finish-launching', () => {
  app.on('open-file', (event, file) => {
    const win = createWindow();
    win.once('ready-to-show', () => {
      openFile(win, file);
    });
  });
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

const openFile = (exports.openFile = (targetWindow, file) => {
  const content = fs.readFileSync(file).toString();
  app.addRecentDocument(file);
  targetWindow.setRepresentedFilename(file);
  targetWindow.webContents.send('file-opened', file, content);
});

const saveHtml = (exports.saveHtml = (targetWindow, content) => {
  const file = dialog.showSaveDialog(targetWindow, {
    title: 'Save HTML',
    defaultPath: app.getPath('documents'),
    filters: [{ name: 'HTML Files', extensions: ['html', 'htm'] }],
  });

  if (!file) return;
  fs.writeFileSync(file, content);
});

const saveMarkdown = (exports.saveMarkdown = (targetWindow, file, content) => {
  if (!file) {
    file = dialog.showSaveDialog(targetWindow, {
      title: 'Save Markdown',
      defaultPath: app.getPath('documents'),
      filters: [{ name: 'Markdown files', extensions: ['md', 'markdown'] }],
    });
  }
  if (!file) return;

  fs.writeFileSync(file, content);
  openFile(targetWindow, file);
});
