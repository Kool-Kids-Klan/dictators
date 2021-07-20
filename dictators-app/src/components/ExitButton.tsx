import React from 'react';
import Button from 'react-bootstrap/Button';
import { LinkContainer } from 'react-router-bootstrap';
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';
import { currentGameSocket } from '../store/selectors';
import { appState, connectEventState, lobbyState } from '../store/atoms';

const ExitButton = () => {
  const gameSocket = useRecoilValue(currentGameSocket);
  const { username } = useRecoilValue(appState);
  const [, setConnectEvent] = useRecoilState(connectEventState);
  const resetLobby = useResetRecoilState(lobbyState);

  const exitLobby = () => {
    const data = {
      event: 'EXIT_LOBBY',
      message: username,
    };
    gameSocket.send(JSON.stringify(data));
    setConnectEvent('');
    resetLobby();
  };

  return (
    <LinkContainer to="/">
      <button type="button" className="exit-btn" onClick={exitLobby}>Exit</button>
    </LinkContainer>
  );
};

export default ExitButton;
