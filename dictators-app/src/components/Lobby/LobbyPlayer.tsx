import React from 'react';
import { ILobbyPlayerProps } from '../../resources/types/types';

const LobbyPlayer = ({ name, color }: ILobbyPlayerProps) => (
  <div className="lobby-player">
    <h2>
      Username:
      { name }
    </h2>
    <h3>
      Color:
      { color }
    </h3>
    <hr />
  </div>
);

export default LobbyPlayer;
