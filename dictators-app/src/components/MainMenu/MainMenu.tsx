import React, { useState } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { useRecoilState } from 'recoil';
import Form from 'react-bootstrap/Form';
import { gameSocketUrlState } from '../../store/atoms';
import { makeId } from '../../utils/utils';

const webSocketUrl = 'localhost:8000';
const connectionString = `ws://${webSocketUrl}/ws/play/`;

const MainMenu = () => {
  const [gameSocketUrl, setGameSocketUrl] = useRecoilState(gameSocketUrlState);
  const [lobbyId, setLobbyId] = useState('');

  return (
    <div className="menu">
      <Form.Label>Lobby code</Form.Label>
      <Form.Control
        autoFocus
        type="username"
        value={lobbyId}
        onChange={(e) => setLobbyId(e.target.value)}
      />
      <LinkContainer to="/lobby">
        <button type="button" onClick={() => setGameSocketUrl(`${connectionString}${lobbyId}/`)}>Join Lobby</button>
      </LinkContainer>
      <LinkContainer to="/lobby">
        <button type="button" onClick={() => setGameSocketUrl(`${connectionString}${makeId(5)}/`)}>Create Lobby</button>
      </LinkContainer>
      <button type="button">Leaderboards</button>
    </div>
  );
};
export default MainMenu;
