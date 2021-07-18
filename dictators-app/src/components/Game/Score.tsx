import React from 'react';
import { IScoreProps } from '../../resources/types/types';

const Score = ({ scores }: IScoreProps) => {
  const playerRows = scores.map((score) => (
    <tr className={score.color}>
      <td className="score__cell">{score.player}</td>
      <td className="score__cell">{score.land}</td>
      <td className="score__cell">{score.army}</td>
    </tr>
  ));

  return (
    <table className="score">
      <thead>
        <tr>
          <th className="score__cell-head">Player</th>
          <th className="score__cell-head">Land</th>
          <th className="score__cell-head">Army</th>
        </tr>
      </thead>
      <tbody>
        {playerRows}
      </tbody>
    </table>
  );
};

export default Score;
