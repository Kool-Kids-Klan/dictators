import React, { useState, useEffect } from 'react';
import { SetterOrUpdater } from 'recoil';
import { LEADERBOARD_URL } from '../../utils/endpoints';
import LeaderboardItem from './LeaderboardItem';

interface ILeaderboardItem {
  username: string,
  games_won: number,
  games_played: number,
}

const Leaderboard = () => {
  const [leaders, setLeaders] = useState<ILeaderboardItem[]>([]);
  useEffect(() => {
    async function getLeaders() {
      const leadersRequest = await fetch(LEADERBOARD_URL);
      const leadersData = await leadersRequest.json();
      setLeaders(leadersData);
    }
  });
  return (
    <div className="leaderboard">
      {leaders.map((leader) => (
        <LeaderboardItem
          username={leader.username}
          games_won={leader.games_won}
          games_played={leader.games_played}
        />
      ))}
    </div>
  );
};

export default Leaderboard;
