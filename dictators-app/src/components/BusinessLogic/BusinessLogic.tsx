import React from 'react';
import { SetterOrUpdater } from 'recoil';

const roomCode = 1;
const webSocketUrl = 'localhost:8000';
const connectionString = `ws://${webSocketUrl}/ws/play/${roomCode}/`;
export const gameSocket = new WebSocket(connectionString);

export interface IGameBoard {
  army: number
  owner: string
  terrain: string
}

export interface IPlayer {
  name: string
  color: string
}

interface IConnect {
  setGame: SetterOrUpdater<IGameBoard[][]>,
  players: IPlayer[],
  setPlayers: SetterOrUpdater<IPlayer[]>,
}

export const connect = (props: IConnect) => {
  const { setGame, players, setPlayers } = props;
  gameSocket.onopen = function open() {
    console.log('WebSockets connection created.');
    // on websocket open, send the START event.
    gameSocket.send(JSON.stringify({
      event: 'JOIN_ROOM',
      message: 'revolko',
    }));
  };

  gameSocket.onclose = function close(e) {
    console.log('Socket is closed. Reconnect will be attempted in 1 second.', e.reason);
    setTimeout(() => {
      connect(props);
    }, 1000);
  };

  gameSocket.onmessage = function onMessage(e) {
    // On getting the message from the server
    // Do the appropriate steps on each event.
    let data = JSON.parse(e.data);
    console.log('recieved new message', data);
    data = data.payload;
    const { message } = data;
    const { event } = data;
    const newPlayers = [...players];
    switch (event) {
      case 'START':
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
        setGame(message);
        console.log('game board', message);
        break;
      case 'TICK':
        console.log('this is thick');
        break;
      case 'JOIN_USER':
        console.log('this is new user', message);
        newPlayers.push(message);
        setPlayers(newPlayers);
        break;
      case 'LOAD_MAP':
        console.log('trying to load map');
        setGame(message);
        break;
      case 'USER_READY':
        console.log('this user is ready', message);
        break;
      default:
        console.log('No event');
    }
  };

  // if (gameSocket.readyState === WebSocket.OPEN) {
  //   gameSocket.onopen();
  // }
};
