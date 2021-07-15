import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';

const MainMenu = () => (
  <div className="menu">
    <LinkContainer to="/game">
      <button type="button">Play</button>
    </LinkContainer>
    <button type="button">Leaderboards</button>
  </div>
);

export default MainMenu;
