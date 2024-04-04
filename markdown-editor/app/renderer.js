const { marked } = require('marked');
const remote = require('@electron/remote');
const mainProcess = require('@electron/remote').require('./main');
const { ipcRenderer, shell } = require('electron');
const path = require('path');
const { Menu } = remote;

const markdownView = document.querySelector('#markdown');
const htmlView = document.querySelector('#html');
const newFileButton = document.querySelector('#new-file');
const openFileButton = document.querySelector('#open-file');
const saveMarkdownButton = document.querySelector('#save-markdown');
const revertButton = document.querySelector('#revert');
const saveHtmlButton = document.querySelector('#save-html');
const showFileButton = document.querySelector('#show-file');
const openInDefaultButton = document.querySelector('#open-in-default');

const currentWindow = remote.getCurrentWindow();

let filePath = null;
let originalContent = '';

const getDraggedFile = (event) => event.dataTransfer.items[0];
const getDroppedFile = (event) => event.dataTransfer.files[0];

const showFile = () => {
  if (!filePath) {
    return alert('This file has not been saved to the filesystem');
  }
  shell.showItemInFolder(filePath);
};

const openInDefaultApplication = () => {
  if (!filePath) {
    return alert('This file has not been saved to the filesystem');
  }
  shell.openExternal(filePath);
};

const fileTypeIsSupported = (file) => {
  return ['text/plain', 'text/markdown'].includes(file.type);
};

document.addEventListener('dragstart', (event) => event.preventDefault());
showFileButton.addEventListener('click', showFile);
openInDefaultButton.addEventListener('click', openInDefaultApplication);

markdownView.addEventListener('dragover', (event) => {
  event.preventDefault();
  const file = getDraggedFile(event);

  if (fileTypeIsSupported(file)) {
    markdownView.classList.add('drag-over');
  } else {
    markdownView.classList.add('drag-error');
  }
});

markdownView.addEventListener('dragleave', () => {
  event.preventDefault();
  markdownView.classList.remove('drag-over');
  markdownView.classList.remove('drag-error');
});

markdownView.addEventListener('drop', (event) => {
  event.preventDefault();
  event.stopPropagation();
  const file = getDroppedFile(event);

  if (file && fileTypeIsSupported(file)) {
    mainProcess.openFile(currentWindow, file.path);
  } else {
    alert('The file is not supported');
  }
  markdownView.classList.remove('drag-over');
  markdownView.classList.remove('drag-error');
});

saveHtmlButton.addEventListener('click', () => {
  mainProcess.saveHtml(currentWindow, htmlView.innerHTML);
});

saveMarkdownButton.addEventListener('click', () => {
  mainProcess.saveMarkdown(currentWindow, filePath, markdownView.value);
});

revertButton.addEventListener('click', () => {
  markdownView.value = originalContent;
  renderMarkdownToHTML(originalContent);
});

markdownView.addEventListener('keyup', (event) => {
  const currentContent = event.target.value;
  renderMarkdownToHTML(currentContent);
  updateUserInterface(currentContent !== originalContent);
});

markdownView.addEventListener('contextmenu', (event) => {
  event.preventDefault();
  createContextMenu().popup();
});

openFileButton.addEventListener('click', () => {
  mainProcess.getFileFromUser(currentWindow);
});

newFileButton.addEventListener('click', () => {
  mainProcess.createWindow();
});

const renderMarkdownToHTML = (markdown) => {
  htmlView.innerHTML = marked(markdown, { sanitize: true });
};

ipcRenderer.on('file-opened', (event, file, content) => {
  if (currentWindow.isDocumentEdited()) {
    const result = remote.dialog.showMessageBox(currentWindow, {
      type: 'warning',
      title: 'Overwrite Current unsaved changes',
      message:
        'Opening a new file in this window will overwrite your changes. Open this file anyway?',
      buttons: ['Yes', 'Cancel'],
      defaultId: 0,
      cancelId: 1,
    });

    if (result === 1) return;
  }
  renderFile(file, content);
});

ipcRenderer.on('file-changed', (event, file, content) => {
  const result = remote.dialog.showMessageBox(currentWindow, {
    type: 'warning',
    title: 'Overwrite current unsaved changes?',
    message: 'Another application has changed this file. Load changes?',
    buttons: ['Yes', 'Cancel'],
    defaultId: 0,
    cancelId: 1,
  });
  renderFile(file, content);
});

ipcRenderer.on('save-markdown', () => {
  mainProcess.saveMarkdown(currentWindow, filePath, markdownView.value);
});

ipcRenderer.on('save-html', () => {
  mainProcess.saveHtml(currentWindow, filePath, markdownView.value);
});

ipcRenderer.on('show-file', showFile);
ipcRenderer.on('open-in-default', openInDefaultApplication);

const updateUserInterface = (isEdited) => {
  let title = 'Markdown Editor';

  if (filePath) {
    title = `${path.basename(filePath)} - ${title}`;
  }

  if (isEdited) {
    title = `${title} (Edited)`;
  }
  currentWindow.setTitle(title);
  currentWindow.setDocumentEdited(isEdited);

  saveMarkdownButton.disabled = !isEdited;
  revertButton.disabled = !isEdited;
};

const renderFile = (file, content) => {
  filePath = file;
  originalContent = content;

  markdownView.value = content;
  renderMarkdownToHTML(content);

  showFileButton.disabled = false;
  openInDefaultButton.disabled = false;

  updateUserInterface(false);
};

const createContextMenu = () => {
  return Menu.buildFromTemplate([
    {
      label: 'Open File',
      click() {
        mainProcess.getFileFromUser();
      },
    },
    {
      label: 'Show File in Folder',
      click: showFile,
      enabled: !!filePath,
    },
    {
      label: 'Open in Default Editor',
      click: openInDefaultApplication,
      enabled: !!filePath,
    },
    {
      type: 'separator',
    },
    { label: 'Cut', role: 'cut' },
    { label: 'Copy', role: 'copy' },
    { label: 'Paste', role: 'paste' },
    { label: 'Select All', role: 'selectAll' },
  ]);
};
