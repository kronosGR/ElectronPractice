const { menubar } = require('menubar');

const menuBar = menubar({ index: `file://${__dirname}/index.html` });

menuBar.on('ready', () => {
  console.log('sss');
});

menuBar.on('after-create-window', () => {});
