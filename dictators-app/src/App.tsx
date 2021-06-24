import React, { useState } from 'react';
import './App.css';
import MainMenu from './components/MainMenu/MainMenu';
import LogInMenu from './components/LogInMenu/LogInMenu';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  const logOut = () => { setLoggedIn(false); };
  const logIn = () => { setLoggedIn(true); };

  if (loggedIn) {
    return (
      <div className="App">
        <div className="topbar">
          <button type="button" onClick={logOut}>Log out</button>
        </div>
        <main className="main">
          <MainMenu />
        </main>
      </div>
    );
  }
  return (
    <div className="App">
      <main className="main">
        <LogInMenu logIn={logIn} />
        <form method="post">
          <label htmlFor="username" />
          <input type="text" name="username" placeholder="Username" />
          <label htmlFor="password" />
          <input type="password" name="password" placeholder="Password" />
          <button type="submit">Log In</button>
        </form>
      </main>
    </div>
  );
}

export default App;
