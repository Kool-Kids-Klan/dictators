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
      <h1>This is game lobby</h1>
      <h2>
        Lobby code:&nbsp;
        {id}
      </h2>
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
      <ExitButton />
    </div>
  );
};

export default Lobby;
