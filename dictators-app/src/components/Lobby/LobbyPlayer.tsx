import React from 'react';

interface ILobbyPlayerProps {
  name: string,
  color: string,
}

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
