import React from 'react';
import { ISquare } from '../../resources/types/types';

const Square: React.FC<ISquare> = ({
  army, owner, terrain, selected, select, directions,
}) => (
  <td className={`game__tile ${owner} ${terrain} ${selected} ${directions}`} onClick={select}>{army}</td>
);

export default Square;
