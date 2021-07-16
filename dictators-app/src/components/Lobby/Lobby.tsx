import React, { useState } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import LobbyPlayer from './LobbyPlayer';

const Lobby = () => {
  const [players, setPlayers] = useState([{ name: 'palko', color: 'cerveny' }, { name: 'jozko', color: 'modry' }]);
  const playersBlocks = players.map((player) => (
    <LobbyPlayer name={player.name} color={player.color} />
  ));

  return (
    <div className="lobby">
      <h1>This is game lobby</h1>
      <hr />
      {playersBlocks}
      <LinkContainer to="/game">
        <button type="button">Play</button>
      </LinkContainer>
    </div>
  );
};

export default Lobby;
