import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';

const MainMenu = () => (
  <div className="menu">
    <LinkContainer to="/game">
      <button className="menu__btn" type="button">Play</button>
    </LinkContainer>
    <LinkContainer to="/lobby">
      <button className="menu__btn" type="button">Create Lobby</button>
    </LinkContainer>
    <button className="menu__btn" type="button">Leaderboards</button>
  </div>
);

export default MainMenu;
