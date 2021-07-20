import React from 'react';

interface ILeaderboardItemProps {
  username: string,
  games_won: number,
  games_played: number,
}

const LeaderboardItem = ({ username, games_won, games_played }: ILeaderboardItemProps) => (
  <div className="leaderboard__item">
    <span className="leaderboard__user">{username}</span>
    <span className="leaderboard__games-won">{games_won}</span>
    <span className="leaderboard__games-played">{games_played}</span>
  </div>
);

export default LeaderboardItem;
