import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './resources/styles/App.css';
import './resources/styles/Pages.css';
import { useRecoilState } from 'recoil';
import { Navbar } from './components/Nav/Navbar';
import Routes from './Routes';
import { appState } from './store/atoms';

function App() {
  const [{ authenticated }, setApp] = useRecoilState(appState);
  const r: { [x: string]: string; } = { a: 'b' };
  const cookies: { key: string, value: string }[] = document.cookie.split(';').map((cookie) => {
    const [a, b] = cookie.split('=');
    const trimmedA = a.trim();
    r[trimmedA] = b;
    return { key: a, value: b };
  });
  if (!authenticated && r.username) {
    setApp({ authenticated: true, username: r.username });
  }

  return (
    <div className="App container-fluid py-3">
      <Navbar />
      <Routes />
    </div>
  );
}

export default App;
