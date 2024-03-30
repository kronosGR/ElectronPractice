import logo from './logo.svg';
import './App.css';

import { Navbar, Button, Alignment, Icon } from '@blueprintjs/core';

const onSnipClick = async () => {
  const { ipcRenderer, shell } = window.require('electron');

  const path = window.require('path');
  const os = window.require('os');
  const fs = window.require('fs');

  try {
    const pmDisplay = await ipcRenderer.invoke('SCREEN_GET_PRIMARY_DISPLAY');
    const screenSize = pmDisplay.workAreaSize;
    const maxDimension = Math.max(screenSize.width, screenSize.height);
    console.log('display', maxDimension);
    const sources = await ipcRenderer.invoke('DESKTOP_CAPTURER_GET_SOURCES', {
      types: ['screen'],
      thumbnailSize: {
        width: maxDimension * window.devicePixelRatio,
        height: maxDimension * window.devicePixelRatio,
      },
    });
    const entireScreenSource = sources.find(
      (source) => source.name === 'Entire Screen' || source.name === 'Screen 1'
    );
    if (entireScreenSource) {
      const outputPath = path.join(os.tmpdir(), 'screenshot.png');
      const image = entireScreenSource.thumbnail
        .resize({ width: screenSize.width, height: screenSize.height })
        .crop({
          x: window.screenLeft,
          y: window.screenTop,
          width: window.innerWidth,
          height: window.outerHeight,
        })
        .toPNG();
      fs.writeFile(outputPath, image, (err) => {
        if (err) return console.error(err);
        shell.openExternal(`file://${outputPath}`);
      });
    } else {
      window.alert('Screen source not found');
    }
  } catch (err) {
    console.error(err);
  }
};

function App() {
  return (
    <div className='App'>
      <Navbar>
        <Navbar.Group align={Alignment.LEFT}>
          <Navbar.Heading>Electron Snip</Navbar.Heading>
          <Navbar.Divider />
          <Button className='bp3-minimal' icon='settings' text='Settings' />
          <Button className='bp3-minimal' icon='help' text='About' />
          <Button
            className='bp3-minimal'
            icon='camera'
            text='Snip'
            onClick={onSnipClick}
          />
        </Navbar.Group>
      </Navbar>

      <main className='App-main'>
        <Icon icon='camera' iconSize={100} />
        <p>Electron Snip</p>
      </main>
    </div>
  );
}

export default App;
