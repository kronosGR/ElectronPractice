import logo from './logo.svg';
import './App.css';

import { Navbar, Button, Alignment, Icon } from '@blueprintjs/core';

const onSnipClick = async () => {
  const { remote, ipcRenderer } = window.require('electron');
  //const screen = await remote.screen;

  try {
    const sources = await ipcRenderer.invoke('DESKTOP_CAPTURER_GET_SOURCES', {
      types: ['screen'],
    });
    const entireScreenSource = sources.find(
      (source) => source.name === 'Entire Screen' || source.name === 'Screen 1'
    );
    if (entireScreenSource) {
      console.log(entireScreenSource);
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
