import React from 'react';
import { ITile } from '../../resources/types/types';
import Arrow from '../../resources/images/arrow.svg';

const Square: React.FC<ITile> = ({
  army, owner, terrain, selected, select, directions,
}) => (
  <td className={`game__tile ${owner} ${terrain} ${selected}`} onClick={select}>
    <span>{army}</span>
    {Array.from(directions).map((direction) => <img key={direction} src={Arrow} alt="direction" className={`game__arrow game__arrow--${direction}`} />)}
  </td>
);

export default Square;
