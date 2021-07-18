import React from 'react';
import { ITile } from '../../resources/types/types';

const Square: React.FC<ITile> = ({
  army, owner, terrain, selected, select, directions,
}) => (
  <td className={`game__tile ${owner} ${terrain} ${selected} ${directions}`} onClick={select}>{army}</td>
);

export default Square;
