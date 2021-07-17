import React from 'react';

interface ISquare {
  army?: number,
  owner?: string,
  terrain?: string,
  selected?: string,
  select: () => void,
  directions?: string,
}

const Square: React.FC<ISquare> = ({
  army, owner, terrain, selected, select, directions,
}) => (
  <td className={`${owner} ${terrain} ${selected} ${directions}`} onClick={select}>{army}</td>
);

export default Square;
