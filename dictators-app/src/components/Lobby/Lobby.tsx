import React, { useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { ToggleButton } from 'react-bootstrap';
import LobbyPlayer from './LobbyPlayer';
import { connect } from '../../BusinessLogic/BusinessLogic';
import { currentGameSocket } from '../../store/selectors';
import { appState, lobbyState } from '../../store/atoms';

const Lobby = () => {
  const { players } = useRecoilValue(lobbyState);
  const [app] = useRecoilState(appState);
  const [ready, setReady] = useState(false);
  connect();
  const playersBlocks = players.map((player) => (
    <LobbyPlayer key={player.name} name={player.name} color={player.color} ready={player.ready} />
  ));

  const gameSocket = useRecoilValue(currentGameSocket);
  const switchReady = () => {
    setReady(!ready);
    const data = (ready) ? {
      event: 'NOT_READY',
      message: app.username,
    } : {
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
      <ToggleButton
        type="checkbox"
        checked={ready}
        variant="outline-primary"
        value={1}
        onChange={switchReady}
      >
        {(ready) ? 'Ready' : 'Unready'}
      </ToggleButton>
    </div>
  );
};

export default Lobby;
