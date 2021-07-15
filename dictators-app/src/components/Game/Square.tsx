import React from 'react';
import { useRecoilState } from 'recoil';
import { gameState } from '../../store/atoms';

interface ISquare {
  army?: number,
  owner?: string,
  terrain?: string,
  coords: [number, number]
}

const Square: React.FC<ISquare> = (props) => {
  const {
    army, owner, terrain, coords,
  } = props;

  const [{ selected }, selectSquare] = useRecoilState(gameState);
  const selectClass = (selected && coords[0] === selected[0] && coords[1] === selected[1]) ? 'selected' : '';

  return (
    <td className={`${owner} ${terrain} ${selectClass}`} onClick={() => selectSquare({ selected: coords })}>{army}</td>
  );
};

export default Square;
