import React from 'react';
import { SetterOrUpdater, useRecoilState, useRecoilValue } from 'recoil';
import { useHistory } from 'react-router-dom';
import { currentGameSocket } from '../store/selectors';
import {
  appState, gameState, lobbyState, scoreState,
} from '../store/atoms';
import { ILobby, IPlayer } from '../resources/types/types';

const changeUser = (lobby: ILobby, setLobby: SetterOrUpdater<ILobby>,
  changedPlayer: IPlayer) => {
  const index = lobby.players.findIndex((player) => player.name === changedPlayer.name);
  if (index === -1) {
    alert('did not find user that want to change');
  } else {
    setLobby({
      id: lobby.id,
      players: [
        ...lobby.players.slice(0, index), changedPlayer, ...lobby.players.slice(index + 1),
      ],
    });
  }
};

export const connect = () => {
  const [, setGame] = useRecoilState(gameState);
  const gameSocket = useRecoilValue(currentGameSocket);
  const { username } = useRecoilValue(appState);
  const [, setScoreBoard] = useRecoilState(scoreState);
  const history = useHistory();
  const [lobby, setLobby] = useRecoilState(lobbyState);
  console.log('this is gamesocket', gameSocket);
  gameSocket.onopen = function open() {
    console.log('WebSockets connection created.');
    // on websocket open, send the START event.
    gameSocket.send(JSON.stringify({
      event: 'JOIN_ROOM',
      message: username,
    }));
  };

  gameSocket.onclose = function close(e) {
    console.log('Socket is closed. Reconnect will be attempted in 1 second.', e.reason);
    console.log('this is game socket', gameSocket);
    // setGameSocket(new WebSocket('ws://localhost:8000/ws/play'));
    // setTimeout(() => {
    //   connect();
    // }, 1000);
  };

  gameSocket.onerror = function error(e) {
    console.log('error ocurred');
  };

  gameSocket.onmessage = function onMessage(e) {
    // On getting the message from the server
    // Do the appropriate steps on each event.
    let data = JSON.parse(e.data);
    console.log('recieved new message', data);
    data = data.payload;
    const { message } = data;
    const { event } = data;
    switch (event) {
      case 'START':
        history.push('/game');
        break;
      case 'END':
        alert(message);
        break;
        // case "MOVE":
        //   if(message["player"] !== char_choice){
        //     make_move(message["index"], message["player"])
        //     myturn = true;
        //     document.getElementById("alert_move").style.display = 'inline';
        //   }
        //   break;
      case 'GAME_BOARD':
        setGame({ game: message });
        console.log('game board', message);
        break;
      case 'TICK':
        console.log('this is thick', message);
        setGame({ game: message.map });
        setScoreBoard(message.scoreboard);
        break;
      case 'JOIN_USER':
        console.log('this are connected users', message);
        setLobby({ id: message.id, players: message.players });
        break;
      case 'LOAD_MAP':
        console.log('trying to load map');
        setGame({ game: message });
        break;
      case 'USER_READY':
        console.log('this user is ready', message);
        changeUser(lobby, setLobby, message);
        break;
      case 'USER_NOT_READY':
        console.log('this user is not ready', message);
        changeUser(lobby, setLobby, message);
        break;
      default:
        console.log('No event');
    }
  };

  // if (gameSocket.readyState === WebSocket.OPEN) {
  //   gameSocket.onopen();
  // }
};

export default connect;
