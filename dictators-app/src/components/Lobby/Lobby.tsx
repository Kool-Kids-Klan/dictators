import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { useRecoilState, useRecoilValue } from 'recoil';
import LobbyPlayer from './LobbyPlayer';
import { connect } from '../../BusinessLogic/BusinessLogic';
import { currentGameSocket } from '../../store/selectors';
import { appState, lobbyState } from '../../store/atoms';

const Lobby = () => {
  const { players } = useRecoilValue(lobbyState);
  const [app] = useRecoilState(appState);
  connect();
  const playersBlocks = players.map((player) => (
    <LobbyPlayer key={player.name} name={player.name} color={player.color} ready={player.ready} />
  ));

  const gameSocket = useRecoilValue(currentGameSocket);
  const startGame = () => {
    const data = {
      event: 'START_GAME',
      message: '',
    };
    gameSocket.send(JSON.stringify(data));
  };
  const getReady = () => {
    const data = {
      event: 'GET_READY',
      message: app.username,
    };
    gameSocket.send(JSON.stringify(data));
  };

  return (
    <div className="lobby">
      <h1>This is game lobby</h1>
      <hr />
      {playersBlocks}
      <LinkContainer to="/game">
        <button type="button" onClick={startGame}>Play</button>
      </LinkContainer>
      <button type="button" onClick={getReady}>Get ready</button>
    </div>
  );
};

export default Lobby;
