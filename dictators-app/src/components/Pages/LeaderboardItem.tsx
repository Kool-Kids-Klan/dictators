import React from 'react';

interface ILeaderboardItemProps {
  username: string,
  games_won: number,
  games_played: number,
  index: number,
}

const LeaderboardItem = ({
  username, games_won, games_played, index,
}: ILeaderboardItemProps) => (
  <div className="leaderboard__item">
    <span className="leaderboard__user">
      {`${index + 1}. place: ${username}`}
    </span>
    <span className="leaderboard__games-won">
      Won:
      {' '}
      {games_won}
    </span>
    <span className="leaderboard__games-played">
      Played:
      {' '}
      {games_played}
    </span>
  </div>
);

export default LeaderboardItem;
