import React from 'react';
import './Game.css';
import Square from './Square';

const Game = () => {
  const game = [
    [{ number: 1, color: 'blue' }, { number: 120, color: 'blue' }, {}, { number: 10, color: 'red' }],
    [{ number: 1, color: 'blue' }, { number: 120, color: 'blue' }, { number: 1, color: 'red' }, { number: 10, color: 'red' }],
    [{ number: 1, color: 'blue' }, {}, { number: 1, color: 'red' }, { number: 10, color: 'green' }],
    [{}, { number: 120, color: 'blue' }, { number: 1, color: 'red' }, { number: 10, color: 'red' }],
  ];

  let y = 0;
  const board = game.map((row) => {
    let x = 0;
    const squares = row.map((square) => {
      x += 1;
      return (
        <Square
          key={[x - 1, y].toString()}
          coords={[x - 1, y]}
          number={square.number}
          color={square.color}
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
