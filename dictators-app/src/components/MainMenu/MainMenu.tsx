import React, { useState } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { useRecoilState } from 'recoil';
import Form from 'react-bootstrap/Form';
import { connectEventState, gameSocketUrlState } from '../../store/atoms';
import { makeId } from '../../utils/utils';

const webSocketUrl = 'localhost:8000';
const connectionString = `ws://${webSocketUrl}/ws/play/`;

const MainMenu = () => {
  const [, setGameSocketUrl] = useRecoilState(gameSocketUrlState);
  const [, setConnectEvent] = useRecoilState(connectEventState);
  const [lobbyId, setLobbyId] = useState('');

  const connectSocket = (event: string, url: string) => {
    if (event === 'JOIN_ROOM') {
      setGameSocketUrl(url);
    }
    setConnectEvent(event);
  };

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
        <button type="button" onClick={() => connectSocket('JOIN_ROOM', `${connectionString}${lobbyId}/`)}>Join Lobby</button>
      </LinkContainer>
      <LinkContainer to="/lobby">
        <button type="button" onClick={() => connectSocket('CREATE_ROOM', '')}>Create Lobby</button>
      </LinkContainer>
      <button type="button">Leaderboards</button>
    </div>
  );
};
export default MainMenu;
