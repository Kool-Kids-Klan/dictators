import React from 'react';
import './App.css';
import { RecoilRoot } from 'recoil';
import 'bootstrap/dist/css/bootstrap.min.css';
import { MyNavbar as Navbar } from './components/Nav/MyNavbar';
import Routes from './Routes';

function App() {
  return (
    <RecoilRoot>
      <div className="App container-fluid py-3">
        <Navbar />
        <Routes />
      </div>
    </RecoilRoot>
  );
}

export default App;
