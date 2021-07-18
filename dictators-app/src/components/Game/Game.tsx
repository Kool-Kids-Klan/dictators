import React, { useState } from 'react';
import './Game.css';
import { SetterOrUpdater, useRecoilState, useRecoilValue } from 'recoil';
import Tile from './Tile';
import Score from './Score';
import { gameState, premovesState, scoreState } from '../../store/atoms';
import { Coor } from '../../resources/types/types';

const Game = () => {
  const { game } = useRecoilValue(gameState);
  const [premoves, setPremoves] = useRecoilState(premovesState);
  const [scores, setScores] = useRecoilState(scoreState);
  // TODO delete default value / set to base Coor from backend
  const [selected, setSelected]: [Coor, SetterOrUpdater<Coor>] = useState([-1, -1]);
  // connect(setGame);

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
      const selectClass = (coords[0] === selected[0] && coords[1] === selected[1]) ? 'selected' : '';
      const selectSquare = () => setSelected(coords);
      // TODO overwrites terrain in CSS
      let directions = '';
      premoves.forEach((premove) => {
        if (premove.from[0] === coords[0] && premove.from[1] === coords[1]
          && !directions.includes(premove.direction)) {
          directions += `${premove.direction} `;
        }
      });
      return (
        <Tile
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
    setSelected(x);
  };

  return (
    <div className="game container-fluid">
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
