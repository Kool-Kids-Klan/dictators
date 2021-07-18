import React from 'react';
import { ILobbyPlayerProps } from '../../resources/types/types';

const LobbyPlayer = ({ name, color, ready }: ILobbyPlayerProps) => (
  <div className="lobby-player">
    {console.log('this is username', name, 'and this is read', ready)}
    <h2>
      Username:
      { name }
    </h2>
    <h3>
      Color:
      { color }
    </h3>
    <h4>
      Ready:
      { ready?.toString() }
    </h4>
    <hr />
  </div>
);

export default LobbyPlayer;
