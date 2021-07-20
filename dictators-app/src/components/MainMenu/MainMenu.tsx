import React, { useState } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { useRecoilState } from 'recoil';
import Form from 'react-bootstrap/Form';
import { connectEventState, gameSocketUrlState } from '../../store/atoms';
import { makeId } from '../../utils/utils';
import { connectionString } from '../../store/selectors';

const MainMenu = () => {
  const [, setGameSocketUrl] = useRecoilState(gameSocketUrlState);
  const [, setConnectEvent] = useRecoilState(connectEventState);
  const [lobbyId, setLobbyId] = useState('');

  const connectSocket = (event: string, url: string) => {
    setGameSocketUrl(url);
    setConnectEvent(event);
  };

  return (
    <div className="menu">
      <Form.Label className="form__label">Lobby code</Form.Label>
      <Form.Control
        className="form__input"
        autoFocus
        type="username"
        value={lobbyId}
        onChange={(e) => setLobbyId(e.target.value)}
      />
      <LinkContainer to="/lobby">
        <button className="menu__btn" type="button" onClick={() => connectSocket('JOIN_ROOM', `${connectionString}${lobbyId}/`)}>Join Lobby</button>
      </LinkContainer>
      <LinkContainer to="/lobby">
        <button className="menu__btn" type="button" onClick={() => connectSocket('CREATE_ROOM', `${connectionString}${makeId(5)}/`)}>Create Lobby</button>
      </LinkContainer>

      <LinkContainer to="/leaderboard">
        <button className="menu__btn" type="button">Leaderboard</button>
      </LinkContainer>
    </div>
  );
};
export default MainMenu;
