import React, { useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './components/Pages/Home';
import NotFound from './components/Pages/NotFound';
import Login from './components/Pages/Auth/Login';
import Register from './components/Pages/Auth/Register';
import Confirmation from './components/Pages/Auth/Confirmation';
import Game from './components/Game/Game';
import Lobby from './components/Lobby/Lobby';
import { IGameBoard } from './components/BusinessLogic/BusinessLogic';

export default function Routes() {
  const [game, setGame] = useState<IGameBoard[][]>([]);

  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route exact path="/login">
        <Login />
      </Route>
      <Route exact path="/signup">
        <Register />
      </Route>
      <Route exact path="/confirm">
        <Confirmation />
      </Route>
      <Route exact path="/game">
        <Game game={game} setGame={setGame} />
      </Route>
      <Route exact path="/lobby">
        <Lobby game={game} setGame={setGame} />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}
