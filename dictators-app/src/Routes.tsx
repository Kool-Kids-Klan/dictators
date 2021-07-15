import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './components/Pages/Home';
import NotFound from './components/Pages/NotFound';
import Login from './components/Pages/Auth/Login';
import Register from './components/Pages/Auth/Register';
import Confirmation from './components/Pages/Auth/Confirmation';
import Game from './components/Game/Game';

export default function Routes() {
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
        <Game />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}
