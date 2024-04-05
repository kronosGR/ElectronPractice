const { clipboard, shell, ipcRenderer } = require('electron');
const clippingsList = document.getElementById('clippings-list');
const copyFromClipboardButton = document.getElementById('copy-from-clipboard');

const request = require('request').defaults({
  url: 'https://api.github.com/gists',
  headers: { 'User-Agent': 'Clipboard master 2' },
});

ipcRenderer.on('create-new-clipping', () => {
  addClippingToList();
  new Notification('Clipping Added', {
    body: `${clipboard.readText()}`,
  });
});

ipcRenderer.on('write-to-clipboard', () => {
  const clipping = clippingsList.firstChild;
  writeToClipBoard(getClippingText(clipping));
});

ipcRenderer.on('publish-clipping', () => {
  const clipping = clippingsList.firstChild;
  publishClipping(getClippingText(clipping));
});

const createClippingElement = (clippingText) => {
  const clippingElement = document.createElement('article');

  clippingElement.classList.add('clippings-list-item');

  clippingElement.innerHTML = `
    <div class="clipping-text" disabled="true"></div>
    <div class="clipping-controls">
      <button class="copy-clipping">&rarr; Clipboard</button>
      <button class="publish-clipping">Publish</button>
      <button class="remove-clipping">Remove</button>
    </div>
  `;

  clippingElement.querySelector('.clipping-text').innerText = clippingText;
  return clippingElement;
};

const removeClipping = (target) => {
  target.remove();
};

const getButtonParent = ({ target }) => {
  return target.parentNode.parentNode;
};

const getClippingText = (clippingListItem) => {
  return clippingListItem.querySelector('.clipping-text').innerText;
};

const addClippingToList = () => {
  console.log('added');
  const clippingText = clipboard.readText();
  const clippingElement = createClippingElement(clippingText);
  clippingsList.prepend(clippingElement);
};

const writeToClipBoard = (clippingText) => {
  clipboard.writeText(clippingText);
};

const publishClipping = (clipping) => {
  request.post({ json: { clipping } }),
    (error, response, body) => {
      if (error) {
        return new Notification('Error publishing your clipping', {
          body: JSON.parse(error).message,
        });
      }

      const url = body.url;
      const notification = new Notification('Your clipping has been publish', {
        body: `Click to open ${url} in your browser`,
      });
      notification.onclick = () => {
        shell.openExternal(url);
      };
      clipboard.writeText(url);
    };
};

copyFromClipboardButton.addEventListener('click', addClippingToList);

clippingsList.addEventListener('click', (event) => {
  const hasClass = (className) => event.target.classList.contains(className);
  const clippingListItem = getButtonParent(event);

  if (hasClass('remove-clipping')) removeClipping(clippingListItem);
  if (hasClass('copy-clipping')) writeToClipBoard(getClippingText(clippingListItem));
  if (hasClass('publish-clipping')) publishClipping(getClippingText(clippingListItem));
});
