import React from 'react';
import { ILobbyPlayerProps } from '../../resources/types/types';

const LobbyPlayer = ({ name, color, ready }: ILobbyPlayerProps) => (
  <div className={ready ? 'lobby-player ready' : 'lobby-player notready'}>
    <span className="lobby-player__name">{name}</span>
    <div className="lobby-player__color">
      Color:
      <span className={`lobby-player__color-span ${color}`} />
    </div>
  </div>
);

export default LobbyPlayer;
