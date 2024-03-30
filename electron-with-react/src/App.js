import logo from './logo.svg';
import { Navbar, Button, Alignment } from '@blueprintjs/core';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import './App.css';

function Index() {
  return <h2>Home</h2>;
}

function Files() {
  return <h2>Files</h2>;
}

function App() {
  return (
    <BrowserRouter>
      <Navbar className='bp3-dark'>
        <Navbar.Group align={Alignment.LEFT}>
          <Navbar.Heading>Blueprint</Navbar.Heading>
          <Navbar.Divider />
          <Link className='bp3-button bp3-minimal bp3-icon-home' to='/'>
            Home
          </Link>
          <Link className='bp3-button bp3-minimal bp3-icon-document' to='/files/'>
            Files
          </Link>
        </Navbar.Group>
      </Navbar>

      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        <Routes>
          <Route path='/' exact element={<Index />} />
          <Route path='/files' element={<Files />} />
        </Routes>
      </header>
    </BrowserRouter>
  );
}

export default App;
