const { ipcRenderer } = require('electron');

ipcRenderer.on('show-notification', (event, title, body) => {
  const myNotification = new Notification(title, { body });
});
