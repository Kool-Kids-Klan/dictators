import React from 'react';
import './App.css';
import { RecoilRoot } from 'recoil';
import 'bootstrap/dist/css/bootstrap.min.css';
import { MyNavbar as Navbar } from './components/Nav/MyNavbar';
import Main from './components/Main/Main';

function App() {
  return (
    <RecoilRoot>
      <div className="App container py-3">
        <Navbar />
        <Main />
      </div>
    </RecoilRoot>
  );
}

export default App;
