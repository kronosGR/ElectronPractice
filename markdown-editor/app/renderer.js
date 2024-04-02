const { marked } = require('marked');
const mainProcess = require('@electron/remote').require('./main');
const remote = require('@electron/remote');
const { ipcRenderer } = require('electron');

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

markdownView.addEventListener('keyup', (event) => {
  const currentContent = event.target.value;
  console.log(currentContent);
  renderMarkdownToHTML(currentContent);
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
  markdownView.value = content;
  renderMarkdownToHTML(content);
});
