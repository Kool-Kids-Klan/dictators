import React from 'react';
import { useRecoilState } from 'recoil';
import { gameState } from '../../store/atoms';

interface ISquare {
  number?: number,
  color?: string,
  coords: [number, number]
}

const Square: React.FC<ISquare> = (props) => {
  const { number, color, coords } = props;

  const [selected, selectSquare] = useRecoilState(gameState);
  const selectClass = (selected.selected === coords) ? 'selected' : '';

  return (
    <td className={`${color} ${selectClass}`} onClick={() => selectSquare({ selected: coords })}>{number}</td>
  );
};

export default Square;
