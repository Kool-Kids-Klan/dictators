import React, { useState, useEffect } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
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
    getLeaders();
  }, []);
  return (
    <div className="leaderboard">
      <header className="leaderboard__header">
        Leaderboard
      </header>
      {leaders.map((leader, index) => (
        <LeaderboardItem
          key={leader.username}
          username={leader.username}
          games_won={leader.games_won}
          games_played={leader.games_played}
          index={index}
        />
      ))}
      <LinkContainer to="/">
        <button className="home-btn" type="button">
          Home
        </button>
      </LinkContainer>
    </div>
  );
};

export default Leaderboard;
