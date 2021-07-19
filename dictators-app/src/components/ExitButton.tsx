import React from 'react';
import Button from 'react-bootstrap/Button';
import { LinkContainer } from 'react-router-bootstrap';
import { useRecoilState, useRecoilValue } from 'recoil';
import { currentGameSocket } from '../store/selectors';
import { appState, connectEventState } from '../store/atoms';

const ExitButton = () => {
  const gameSocket = useRecoilValue(currentGameSocket);
  const { username } = useRecoilValue(appState);
  const [, setConnectEvent] = useRecoilState(connectEventState);

  const exitLobby = () => {
    const data = {
      event: 'EXIT_LOBBY',
      message: username,
    };
    gameSocket.send(JSON.stringify(data));
    setConnectEvent('');
  };

  return (
    <LinkContainer to="/">
      <Button type="button" variant="danger" onClick={exitLobby}>Exit</Button>
    </LinkContainer>
  );
};

export default ExitButton;
