import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { ToggleButton } from 'react-bootstrap';
import LobbyPlayer from './LobbyPlayer';
import { connect } from '../../BusinessLogic/BusinessLogic';
import { currentGameSocket } from '../../store/selectors';
import { appState, lobbyState } from '../../store/atoms';
import ExitButton from '../ExitButton';

const Lobby = () => {
  const { id, players } = useRecoilValue(lobbyState);
  const { username } = useRecoilValue(appState);
  const [ready, setReady] = useState(false);
  connect();
  const playersBlocks = players.map((player) => (
    <LobbyPlayer key={player.name} name={player.name} color={player.color} ready={player.ready} />
  ));

  const gameSocket = useRecoilValue(currentGameSocket);
  const switchReady = () => {
    setReady(!ready);
    const event = (ready) ? 'NOT_READY' : 'GET_READY';
    const data = {
      event,
      message: username,
    };
    gameSocket.send(JSON.stringify(data));
  };

  return (
    <div className="lobby">
      <header className="lobby__header">Game Lobby</header>
      <span className="lobby__info">
        Lobby code:
        {' '}
        {id}
      </span>
      <div className="lobby__players">
        {playersBlocks}
      </div>
      <div className="lobby__controls">
        <button className={ready ? 'ready-btn ready' : 'ready-btn notready'} onClick={switchReady} type="submit">{(ready) ? 'Ready' : 'Unready'}</button>
        <ExitButton />
      </div>
    </div>
  );
};

export default Lobby;
