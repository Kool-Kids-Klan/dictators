import React from 'react';
import './Game.css';
import { useRecoilState } from 'recoil';
import Square from './Square';
import { Coor, gameState, premovesState } from '../../store/atoms';

const Game = () => {
  const [premoves, setPremoves] = useRecoilState(premovesState);
  const [{ selected }, setSelected] = useRecoilState(gameState);

  const game = [
    [{ army: 1, owner: 'blue', terrain: 'barracks' }, { army: 120, owner: 'blue' }, { army: 1, owner: 'purple' }, { army: 10, owner: 'red' }],
    [{ army: 1, owner: 'blue' }, { army: 120, owner: 'blue', terrain: 'capital' }, { army: 1, owner: 'red', terrain: 'mountains' }, { army: 10, owner: 'red' }],
    [{ army: 1, owner: 'blue' }, { army: 1, owner: 'purple' }, { army: 1, owner: 'red' }, { army: 10, owner: 'green' }],
    [{ terrain: 'capital' }, { army: 120, owner: 'blue' }, { army: 1, owner: 'red', terrain: 'barracks' }, { army: 10, owner: 'red' }],
  ];

  let y = 0;
  const board = game.map((row) => {
    let x = 0;
    const squares = row.map((square) => {
      x += 1;
      return (
        <Square
          key={[y, x - 1].toString()}
          coords={[y, x - 1]}
          army={square.army}
          owner={square.owner}
          terrain={square.terrain}
        />
      );
    });
    y += 1;
    return (
      <tr key={y}>
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
    <div className="Game container-fluid">
      <table>
        <tbody>
          {board}
        </tbody>
      </table>
    </div>
  );
};

export default Game;
