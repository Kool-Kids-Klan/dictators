import React, { useEffect, useState } from 'react';
import './Game.css';
import { useRecoilState } from 'recoil';
import Square from './Square';
import Score from './Score';
import { Coor, gameState, premovesState } from '../../store/atoms';

interface IGameBoard {
  army: number
  owner: string
  terrain: string
}

const roomCode = 1;
const webSocketUrl = 'localhost:8000';
const connectionString = `ws://${webSocketUrl}/ws/play/${roomCode}/`;
const gameSocket = new WebSocket(connectionString);

const connect = (setGame: React.Dispatch<React.SetStateAction<IGameBoard[][]>>) => {
  gameSocket.onopen = function open() {
    console.log('WebSockets connection created.');
    // on websocket open, send the START event.
    gameSocket.send(JSON.stringify({
      event: 'START',
      message: '',
    }));
  };

  gameSocket.onclose = function close(e) {
    console.log('Socket is closed. Reconnect will be attempted in 1 second.', e.reason);
    setTimeout(() => {
      connect(setGame);
    }, 1000);
  };

  gameSocket.onmessage = function onMessage(e) {
    // On getting the message from the server
    // Do the appropriate steps on each event.
    console.log('on message event', e);
    let data = JSON.parse(e.data);
    data = data.payload;
    const { message } = data;
    const { event } = data;
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
      default:
        console.log('No event');
    }
  };

  // if (gameSocket.readyState === WebSocket.OPEN) {
  //   gameSocket.onopen();
  // }
};

const Game = () => {
  const [game, setGame] = useState<IGameBoard[][]>([]);
  const [premoves, setPremoves] = useRecoilState(premovesState);
  const [{ selected }, setSelected] = useRecoilState(gameState);
  connect(setGame);

  // const game = [
  //   [{ army: 1, owner: 'blue', terrain: 'barracks' }, { army: 120, owner: 'blue' },
  //   {}, { army: 10, owner: 'red' }],
  //   [{ army: 1, owner: 'blue' }, { army: 120, owner: 'blue', terrain: 'capital' },
  //   { army: 1, owner: 'red', terrain: 'mountains' }, { army: 10, owner: 'red' }],
  //   [{ army: 1, owner: 'blue' }, {}, { army: 1, owner: 'red' },
  //   { army: 10, owner: 'green' }],
  //   [{ terrain: 'capital' }, { army: 120, owner: 'blue' },
  //   { army: 1, owner: 'red', terrain: 'barracks' }, { army: 10, owner: 'red' }],
  // ];

  console.log('this is game', game);
  const board = game.map((row, y) => {
    const squares = row.map((square, x) => {
      const coords: Coor = [y, x];
      const selectClass = (selected && coords[0] === selected[0] && coords[1] === selected[1]) ? 'selected' : '';
      const selectSquare = () => setSelected({ selected: coords });
      // TODO overwrites terrain in CSS
      let directions = '';
      premoves.forEach((premove) => {
        if (premove.from[0] === coords[0] && premove.from[1] === coords[1]
          && !directions.includes(premove.direction)) {
          directions += `${premove.direction} `;
        }
      });
      return (
        <Square
          key={coords.toString()}
          army={square.army}
          owner={square.owner}
          terrain={square.terrain}
          selected={selectClass}
          select={selectSquare}
          directions={directions}
        />
      );
    });
    return (
      <tr key={y.toString()}>
        {squares}
      </tr>
    );
  });

  document.onkeydown = (e: KeyboardEvent) => {
    if (!selected) {
      return;
    }

    let x: Coor | undefined = selected;
    let direction = '';
    if (e.code === 'KeyW' && selected[0] > 0) {
      x = [selected[0] - 1, selected[1]];
      direction = 'up';
    } else if (e.code === 'KeyS' && selected[0] < game.length - 1) {
      x = [selected[0] + 1, selected[1]];
      direction = 'down';
    } else if (e.code === 'KeyA' && selected[1] > 0) {
      x = [selected[0], selected[1] - 1];
      direction = 'left';
    } else if (e.code === 'KeyD' && selected[1] < game[0].length - 1) {
      x = [selected[0], selected[1] + 1];
      direction = 'right';
    } else if (e.code === 'KeyQ') {
      setPremoves([]);
      return;
    }
    setPremoves([...premoves, { from: selected, to: x, direction }]);
    setSelected({ selected: x });
  };

  return (
    <div className="game container-fluid">
      <table className="game__table">
        <tbody>
          {board}
        </tbody>
      </table>
      <Score scores={[{
        player: 'Paly', land: '69', army: '420', color: 'blue',
      }, {
        player: 'Duri', land: '96', army: '50', color: 'red',
      }, {
        player: 'Dano', land: '9', army: '40', color: 'green',
      }, {
        player: 'Filo', land: '79', army: '42', color: 'purple',
      }]}
      />
    </div>
  );
};

export default Game;
