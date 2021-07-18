import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';

const MainMenu = () => (
  <div className="menu">
    <LinkContainer to="/lobby">
      <button type="button">Join Lobby</button>
    </LinkContainer>
    <LinkContainer to="/lobby">
      <button type="button">Create Lobby</button>
    </LinkContainer>
    <button type="button">Leaderboards</button>
  </div>
);

export default MainMenu;
