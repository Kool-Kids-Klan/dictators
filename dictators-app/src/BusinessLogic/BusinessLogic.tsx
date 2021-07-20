import React from 'react';
import { SetterOrUpdater, useRecoilState, useRecoilValue } from 'recoil';
import { useHistory } from 'react-router-dom';
import { currentGameSocket } from '../store/selectors';
import {
  appState, connectEventState, gameSocketUrlState, gameState, lobbyState, premovesState, scoreState,
} from '../store/atoms';
import { IGame, ILobby, IPlayer } from '../resources/types/types';

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

const connectTick = (setGame: SetterOrUpdater<IGame>, gameSocketUrl: string) => {
  const gameSocket = new WebSocket(gameSocketUrl);

  gameSocket.onopen = () => {
    console.log('tick socket is connecting');

    gameSocket.send(JSON.stringify({
      event: 'START_TICK',
      message: '',
    }));
  };

  gameSocket.onmessage = function onMessage(e) {
    let data = JSON.parse(e.data);
    console.log('recieved new message', data);
    data = data.payload;
    const { message } = data;
    const { event } = data;
    switch (event) {
      case 'LOAD_MAP':
        console.log('trying to load map');
        setGame({ game: message });
        break;
      default:
        console.log('No event');
    }
  };
};

export const connect = () => {
  const [, setGame] = useRecoilState(gameState);
  const gameSocket = useRecoilValue(currentGameSocket);
  const { username } = useRecoilValue(appState);
  const [, setScoreBoard] = useRecoilState(scoreState);
  const history = useHistory();
  const [lobby, setLobby] = useRecoilState(lobbyState);
  const [, setPremoves] = useRecoilState(premovesState);
  const openEvent = useRecoilValue(connectEventState);
  const gameSocketUrl = useRecoilValue(gameSocketUrlState);

  gameSocket.onopen = function open() {
    console.log('WebSockets connection created.', openEvent);
    // on websocket open, send the START event.
    if (openEvent !== '') {
      gameSocket.send(JSON.stringify({
        event: openEvent,
        message: username,
      }));
    } else {
      gameSocket.close(1000);
    }
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
        // connectTick(setGame, gameSocketUrl);
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
        setPremoves(message.premoves.map((premove: any) => {
          let dir = '';
          if (premove[1] === 'W') {
            dir = 'up';
          } else if (premove[1] === 'A') {
            dir = 'left';
          } else if (premove[1] === 'S') {
            dir = 'down';
          } else if (premove[1] === 'D') {
            dir = 'right';
          }
          return {
            from: [premove[0][1], premove[0][0]],
            direction: dir,
          };
        }));
        break;
      case 'JOIN_USER':
      case 'EXIT_USER':
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
      case 'START_TICKING_BRO':
        connectTick(setGame, gameSocketUrl);
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
