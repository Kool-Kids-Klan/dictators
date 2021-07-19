import React, { useState } from 'react';
import './Game.css';
import { SetterOrUpdater, useRecoilState, useRecoilValue } from 'recoil';
import Tile from './Tile';
import Score from './Score';
import {
  appState, gameState, premovesState, scoreState,
} from '../../store/atoms';
import { Coor } from '../../resources/types/types';
import { currentGameSocket } from '../../store/selectors';
import GameMenu from './GameMenu';

const Game = () => {
  const { game } = useRecoilValue(gameState);
  const [premoves, setPremoves] = useRecoilState(premovesState);
  const scores = useRecoilValue(scoreState);
  const { username } = useRecoilValue(appState);
  const gameSocket = useRecoilValue(currentGameSocket);
  // TODO delete default value / set to base Coor from backend
  const [selected, setSelected]: [Coor, SetterOrUpdater<Coor>] = useState([-1, -1]);
  const [menu, setMenu] = useState(false);

  const board = game.map((row, y) => {
    const squares = row.map((square, x) => {
      const coords: Coor = [y, x];
      const selectClass = (coords[0] === selected[0] && coords[1] === selected[1]) ? 'selected' : '';
      const selectSquare = () => setSelected(coords);
      // TODO overwrites terrain in CSS
      const directions: Set<string> = new Set();
      premoves.forEach((premove) => {
        if (premove.from[0] === coords[0] && premove.from[1] === coords[1]) {
          directions.add(premove.direction);
        }
      });
      return (
        <Tile
          key={coords.toString()}
          army={square.army}
          owner={square.color}
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
    let pressedKey = '';
    if (e.code === 'KeyW' && selected[0] > 0) {
      x = [selected[0] - 1, selected[1]];
      direction = 'up';
      pressedKey = 'W';
    } else if (e.code === 'KeyS' && selected[0] < game.length - 1) {
      x = [selected[0] + 1, selected[1]];
      direction = 'down';
      pressedKey = 'S';
    } else if (e.code === 'KeyA' && selected[1] > 0) {
      x = [selected[0], selected[1] - 1];
      direction = 'left';
      pressedKey = 'A';
    } else if (e.code === 'KeyD' && selected[1] < game[0].length - 1) {
      x = [selected[0], selected[1] + 1];
      direction = 'right';
      pressedKey = 'D';
    } else if (e.code === 'KeyE') {
      if (premoves.length < 1) {
        return;
      }
      setPremoves(premoves.slice(0, -1));
      setSelected(premoves[premoves.length - 1].from);
      return;
    } else if (e.code === 'KeyQ') {
      if (premoves.length > 0) {
        setSelected(premoves[0].from);
      }
      setPremoves([]);
      return;
    } else if (e.code === 'Escape') {
      setMenu(!menu);
      return;
    } else {
      return;
    }
    setPremoves([...premoves, { from: selected, direction }]);
    const data = {
      event: 'MAKE_MOVE',
      message: {
        key: pressedKey,
        username,
        coor: selected,
      },
    };
    setSelected(x);
    gameSocket.send(JSON.stringify(data));
  };

  const gameMenu = (menu) ? (
    <GameMenu />
  ) : <></>;

  return (
    <div className="game container-fluid">
      {gameMenu}
      <table className="game__table">
        <tbody>
          {board}
        </tbody>
      </table>
      <Score scores={scores} />
    </div>
  );
};

export default Game;
